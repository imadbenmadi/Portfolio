import { getAllSkills, createSkill } from '../../../lib/db'
import { withAuth } from '../../../lib/auth'

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const skills = await getAllSkills()
      return res.status(200).json(skills)
    } catch (err) {
      return res.status(500).json({ error: err.message })
    }
  }

  if (req.method === 'POST') {
    return withAuth(async (req, res) => {
      try {
        const skill = await createSkill(req.body)
        return res.status(201).json(skill)
      } catch (err) {
        return res.status(500).json({ error: err.message })
      }
    })(req, res)
  }

  res.setHeader('Allow', ['GET', 'POST'])
  res.status(405).end(`Method ${req.method} Not Allowed`)
}
