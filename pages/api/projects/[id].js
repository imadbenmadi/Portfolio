import {
  getProjectBySlug,
  updateProject,
  deleteProject,
  sql
} from '../../../lib/db'
import { withAuth } from '../../../lib/auth'

async function handler(req, res) {
  const { id } = req.query

  if (req.method === 'GET') {
    try {
      // id could be numeric id or slug
      const isNumeric = /^\d+$/.test(id)
      let project
      if (isNumeric) {
        const { rows } =
          await sql`SELECT * FROM projects WHERE id = ${parseInt(id)}`
        project = rows[0]
      } else {
        project = await getProjectBySlug(id)
      }
      if (!project) return res.status(404).json({ error: 'Project not found' })
      return res.status(200).json(project)
    } catch (err) {
      return res.status(500).json({ error: err.message })
    }
  }

  if (req.method === 'PUT') {
    const {
      title,
      slug,
      description,
      year,
      tech_stack,
      live_url,
      github_url,
      thumbnail_url,
      images,
      category
    } = req.body

    if (!title || !slug) {
      return res.status(400).json({ error: 'title and slug are required' })
    }

    try {
      const updated = await updateProject(parseInt(id), {
        title,
        slug,
        description,
        year,
        tech_stack: Array.isArray(tech_stack)
          ? tech_stack
          : tech_stack
            ? tech_stack.split(',').map(s => s.trim())
            : [],
        live_url,
        github_url,
        thumbnail_url,
        images: Array.isArray(images) ? images : [],
        category: category || 'main'
      })
      if (!updated) return res.status(404).json({ error: 'Project not found' })
      return res.status(200).json(updated)
    } catch (err) {
      return res.status(500).json({ error: err.message })
    }
  }

  if (req.method === 'DELETE') {
    try {
      await deleteProject(parseInt(id))
      return res.status(200).json({ success: true })
    } catch (err) {
      return res.status(500).json({ error: err.message })
    }
  }

  return res.status(405).json({ error: 'Method not allowed' })
}

export default async function routeHandler(req, res) {
  if (req.method === 'GET') {
    return handler(req, res)
  }
  return withAuth(handler)(req, res)
}
