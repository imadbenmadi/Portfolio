import { reorderSkills } from '../../../lib/db'
import { withAuth } from '../../../lib/auth'

export default async function handler(req, res) {
  if (req.method !== 'PUT') {
    res.setHeader('Allow', ['PUT'])
    return res.status(405).json({ error: 'Method not allowed' })
  }

  return withAuth(async (req, res) => {
    try {
      const { category, orderedIds } = req.body || {}
      if (!category || !Array.isArray(orderedIds)) {
        return res
          .status(400)
          .json({ error: 'Expected { category, orderedIds: number[] }' })
      }
      const rows = await reorderSkills(category, orderedIds)
      return res.status(200).json(rows)
    } catch (err) {
      return res.status(500).json({ error: err.message })
    }
  })(req, res)
}
