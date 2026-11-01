export async function generateMealPlan(prompt: string) {
  // Calls our own serverless function, which holds the Groq API key server-side.
  const res = await fetch('/api/groq', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 1024,
    }),
  })

  const data = await res.json()

  if (!res.ok) {
    throw new Error(data.error?.message || 'Request failed')
  }

  return data.choices?.[0]?.message?.content || 'No response'
}
