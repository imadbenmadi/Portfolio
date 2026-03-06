import { getAllCertificates, createCertificate } from '../../../lib/db'
import { withAuth } from '../../../lib/auth'

async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const items = await getAllCertificates()
      return res.status(200).json(items)
    } catch (err) {
      return res.status(500).json({ error: err.message })
    }
  }

  if (req.method === 'POST') {
    const { title, issuer, issue_date, file_url, file_type } = req.body || {}

    if (!title || !file_url) {
      return res.status(400).json({ error: 'title and file_url are required' })
    }

    try {
      const created = await createCertificate({
        title,
        issuer,
        issue_date,
        file_url,
        file_type
      })
      return res.status(201).json(created)
    } catch (err) {
      return res.status(500).json({ error: err.message })
    }
  }

  return res.status(405).json({ error: 'Method not allowed' })
}

// GET is public, POST requires auth
export default async function routeHandler(req, res) {
  if (req.method === 'GET') return handler(req, res)
  return withAuth(handler)(req, res)
}
