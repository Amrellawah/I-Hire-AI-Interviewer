import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
});

export async function POST(req) {
  try {
    const { cvText } = await req.json();

    if (!cvText) {
      return NextResponse.json(
        { error: 'CV text is required' },
        { status: 400 }
      );
    }

    const prompt = `Please analyze the following CV text and extract key information in a structured JSON format. Include the following fields:
    - name
    - email
    - phone
    - education (array of objects with degree, institution, year)
    - experience (array of objects with company, position, duration, responsibilities as an array of strings)
    - skills (array of strings)
    - languages (array of strings)
    - certifications (array of strings)
    
    Make sure that the responsibilities field in experience is always an array of strings, even if there's only one responsibility.
    
    CV Text:
    ${cvText}`;

    const completion = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are a CV parser that extracts structured information from CV text. Return only valid JSON."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      model: "gpt-4o-mini",
      response_format: { type: "json_object" },
    });

    const extractedData = JSON.parse(completion.choices[0].message.content);

    return NextResponse.json(extractedData);
  } catch (error) {
    console.error('Error analyzing CV:', error);
    return NextResponse.json(
      { error: 'Failed to analyze CV' },
      { status: 500 }
    );
  }
} 