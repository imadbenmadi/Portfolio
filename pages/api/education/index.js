import { getAllEducation, createEducation } from '../../../lib/db'
import { withAuth } from '../../../lib/auth'

async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const education = await getAllEducation()
      return res.status(200).json(education)
    } catch (err) {
      return res.status(500).json({ error: err.message })
    }
  }

  if (req.method === 'POST') {
    const { institution, degree, field, start_date, end_date, description } =
      req.body
    if (!institution || !degree) {
      return res
        .status(400)
        .json({ error: 'institution and degree are required' })
    }
    try {
      const edu = await createEducation({
        institution,
        degree,
        field,
        start_date,
        end_date,
        description
      })
      return res.status(201).json(edu)
    } catch (err) {
      return res.status(500).json({ error: err.message })
    }
  }

  return res.status(405).json({ error: 'Method not allowed' })
}

export default async function routeHandler(req, res) {
  if (req.method === 'GET') return handler(req, res)
  return withAuth(handler)(req, res)
}
