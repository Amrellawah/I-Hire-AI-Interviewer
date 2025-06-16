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

    const prompt = `
    Act like an expert natural language processing system specialized in parsing CVs and resumes. Your task is to extract structured data from freeform CV text and return it strictly in JSON format. Do not return any explanations, notes, or additional text—only valid JSON.

    Objective: Analyze a block of CV or resume text and identify the most relevant structured information fields for downstream use in HR software or recruitment systems.

    Instructions:
    Step 1: Carefully read and understand the entire CV text, paying attention to both explicit headings and implied patterns in the content.
    Step 2: Identify and extract the following fields with high accuracy and return them using the precise JSON schema below:
    - name (string): Full name of the person.
    - email (string): Valid email address.
    - phone (string): Valid phone number with or without country code.
    - education (array of objects): Each object should include:
    - degree (e.g., BSc Computer Science)
    - institution (e.g., Stanford University)
    - year (e.g., 2020 or a string range like "2017–2021")
    - experience (array of objects): Each object should include:
    - company (e.g., Microsoft)
    - position (e.g., Software Engineer)
    - duration (e.g., Jan 2019 – Mar 2023)
    - responsibilities (array of strings): One string per responsibility; always return an array even if there's only one item.
    - skills (array of strings): List technical and soft skills.
    - languages (array of strings): Include only human languages mentioned.
    - certifications (array of strings): Include any professional certifications or licenses.

    Step 3: Ensure that the JSON is valid, syntactically correct, and represents all information found. If a section is missing, omit the field entirely rather than returning empty strings or arrays.

    Step 4: Wrap your entire response strictly in JSON format and nothing else.
    
    CV Text:
    ${cvText}

    Take a deep breath and work on this problem step-by-step.`;

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