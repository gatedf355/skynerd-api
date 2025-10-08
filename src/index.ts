import { Hono } from 'hono'
import { cors } from 'hono/cors'

type Bindings = {
  FR24_TOKEN?: string
  ALLOWED_ORIGINS?: string
}

const app = new Hono<{ Bindings: Bindings }>()

app.use('*', cors({
  origin: (origin, c) => {
    const allowed = (c.env.ALLOWED_ORIGINS ?? '').split(',').map(s => s.trim())
    return allowed.includes(origin) ? origin : 'https://skynerd.io'
  },
  allowMethods: ['GET'],
  allowHeaders: ['Content-Type']
}))

app.get('/health', c => c.json({ ok: true, t: Date.now() }))

app.get('/flights', async c => {
  const bounds = c.req.query('bounds')
  if (!bounds) return c.json({ error: 'bounds required' }, 400)
  return c.json({ meta: { bounds }, flights: [] })
})

export default app
