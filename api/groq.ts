// Vercel serverless function.
// Proxies chat requests to Groq so GROQ_API_KEY lives on the server and is
// never shipped to the browser. The client calls POST /api/groq instead of
// talking to Groq directly. Responses mirror Groq's shape (choices / error),
// so the frontend can read data.choices[0].message.content as before.
export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: { message: 'Method not allowed' } });
    return;
  }

  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    res.status(500).json({ error: { message: 'Server is missing GROQ_API_KEY' } });
    return;
  }

  const model = process.env.GROQ_MODEL || 'openai/gpt-oss-120b';

  // Body may arrive already parsed or as a raw string depending on the runtime
  const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});
  const { messages, max_tokens = 1024, reasoning_effort = 'low' } = body;

  if (!Array.isArray(messages) || messages.length === 0) {
    res.status(400).json({ error: { message: 'messages array is required' } });
    return;
  }

  try {
    const groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({ model, messages, max_tokens, reasoning_effort }),
    });

    const data = await groqRes.json();
    res.status(groqRes.status).json(data);
  } catch {
    res.status(502).json({ error: { message: 'Failed to reach the AI service' } });
  }
}
