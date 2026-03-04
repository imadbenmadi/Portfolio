import { getAuthPayload } from '../../../lib/auth'

export default function handler(req, res) {
  const payload = getAuthPayload(req)
  if (!payload) {
    return res.status(401).json({ error: 'Unauthorized' })
  }
  return res
    .status(200)
    .json({ username: payload.username, role: payload.role })
}
