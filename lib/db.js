import { sql } from '@vercel/postgres'

// Re-export sql for convenience
export { sql }

/**
 * Initialize all database tables.
 * Call this from /api/db/init once after setting up Vercel Postgres.
 */
export async function initDB() {
  await sql`
    CREATE TABLE IF NOT EXISTS projects (
      id        SERIAL PRIMARY KEY,
      title     VARCHAR(255) NOT NULL,
      slug      VARCHAR(255) UNIQUE NOT NULL,
      description TEXT,
      year      VARCHAR(10),
      tech_stack TEXT,
      live_url  VARCHAR(500),
      github_url VARCHAR(500),
      thumbnail_url VARCHAR(500),
      images    TEXT,
      category  VARCHAR(50) DEFAULT 'main',
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    )
  `

  await sql`
    CREATE TABLE IF NOT EXISTS experiences (
      id          SERIAL PRIMARY KEY,
      company     VARCHAR(255) NOT NULL,
      role        VARCHAR(255) NOT NULL,
      description TEXT,
      start_date  VARCHAR(50),
      end_date    VARCHAR(50),
      location    VARCHAR(255),
      created_at  TIMESTAMP DEFAULT NOW()
    )
  `

  await sql`
    CREATE TABLE IF NOT EXISTS education (
      id          SERIAL PRIMARY KEY,
      institution VARCHAR(255) NOT NULL,
      degree      VARCHAR(255) NOT NULL,
      field       VARCHAR(255),
      start_date  VARCHAR(50),
      end_date    VARCHAR(50),
      description TEXT,
      created_at  TIMESTAMP DEFAULT NOW()
    )
  `

  await sql`
    CREATE TABLE IF NOT EXISTS skills (
      id         SERIAL PRIMARY KEY,
      name       VARCHAR(255) NOT NULL,
      category   VARCHAR(100) DEFAULT 'other',
      icon_url   VARCHAR(500),
      sort_order INTEGER DEFAULT 0,
      created_at TIMESTAMP DEFAULT NOW()
    )
  `

  await sql`
    CREATE TABLE IF NOT EXISTS homepage (
      id                SERIAL PRIMARY KEY,
      name              VARCHAR(255),
      title             VARCHAR(255),
      bio               TEXT,
      bio2              TEXT,
      email             VARCHAR(255),
      github_url        VARCHAR(500),
      linkedin_url      VARCHAR(500),
      instagram_url     VARCHAR(500),
      profile_image_url VARCHAR(500),
      cv_url            VARCHAR(500),
      updated_at        TIMESTAMP DEFAULT NOW()
    )
  `

  // Seed homepage with default content if empty
  const { rows } = await sql`SELECT id FROM homepage LIMIT 1`
  if (rows.length === 0) {
    await sql`
      INSERT INTO homepage
        (name, title, bio, bio2, email, github_url, linkedin_url, instagram_url, cv_url)
      VALUES (
        'Benmadi Imed Eddine',
        'Full Stack Web Developer',
        'I''m Benmadi Imed-Eddine, a computer science graduate currently specializing in data science for my master''s degree. Residing in Budapest, Hungary, I work as a full-stack web developer, creating robust websites and Platforms for startups, small businesses, and large enterprises. I am passionate about continuous learning and thrive on tackling new challenges and devising innovative solutions.',
        'Let''s chat and see how we can create something awesome together!',
        'benmadi.imed@gmail.com',
        'https://github.com/imadbenmadi',
        'https://www.linkedin.com/in/imad-benmadi-4b5a72236/',
        'https://www.instagram.com/imed.benmadi/',
        '/CV.pdf'
      )
    `
  }
}

// ---------- project helpers ----------
export async function getAllProjects() {
  const { rows } = await sql`SELECT * FROM projects ORDER BY created_at DESC`
  return rows.map(parseProject)
}

export async function getProjectBySlug(slug) {
  const { rows } = await sql`SELECT * FROM projects WHERE slug = ${slug}`
  return rows[0] ? parseProject(rows[0]) : null
}

export async function createProject(data) {
  const { rows } = await sql`
    INSERT INTO projects (title, slug, description, year, tech_stack, live_url, github_url, thumbnail_url, images, category)
    VALUES (
      ${data.title}, ${data.slug}, ${data.description}, ${data.year},
      ${JSON.stringify(data.tech_stack || [])},
      ${data.live_url}, ${data.github_url}, ${data.thumbnail_url},
      ${JSON.stringify(data.images || [])},
      ${data.category || 'main'}
    )
    RETURNING *
  `
  return parseProject(rows[0])
}

export async function updateProject(id, data) {
  const { rows } = await sql`
    UPDATE projects SET
      title         = ${data.title},
      slug          = ${data.slug},
      description   = ${data.description},
      year          = ${data.year},
      tech_stack    = ${JSON.stringify(data.tech_stack || [])},
      live_url      = ${data.live_url},
      github_url    = ${data.github_url},
      thumbnail_url = ${data.thumbnail_url},
      images        = ${JSON.stringify(data.images || [])},
      category      = ${data.category || 'main'},
      updated_at    = NOW()
    WHERE id = ${id}
    RETURNING *
  `
  return rows[0] ? parseProject(rows[0]) : null
}

export async function deleteProject(id) {
  await sql`DELETE FROM projects WHERE id = ${id}`
}

function parseProject(row) {
  return {
    ...row,
    tech_stack: tryParse(row.tech_stack, []),
    images: tryParse(row.images, [])
  }
}

// ---------- experience helpers ----------
export async function getAllExperiences() {
  const { rows } = await sql`SELECT * FROM experiences ORDER BY start_date DESC`
  return rows
}

export async function createExperience(data) {
  const { rows } = await sql`
    INSERT INTO experiences (company, role, description, start_date, end_date, location)
    VALUES (${data.company}, ${data.role}, ${data.description}, ${data.start_date}, ${data.end_date}, ${data.location})
    RETURNING *
  `
  return rows[0]
}

export async function updateExperience(id, data) {
  const { rows } = await sql`
    UPDATE experiences SET
      company    = ${data.company},
      role       = ${data.role},
      description = ${data.description},
      start_date = ${data.start_date},
      end_date   = ${data.end_date},
      location   = ${data.location}
    WHERE id = ${id}
    RETURNING *
  `
  return rows[0]
}

export async function deleteExperience(id) {
  await sql`DELETE FROM experiences WHERE id = ${id}`
}

// ---------- education helpers ----------
export async function getAllEducation() {
  const { rows } = await sql`SELECT * FROM education ORDER BY start_date DESC`
  return rows
}

export async function createEducation(data) {
  const { rows } = await sql`
    INSERT INTO education (institution, degree, field, start_date, end_date, description)
    VALUES (${data.institution}, ${data.degree}, ${data.field}, ${data.start_date}, ${data.end_date}, ${data.description})
    RETURNING *
  `
  return rows[0]
}

export async function updateEducation(id, data) {
  const { rows } = await sql`
    UPDATE education SET
      institution = ${data.institution},
      degree      = ${data.degree},
      field       = ${data.field},
      start_date  = ${data.start_date},
      end_date    = ${data.end_date},
      description = ${data.description}
    WHERE id = ${id}
    RETURNING *
  `
  return rows[0]
}

export async function deleteEducation(id) {
  await sql`DELETE FROM education WHERE id = ${id}`
}

// ---------- homepage helpers ----------
export async function getHomepage() {
  const { rows } = await sql`SELECT * FROM homepage ORDER BY id LIMIT 1`
  return rows[0] || null
}

export async function updateHomepage(data) {
  const { rows } = await sql`SELECT id FROM homepage LIMIT 1`
  if (rows.length === 0) {
    const { rows: newRows } = await sql`
      INSERT INTO homepage (name, title, bio, bio2, email, github_url, linkedin_url, instagram_url, profile_image_url, cv_url, updated_at)
      VALUES (${data.name}, ${data.title}, ${data.bio}, ${data.bio2}, ${data.email}, ${data.github_url}, ${data.linkedin_url}, ${data.instagram_url}, ${data.profile_image_url}, ${data.cv_url}, NOW())
      RETURNING *
    `
    return newRows[0]
  }
  const id = rows[0].id
  const { rows: updated } = await sql`
    UPDATE homepage SET
      name              = ${data.name},
      title             = ${data.title},
      bio               = ${data.bio},
      bio2              = ${data.bio2},
      email             = ${data.email},
      github_url        = ${data.github_url},
      linkedin_url      = ${data.linkedin_url},
      instagram_url     = ${data.instagram_url},
      profile_image_url = ${data.profile_image_url},
      cv_url            = ${data.cv_url},
      updated_at        = NOW()
    WHERE id = ${id}
    RETURNING *
  `
  return updated[0]
}

// ---------- skills helpers ----------
export async function getAllSkills() {
  const { rows } =
    await sql`SELECT * FROM skills ORDER BY sort_order ASC, name ASC`
  return rows
}

export async function createSkill(data) {
  const { rows } = await sql`
    INSERT INTO skills (name, category, icon_url, sort_order)
    VALUES (${data.name}, ${data.category || 'other'}, ${data.icon_url || null}, ${data.sort_order || 0})
    RETURNING *
  `
  return rows[0]
}

export async function updateSkill(id, data) {
  const { rows } = await sql`
    UPDATE skills SET
      name       = ${data.name},
      category   = ${data.category || 'other'},
      icon_url   = ${data.icon_url || null},
      sort_order = ${data.sort_order || 0}
    WHERE id = ${id}
    RETURNING *
  `
  return rows[0]
}

export async function deleteSkill(id) {
  await sql`DELETE FROM skills WHERE id = ${id}`
}

// ---------- utility ----------
function tryParse(val, fallback) {
  try {
    if (typeof val === 'string') return JSON.parse(val)
    if (Array.isArray(val)) return val
    return fallback
  } catch {
    return fallback
  }
}
