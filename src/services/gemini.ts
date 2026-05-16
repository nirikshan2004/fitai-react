export async function generateMealPlan(prompt: string) {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
      }),
    }
  )

  const data = await res.json()
  console.log(data)

  if (!res.ok) {
    throw new Error(data.error?.message || 'Request failed')
  }

  return data.candidates?.[0]?.content?.parts?.[0]?.text || 'No response'
}