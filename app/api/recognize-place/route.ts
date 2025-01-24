import { NextResponse } from 'next/server';
import { ImageAnnotatorClient } from '@google-cloud/vision';

const vision = new ImageAnnotatorClient();

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const image = formData.get('image') as Blob;
    const buffer = Buffer.from(await image.arrayBuffer());

    // Perform landmark detection
    const [result] = await vision.landmarkDetection({
      image: { content: buffer }
    });
    const landmarks = result.landmarkAnnotations || [];

    if (landmarks.length === 0) {
      return NextResponse.json({
        error: 'No landmarks detected'
      }, { status: 404 });
    }

    const landmark = landmarks[0];
    return NextResponse.json({
      placeName: landmark.description,
      confidence: landmark.score,
      landmarks: landmarks.map(l => l.description),
      coordinates: landmark.locations?.[0]?.latLng
    });

  } catch (error) {
    console.error('Place recognition failed:', error);
    return NextResponse.json({
      error: 'Failed to process image'
    }, { status: 500 });
  }
} 