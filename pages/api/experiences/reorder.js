import { reorderExperiences } from '../../../lib/db'
import { withAuth } from '../../../lib/auth'

export default async function handler(req, res) {
  if (req.method !== 'PUT') {
    res.setHeader('Allow', ['PUT'])
    return res.status(405).json({ error: 'Method not allowed' })
  }

  return withAuth(async (req, res) => {
    try {
      const { orderedIds } = req.body || {}
      if (!Array.isArray(orderedIds)) {
        return res
          .status(400)
          .json({ error: 'Expected { orderedIds: number[] }' })
      }
      const rows = await reorderExperiences(orderedIds)
      return res.status(200).json(rows)
    } catch (err) {
      return res.status(500).json({ error: err.message })
    }
  })(req, res)
}
