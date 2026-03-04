import { getAllExperiences, createExperience } from '../../../lib/db'
import { withAuth } from '../../../lib/auth'

async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const experiences = await getAllExperiences()
      return res.status(200).json(experiences)
    } catch (err) {
      return res.status(500).json({ error: err.message })
    }
  }

  if (req.method === 'POST') {
    const { company, role, description, start_date, end_date, location } =
      req.body
    if (!company || !role) {
      return res.status(400).json({ error: 'company and role are required' })
    }
    try {
      const exp = await createExperience({
        company,
        role,
        description,
        start_date,
        end_date,
        location
      })
      return res.status(201).json(exp)
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
