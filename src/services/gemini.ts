export async function generateMealPlan(prompt: string) {
  const apiKey = import.meta.env.VITE_GROQ_API_KEY
  const model = import.meta.env.VITE_GROQ_MODEL || 'openai/gpt-oss-120b'

  const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 1024,
      reasoning_effort: 'low',
    }),
  })

  const data = await res.json()
  console.log(data)

  if (!res.ok) {
    throw new Error(data.error?.message || 'Request failed')
  }

  return data.choices?.[0]?.message?.content || 'No response'
}