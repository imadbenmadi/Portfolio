import { updateExperience, deleteExperience } from '../../../lib/db'
import { withAuth } from '../../../lib/auth'

async function handler(req, res) {
  const { id } = req.query

  if (req.method === 'PUT') {
    const { company, role, description, start_date, end_date, location } =
      req.body
    if (!company || !role) {
      return res.status(400).json({ error: 'company and role are required' })
    }
    try {
      const updated = await updateExperience(parseInt(id), {
        company,
        role,
        description,
        start_date,
        end_date,
        location
      })
      if (!updated)
        return res.status(404).json({ error: 'Experience not found' })
      return res.status(200).json(updated)
    } catch (err) {
      return res.status(500).json({ error: err.message })
    }
  }

  if (req.method === 'DELETE') {
    try {
      await deleteExperience(parseInt(id))
      return res.status(200).json({ success: true })
    } catch (err) {
      return res.status(500).json({ error: err.message })
    }
  }

  return res.status(405).json({ error: 'Method not allowed' })
}

export default withAuth(handler)
