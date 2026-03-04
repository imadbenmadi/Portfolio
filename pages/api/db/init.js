import { initDB } from '../../../lib/db'
import { getAuthPayload } from '../../../lib/auth'

export default async function handler(req, res) {
  // Protect behind admin auth
  const payload = getAuthPayload(req)
  if (!payload) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  try {
    await initDB()
    return res
      .status(200)
      .json({ success: true, message: 'Database initialized successfully' })
  } catch (err) {
    console.error('DB init error:', err)
    return res.status(500).json({ error: err.message })
  }
}
