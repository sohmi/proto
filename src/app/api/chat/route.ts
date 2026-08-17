import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';

// Optional: Use Edge runtime for faster cold starts
export const runtime = 'edge';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

const SYSTEM_PROMPT = `
You are the AI Panchayat Assistant. Your job is to help rural citizens with government schemes, 
procedures for certificates, and general village administration queries.
Always speak in simple, plain language. Be concise. Do not use complex jargon.
If the user asks in Hindi, reply in Hindi. If English, reply in English.
Be empathetic and helpful.
`;

export async function POST(req: Request) {
  try {
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: 'Gemini API key not configured' },
        { status: 500 }
      );
    }

    const { messages } = await req.json();
    
    // We'll use gemini-1.5-flash for speed
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    
    const formattedMessages = messages.map((m: any) => ({
      role: m.role === 'user' ? 'user' : 'model',
      parts: [{ text: m.content }],
    }));

    // Inject system prompt manually by prepending it to the conversation
    // or using systemInstruction if available in the SDK version.
    const chat = model.startChat({
      history: [
        { role: 'user', parts: [{ text: "System prompt: " + SYSTEM_PROMPT + "\n\nI understand." }] },
        { role: 'model', parts: [{ text: "Understood. How can I help you today?" }] },
        ...formattedMessages.slice(0, -1)
      ],
    });

    const lastMessage = formattedMessages[formattedMessages.length - 1].parts[0].text;
    const result = await chat.sendMessage(lastMessage);
    const responseText = result.response.text();

    return NextResponse.json({ text: responseText });
    
  } catch (error: any) {
    console.error('Chat API Error:', error);
    return NextResponse.json(
      { error: 'Failed to generate response' },
      { status: 500 }
    );
  }
}
