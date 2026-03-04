import { getHomepage, updateHomepage } from '../../lib/db'
import { withAuth } from '../../lib/auth'

async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const data = await getHomepage()
      return res.status(200).json(data || {})
    } catch (err) {
      return res.status(500).json({ error: err.message })
    }
  }

  if (req.method === 'PUT') {
    try {
      const updated = await updateHomepage(req.body)
      return res.status(200).json(updated)
    } catch (err) {
      return res.status(500).json({ error: err.message })
    }
  }

  return res.status(405).json({ error: 'Method not allowed' })
}

export default async function routeHandler(req, res) {
  if (req.method === 'GET') return handler(req, res)
  return withAuth(handler)(req, res)
}
