import { updateCertificate, deleteCertificate } from '../../../lib/db'
import { withAuth } from '../../../lib/auth'

async function handler(req, res) {
  const { id } = req.query
  const numericId = Number(id)

  if (!Number.isFinite(numericId)) {
    return res.status(400).json({ error: 'Invalid id' })
  }

  if (req.method === 'PUT') {
    const { title, issuer, issue_date, file_url, file_type } = req.body || {}

    if (!title || !file_url) {
      return res.status(400).json({ error: 'title and file_url are required' })
    }

    try {
      const updated = await updateCertificate(numericId, {
        title,
        issuer,
        issue_date,
        file_url,
        file_type
      })
      if (!updated) return res.status(404).json({ error: 'Not found' })
      return res.status(200).json(updated)
    } catch (err) {
      return res.status(500).json({ error: err.message })
    }
  }

  if (req.method === 'DELETE') {
    try {
      await deleteCertificate(numericId)
      return res.status(200).json({ success: true })
    } catch (err) {
      return res.status(500).json({ error: err.message })
    }
  }

  return res.status(405).json({ error: 'Method not allowed' })
}

export default withAuth(handler)
