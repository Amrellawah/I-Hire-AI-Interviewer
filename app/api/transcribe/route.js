import { OpenAI } from 'openai';
import { NextResponse } from 'next/server';

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
});

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');

    if (!file) {
      return NextResponse.json(
        { error: 'No audio file provided' },
        { status: 400 }
      );
    }

    // Convert to OpenAI-compatible format
    const buffer = await file.arrayBuffer();
    const transcription = await openai.audio.transcriptions.create({
      file: new Blob([buffer], { type: file.type }),
      model: 'whisper-1',
    });

    return NextResponse.json({
      text: transcription.text,
      language: transcription.language,
    });

  } catch (error) {
    console.error('Transcription error:', error);
    return NextResponse.json(
      { error: 'Failed to transcribe audio' },
      { status: 500 }
    );
  }
}