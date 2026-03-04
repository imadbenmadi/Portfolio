import { updateSkill, deleteSkill } from '../../../lib/db'
import { withAuth } from '../../../lib/auth'

export default async function handler(req, res) {
  const { id } = req.query

  if (req.method === 'PUT') {
    return withAuth(async (req, res) => {
      try {
        const skill = await updateSkill(Number(id), req.body)
        return res.status(200).json(skill)
      } catch (err) {
        return res.status(500).json({ error: err.message })
      }
    })(req, res)
  }

  if (req.method === 'DELETE') {
    return withAuth(async (req, res) => {
      try {
        await deleteSkill(Number(id))
        return res.status(200).json({ success: true })
      } catch (err) {
        return res.status(500).json({ error: err.message })
      }
    })(req, res)
  }

  res.setHeader('Allow', ['PUT', 'DELETE'])
  res.status(405).end(`Method ${req.method} Not Allowed`)
}
