from dotenv import load_dotenv
from fastapi import APIRouter, UploadFile, File, HTTPException, Form, Depends
from fastapi.encoders import jsonable_encoder
from google.cloud import translate_v2 as translate
import io
import os
from openai import OpenAI
from app.auth.auth_bearer import JWTBearer

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

translator_router = APIRouter()
load_dotenv()

credentials_path = os.getenv("GOOGLE_APPLICATION_CREDENTIALS")
if credentials_path:
    os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = credentials_path
else:
    raise EnvironmentError("GOOGLE_APPLICATION_CREDENTIALS is not set.")


def translate_text(target_language: str, text: str) -> dict:
    try:
        translate_client = translate.Client()

        if isinstance(text, bytes):
            text = text.decode("utf-8")

        result = translate_client.translate(text, target_language=target_language)

        return {
            "input_text": result["input"],
            "translated_text": result["translatedText"],
            "detected_source_language": result["detectedSourceLanguage"],
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Translation error: {str(e)}")


@translator_router.post(
    "/", dependencies=[Depends(JWTBearer())], summary="Transcribe and translate audio"
)
async def translate_audio(
    audio_file: UploadFile = File(...), target_language: str = Form(...)
):
    try:
        # Read the file content into bytes
        file_content = await audio_file.read()

        # Create a temporary file-like object
        audio_bytes = io.BytesIO(file_content)
        audio_bytes.name = audio_file.filename  # OpenAI needs filename

        # Get transcription from Whisper API
        transcription = client.audio.transcriptions.create(
            model="whisper-1", file=audio_bytes
        )

        # Extract the text from transcription object
        transcribed_text = transcription.text

        # Translate the transcribed text
        translation_result = translate_text(target_language, transcribed_text)

        data = {
            "original_text": transcribed_text,
            "translation": translation_result["translated_text"],
            "source_language": translation_result["detected_source_language"],
            "target_language": target_language,
        }

        return jsonable_encoder(data)

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing audio: {str(e)}")
