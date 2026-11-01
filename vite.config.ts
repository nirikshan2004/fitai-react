import { defineConfig, loadEnv, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'

// Dev-only: make `npm run dev` serve /api/groq locally, mirroring the Vercel
// serverless function in api/groq.ts. On Vercel this plugin does nothing —
// the real serverless function handles the route. Keeps the Groq key off the
// client in both environments.
function devGroqApi(env: Record<string, string>): Plugin {
  return {
    name: 'dev-groq-api',
    apply: 'serve',
    configureServer(server) {
      server.middlewares.use('/api/groq', async (req, res) => {
        if (req.method !== 'POST') {
          res.statusCode = 405
          res.end(JSON.stringify({ error: { message: 'Method not allowed' } }))
          return
        }

        const apiKey = env.GROQ_API_KEY
        if (!apiKey) {
          res.statusCode = 500
          res.end(JSON.stringify({ error: { message: 'Local .env is missing GROQ_API_KEY' } }))
          return
        }
        const model = env.GROQ_MODEL || 'openai/gpt-oss-120b'

        let raw = ''
        for await (const chunk of req) raw += chunk
        const body = raw ? JSON.parse(raw) : {}
        const { messages, max_tokens = 1024, reasoning_effort = 'low' } = body

        res.setHeader('Content-Type', 'application/json')

        if (!Array.isArray(messages) || messages.length === 0) {
          res.statusCode = 400
          res.end(JSON.stringify({ error: { message: 'messages array is required' } }))
          return
        }

        try {
          const groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${apiKey}`,
            },
            body: JSON.stringify({ model, messages, max_tokens, reasoning_effort }),
          })
          const data = await groqRes.text()
          res.statusCode = groqRes.status
          res.end(data)
        } catch {
          res.statusCode = 502
          res.end(JSON.stringify({ error: { message: 'Failed to reach the AI service' } }))
        }
      })
    },
  }
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Loads .env (including non-VITE vars like GROQ_API_KEY) for the dev proxy
  const env = loadEnv(mode, process.cwd(), '')
  return {
    plugins: [react(), devGroqApi(env)],
  }
})
