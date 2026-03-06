import { seedDefaultSkills, getAllSkills } from '../../../lib/db'
import { withAuth } from '../../../lib/auth'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST'])
    return res.status(405).json({ error: 'Method not allowed' })
  }

  return withAuth(async (req, res) => {
    try {
      const result = await seedDefaultSkills()
      // Back-compat: if older implementation returns an array
      if (Array.isArray(result)) {
        return res
          .status(200)
          .json({ insertedCount: result.length, skills: result })
      }

      const skills = result?.skills || (await getAllSkills())
      return res
        .status(200)
        .json({ insertedCount: result?.insertedCount || 0, skills })
    } catch (err) {
      return res.status(500).json({ error: err.message })
    }
  })(req, res)
}
