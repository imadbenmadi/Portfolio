import { updateEducation, deleteEducation } from '../../../lib/db'
import { withAuth } from '../../../lib/auth'

async function handler(req, res) {
  const { id } = req.query

  if (req.method === 'PUT') {
    const { institution, degree, field, start_date, end_date, description } =
      req.body
    if (!institution || !degree) {
      return res
        .status(400)
        .json({ error: 'institution and degree are required' })
    }
    try {
      const updated = await updateEducation(parseInt(id), {
        institution,
        degree,
        field,
        start_date,
        end_date,
        description
      })
      if (!updated)
        return res.status(404).json({ error: 'Education not found' })
      return res.status(200).json(updated)
    } catch (err) {
      return res.status(500).json({ error: err.message })
    }
  }

  if (req.method === 'DELETE') {
    try {
      await deleteEducation(parseInt(id))
      return res.status(200).json({ success: true })
    } catch (err) {
      return res.status(500).json({ error: err.message })
    }
  }

  return res.status(405).json({ error: 'Method not allowed' })
}

export default withAuth(handler)
