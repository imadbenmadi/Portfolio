import { verifyPassword, signToken, setAuthCookie } from '../../../lib/auth'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { username, password } = req.body

  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password required' })
  }

  const adminUsername = process.env.ADMIN_USERNAME
  const adminPasswordHash = process.env.ADMIN_PASSWORD_HASH

  if (!adminUsername || !adminPasswordHash) {
    return res.status(500).json({
      error:
        'Admin credentials not configured. Set ADMIN_USERNAME and ADMIN_PASSWORD_HASH env vars.'
    })
  }

  if (username !== adminUsername) {
    return res.status(401).json({ error: 'Invalid credentials' })
  }

  const valid = await verifyPassword(password, adminPasswordHash)
  if (!valid) {
    return res.status(401).json({ error: 'Invalid credentials' })
  }

  const token = signToken({ username, role: 'admin' })
  setAuthCookie(res, token)

  return res.status(200).json({ success: true })
}
