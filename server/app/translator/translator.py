from dotenv import load_dotenv
from fastapi import APIRouter, UploadFile, File, HTTPException
from fastapi.encoders import jsonable_encoder
from google.cloud import speech
from google.cloud import translate_v2 as translate
import io
import os

translator_router = APIRouter()

load_dotenv()

# Set the environment variable dynamically
credentials_path = os.getenv("GOOGLE_APPLICATION_CREDENTIALS")
if credentials_path:
    os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = credentials_path
else:
    raise EnvironmentError("GOOGLE_APPLICATION_CREDENTIALS is not set.")


# Utility function to translate text
def translate_text(target_language: str, text: str) -> dict:
    """
    Translates text into the target language using Google Cloud Translate API.

    Args:
        target_language (str): ISO 639-1 language code (e.g., 'es' for Spanish).
        text (str): The text to translate.

    Returns:
        dict: A dictionary containing the translation result.
    """
    translate_client = translate.Client()

    if isinstance(text, bytes):
        text = text.decode("utf-8")

    result = translate_client.translate(text, target_language=target_language)

    return {
        "input_text": result["input"],
        "translated_text": result["translatedText"],
        "detected_source_language": result["detectedSourceLanguage"],
    }


# Utility function to transcribe audio
def transcribe_audio(file_path: str) -> str:
    """
    Transcribes speech from an audio file using Google Cloud Speech-to-Text API.

    Args:
        file_path (str): Path to the input audio file.

    Returns:
        str: The transcribed text.
    """
    client = speech.SpeechClient()

    with io.open(file_path, "rb") as audio_file:
        content = audio_file.read()
        audio = speech.RecognitionAudio(content=content)

    config = speech.RecognitionConfig(
        encoding=speech.RecognitionConfig.AudioEncoding.LINEAR16,
        language_code="en-US",
    )

    response = client.recognize(request={"config": config, "audio": audio})

    # Combine all transcribed segments into a single string
    transcribed_text = " ".join(
        result.alternatives[0].transcript for result in response.results
    )

    return transcribed_text


# Main function to process the audio file
def process_audio(file_path: str, target_language: str) -> dict:
    """
    Processes an audio file by transcribing it and translating the transcription.

    Args:
        file_path (str): Path to the input audio file.
        target_language (str): ISO 639-1 language code for translation.

    Returns:
        dict: A dictionary containing the original transcription and its translation.
    """
    try:
        transcribed_text = transcribe_audio(file_path)
        translation_result = translate_text(target_language, transcribed_text)

        return {
            "original_text": transcribed_text,
            "translation": translation_result["translated_text"],
            "source_language": translation_result["detected_source_language"],
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An error occurred: {e}")


# API Endpoint to process and translate audio files
@translator_router.post("/", summary="Transcribe and translate audio")
async def translate_audio(file: UploadFile = File(...), target_language: str = "es"):
    """
    Endpoint to handle audio file uploads, transcribe speech, and translate it.

    Args:
        file (UploadFile): The uploaded audio file.
        target_language (str): Target language for translation (default: "es").

    Returns:
        dict: Transcribed and translated text.
    """
    try:
        # Save the uploaded file locally
        file_location = f"temp_{file.filename}"
        with open(file_location, "wb") as buffer:
            buffer.write(file.file.read())

        # Process the audio file
        result = process_audio(file_location, target_language)

        # Clean up temporary file
        os.remove(file_location)

        return {"data": jsonable_encoder(result)}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An error occurred: {e}")
