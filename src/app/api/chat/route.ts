import { NextResponse } from 'next/server';
import { supabase } from '../../../lib/supabase/client';

export const runtime = 'edge';

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    // 1. RAG: Fetch relevant context from Supabase
    // Fetch active schemes
    const { data: schemes, error: schemesError } = await supabase
      .from('schemes')
      .select('title, description, eligibility_criteria')
      .limit(5);
    
    // Fetch latest notices
    const { data: notices, error: noticesError } = await supabase
      .from('notices')
      .select('title, content')
      .order('created_at', { ascending: false })
      .limit(3);

    let contextData = '';
    if (schemes && schemes.length > 0) {
      contextData += "Available Government Schemes:\n" + schemes.map((s: any) => `- ${s.title}: ${s.description} (Eligibility: ${s.eligibility_criteria})`).join('\n') + "\n\n";
    }
    if (notices && notices.length > 0) {
      contextData += "Recent Panchayat Notices:\n" + notices.map((n: any) => `- ${n.title}: ${n.content}`).join('\n') + "\n\n";
    }

    const SYSTEM_PROMPT = `
You are the AI Panchayat Assistant. Your job is to help rural citizens with government schemes, 
procedures for certificates, and general village administration queries.
Always speak in simple, plain language. Be concise. Do not use complex jargon.
If the user asks in Hindi, reply in Hindi. If English, reply in English.
Be empathetic and helpful.

Here is the current information from the Panchayat database that you should use to answer questions:
${contextData}
`;

    const groqUrl = 'https://api.groq.com/openai/v1/chat/completions';
    const groqModel = 'llama3-8b-8192';

    // Format messages for Groq API
    const groqMessages = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...messages.map((m: any) => ({
        role: m.role === 'model' ? 'assistant' : m.role,
        content: m.content
      }))
    ];

    // 2. Attempt to query Groq
    try {
      if (!process.env.GROQ_API_KEY) {
        throw new Error('GROQ_API_KEY is missing');
      }

      const response = await fetch(groqUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.GROQ_API_KEY}`
        },
        body: JSON.stringify({
          model: groqModel,
          messages: groqMessages,
          stream: false
        })
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`Groq returned status: ${response.status} - ${errorData}`);
      }

      const data = await response.json();
      const responseText = data.choices?.[0]?.message?.content || "Sorry, I couldn't generate a response.";
      
      return NextResponse.json({ text: responseText });

    } catch (groqError) {
      console.warn("Groq API unavailable, triggering fallback logic:", groqError);
      
      // 3. Graceful Fallback if cloud model is down
      const fallbackText = "I am currently operating in offline/fallback mode because the AI model is unreachable. However, I can still help you! Please visit the Dashboard to file a grievance, or check the Scheme Finder for your eligibility. / मैं वर्तमान में ऑफ़लाइन मोड में काम कर रहा हूँ। कृपया शिकायत दर्ज करने या योजनाओं की जांच करने के लिए डैशबोर्ड पर जाएं।";
      
      return NextResponse.json({ text: fallbackText });
    }
    
  } catch (error: any) {
    console.error('Chat API Fatal Error:', error);
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    );
  }
}
