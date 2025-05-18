import { FEEDBACK_PROMPT } from '@/utils/Constants';
import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const systemMessage = {
  role: "system",
  content: "You are a helpful AI assistant skilled at generating structured interview questions and giving feedback.",
};

export async function POST(req) {
  const { conversation } = await req.json();

  const FINAL_PROMPT = FEEDBACK_PROMPT
    .replace('{{conversation}}', JSON.stringify(conversation));

  try {
    const openai = new OpenAI({
      apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
    });

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        systemMessage,
        {
          role: "user",
          content: FINAL_PROMPT,
        },
      ],
    });

    return NextResponse.json(completion.choices[0].message);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
