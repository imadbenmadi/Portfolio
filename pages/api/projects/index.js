import { getAllProjects, createProject } from '../../../lib/db'
import { withAuth } from '../../../lib/auth'

async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const projects = await getAllProjects()
      return res.status(200).json(projects)
    } catch (err) {
      return res.status(500).json({ error: err.message })
    }
  }

  if (req.method === 'POST') {
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
      const project = await createProject({
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
      return res.status(201).json(project)
    } catch (err) {
      if (err.message?.includes('unique')) {
        return res
          .status(409)
          .json({ error: 'A project with this slug already exists' })
      }
      return res.status(500).json({ error: err.message })
    }
  }

  return res.status(405).json({ error: 'Method not allowed' })
}

// GET is public, POST requires auth
export default async function routeHandler(req, res) {
  if (req.method === 'GET') {
    return handler(req, res)
  }
  return withAuth(handler)(req, res)
}
