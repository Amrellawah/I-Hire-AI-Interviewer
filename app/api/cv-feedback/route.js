import { NextResponse } from 'next/server';

export async function POST(req) {
  const { cvText } = await req.json();

  // Call OpenAI API (or similar) for feedback
  const openaiRes = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.NEXT_PUBLIC_OPENAI_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are a professional career coach and CV reviewer.',
        },
        {
          role: 'user',
          content: `Please review the following CV and provide detailed, actionable feedback for improvement:\n\n${cvText}`,
        },
      ],
      max_tokens: 500,
    }),
  });

  const data = await openaiRes.json();
  console.log('OpenAI response:', data);
  const feedback = data.choices?.[0]?.message?.content || 'No feedback generated.';

  return NextResponse.json({ feedback });
} 