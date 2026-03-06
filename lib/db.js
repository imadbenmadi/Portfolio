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
      sort_order INTEGER DEFAULT 0,
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
      sort_order  INTEGER DEFAULT 0,
      created_at  TIMESTAMP DEFAULT NOW()
    )
  `

  // Backward-compatible migrations for older DBs
  await sql`ALTER TABLE projects ADD COLUMN IF NOT EXISTS sort_order INTEGER DEFAULT 0`
  await sql`ALTER TABLE experiences ADD COLUMN IF NOT EXISTS sort_order INTEGER DEFAULT 0`

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
      icon_name  VARCHAR(255),
      sort_order INTEGER DEFAULT 0,
      created_at TIMESTAMP DEFAULT NOW()
    )
  `

  // Backward-compatible migration for older DBs
  await sql`ALTER TABLE skills ADD COLUMN IF NOT EXISTS icon_name VARCHAR(255)`

  // Seed skills with defaults if empty
  const { rows: skillsRows } = await sql`SELECT id FROM skills LIMIT 1`
  if (skillsRows.length === 0) await seedDefaultSkills()

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
    const defaultBio = `I am a Software Engineer with experience across full-stack development, data engineering, and cloud-based systems. I build scalable web applications, design data pipelines, and develop AI-driven solutions, focusing on performance, reliability, and production readiness.

Currently pursuing a Master’s in Data Science at Eötvös Loránd University, I bridge software engineering with machine learning and modern DevOps practices to deliver intelligent, end-to-end systems. I thrive in environments where backend architecture, data infrastructure, and automation intersect.

I offer end-to-end software engineering services, including full-stack web development, data engineering, machine learning integration, and cloud deployment. I build scalable applications, design efficient data pipelines, develop AI-driven solutions, and deploy production-ready systems using modern DevOps practices. My focus is on delivering robust, high-performance solutions that combine solid software architecture with data intelligence.`

    await sql`
      INSERT INTO homepage
        (name, title, bio, bio2, email, github_url, linkedin_url, instagram_url, cv_url)
      VALUES (
        ${'Benmadi Imed Eddine'},
        ${'Data Engineer'},
        ${defaultBio},
        ${"Let's chat and see how we can create something awesome together!"},
        ${'benmadi.imed@gmail.com'},
        ${'https://github.com/imadbenmadi'},
        ${'https://www.linkedin.com/in/imad-benmadi-4b5a72236/'},
        ${'https://www.instagram.com/imed.benmadi/'},
        ${'/CV.pdf'}
      )
    `
  }
}

// ---------- lightweight schema guards ----------
async function ensureSkillsSchema() {
  // Keep this local to skills operations so older DBs don't crash.
  await sql`
    CREATE TABLE IF NOT EXISTS skills (
      id         SERIAL PRIMARY KEY,
      name       VARCHAR(255) NOT NULL,
      category   VARCHAR(100) DEFAULT 'other',
      icon_url   VARCHAR(500),
      icon_name  VARCHAR(255),
      sort_order INTEGER DEFAULT 0,
      created_at TIMESTAMP DEFAULT NOW()
    )
  `
  await sql`ALTER TABLE skills ADD COLUMN IF NOT EXISTS icon_name VARCHAR(255)`
  await sql`ALTER TABLE skills ADD COLUMN IF NOT EXISTS sort_order INTEGER DEFAULT 0`
}

async function ensureProjectsOrderingSchema() {
  await sql`ALTER TABLE projects ADD COLUMN IF NOT EXISTS sort_order INTEGER DEFAULT 0`
}

async function ensureExperiencesOrderingSchema() {
  await sql`ALTER TABLE experiences ADD COLUMN IF NOT EXISTS sort_order INTEGER DEFAULT 0`
}

// ---------- project helpers ----------
export async function getAllProjects() {
  await ensureProjectsOrderingSchema()
  const { rows } = await sql`
    SELECT *
    FROM projects
    ORDER BY
      CASE
        WHEN category = 'main' THEN 0
        WHEN category = 'old' THEN 1
        ELSE 2
      END,
      sort_order ASC,
      created_at DESC
  `
  return rows.map(parseProject)
}

export async function getProjectBySlug(slug) {
  const { rows } = await sql`SELECT * FROM projects WHERE slug = ${slug}`
  return rows[0] ? parseProject(rows[0]) : null
}

export async function createProject(data) {
  await ensureProjectsOrderingSchema()
  const category = data.category || 'main'
  const { rows } = await sql`
    INSERT INTO projects (title, slug, description, year, tech_stack, live_url, github_url, thumbnail_url, images, category, sort_order)
    VALUES (
      ${data.title}, ${data.slug}, ${data.description}, ${data.year},
      ${JSON.stringify(data.tech_stack || [])},
      ${data.live_url}, ${data.github_url}, ${data.thumbnail_url},
      ${JSON.stringify(data.images || [])},
      ${category},
      (SELECT COALESCE(MAX(sort_order), -1) + 1 FROM projects WHERE category = ${category})
    )
    RETURNING *
  `
  return parseProject(rows[0])
}

export async function updateProject(id, data) {
  await ensureProjectsOrderingSchema()
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

export async function reorderProjects(category, orderedIds) {
  await ensureProjectsOrderingSchema()

  const ids = Array.isArray(orderedIds) ? orderedIds : []
  const categoryFilter = typeof category === 'string' && category.length > 0

  if (categoryFilter) {
    await Promise.all(
      ids.map(
        (id, index) =>
          sql`
            UPDATE projects
            SET sort_order = ${index}, updated_at = NOW()
            WHERE id = ${Number(id)} AND category = ${category}
          `
      )
    )
  } else {
    await Promise.all(
      ids.map(
        (id, index) =>
          sql`
            UPDATE projects
            SET sort_order = ${index}, updated_at = NOW()
            WHERE id = ${Number(id)}
          `
      )
    )
  }

  const { rows } = await sql`
    SELECT *
    FROM projects
    ORDER BY
      CASE
        WHEN category = 'main' THEN 0
        WHEN category = 'old' THEN 1
        ELSE 2
      END,
      sort_order ASC,
      created_at DESC
  `
  return rows.map(parseProject)
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
  await ensureExperiencesOrderingSchema()
  const { rows } =
    await sql`SELECT * FROM experiences ORDER BY sort_order ASC, created_at DESC`
  return rows
}

export async function createExperience(data) {
  await ensureExperiencesOrderingSchema()
  const { rows } = await sql`
    INSERT INTO experiences (company, role, description, start_date, end_date, location, sort_order)
    VALUES (${data.company}, ${data.role}, ${data.description}, ${data.start_date}, ${data.end_date}, ${data.location}, (SELECT COALESCE(MAX(sort_order), -1) + 1 FROM experiences))
    RETURNING *
  `
  return rows[0]
}

export async function updateExperience(id, data) {
  await ensureExperiencesOrderingSchema()
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

export async function reorderExperiences(orderedIds) {
  await ensureExperiencesOrderingSchema()
  await Promise.all(
    orderedIds.map(
      (id, index) =>
        sql`
          UPDATE experiences
          SET sort_order = ${index}
          WHERE id = ${Number(id)}
        `
    )
  )
  const { rows } =
    await sql`SELECT * FROM experiences ORDER BY sort_order ASC, created_at DESC`
  return rows
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
  await ensureSkillsSchema()
  const { rows } =
    await sql`SELECT * FROM skills ORDER BY sort_order ASC, name ASC`
  return rows
}

export async function createSkill(data) {
  await ensureSkillsSchema()
  const { rows } = await sql`
    INSERT INTO skills (name, category, icon_url, icon_name, sort_order)
    VALUES (
      ${data.name},
      ${data.category || 'other'},
      ${data.icon_url || null},
      ${data.icon_name || null},
      ${data.sort_order || 0}
    )
    RETURNING *
  `
  return rows[0]
}

export async function updateSkill(id, data) {
  await ensureSkillsSchema()
  const { rows } = await sql`
    UPDATE skills SET
      name       = ${data.name},
      category   = ${data.category || 'other'},
      icon_url   = ${data.icon_url || null},
      icon_name  = ${data.icon_name || null},
      sort_order = ${data.sort_order || 0}
    WHERE id = ${id}
    RETURNING *
  `
  return rows[0]
}

export async function reorderSkills(category, orderedIds) {
  await ensureSkillsSchema()
  // Set sort_order based on array order, within a single category
  await Promise.all(
    orderedIds.map(
      (id, index) =>
        sql`
        UPDATE skills
        SET sort_order = ${index}
        WHERE id = ${Number(id)} AND category = ${category}
      `
    )
  )
  const { rows } = await sql`
    SELECT * FROM skills
    WHERE category = ${category}
    ORDER BY sort_order ASC, name ASC
  `
  return rows
}

export async function deleteSkill(id) {
  await ensureSkillsSchema()
  await sql`DELETE FROM skills WHERE id = ${id}`
}

export async function seedDefaultSkills() {
  await ensureSkillsSchema()
  const { rows: existingRows } = await sql`SELECT name, category FROM skills`
  const existing = new Set(
    existingRows.map(
      r => `${r.category}::${String(r.name || '').toLowerCase()}`
    )
  )

  const { rows: maxRows } = await sql`
    SELECT category, COALESCE(MAX(sort_order), -1) AS max_sort
    FROM skills
    GROUP BY category
  `
  const nextOrder = new Map(
    maxRows.map(r => [r.category, Number(r.max_sort) + 1])
  )

  const defaults = [
    // languages
    { name: 'JavaScript', category: 'languages', icon_name: 'SiJavascript' },
    { name: 'TypeScript', category: 'languages', icon_name: 'SiTypescript' },
    { name: 'Python', category: 'languages', icon_name: 'SiPython' },
    { name: 'Go', category: 'languages', icon_name: 'FaGolang' },

    // frontend
    { name: 'HTML5', category: 'frontend', icon_name: 'SiHtml5' },
    { name: 'CSS3', category: 'frontend', icon_name: 'SiCss3' },
    { name: 'Sass', category: 'frontend', icon_name: 'SiSass' },
    { name: 'React', category: 'frontend', icon_name: 'SiReact' },
    { name: 'Next.js', category: 'frontend', icon_name: 'SiNextdotjs' },
    { name: 'Tailwind CSS', category: 'frontend', icon_name: 'SiTailwindcss' },
    { name: 'Chakra UI', category: 'frontend', icon_name: 'SiChakraui' },

    // backend
    { name: 'Node.js', category: 'backend', icon_name: 'SiNodedotjs' },
    { name: 'Express', category: 'backend', icon_name: 'SiExpress' },
    { name: 'NestJS', category: 'backend', icon_name: 'SiNestjs' },
    { name: 'Django', category: 'backend', icon_name: 'SiDjango' },
    { name: 'Flask', category: 'backend', icon_name: 'SiFlask' },
    { name: 'FastAPI', category: 'backend', icon_name: 'SiFastapi' },
    { name: 'Spring', category: 'backend', icon_name: 'SiSpring' },
    { name: '.NET', category: 'backend', icon_name: 'SiDotnet' },

    // databases
    { name: 'PostgreSQL', category: 'databases', icon_name: 'SiPostgresql' },
    { name: 'MySQL', category: 'databases', icon_name: 'SiMysql' },
    { name: 'MongoDB', category: 'databases', icon_name: 'SiMongodb' },
    { name: 'Redis', category: 'databases', icon_name: 'SiRedis' },

    // devops
    { name: 'Docker', category: 'devops', icon_name: 'SiDocker' },
    { name: 'Kubernetes', category: 'devops', icon_name: 'SiKubernetes' },
    { name: 'Terraform', category: 'devops', icon_name: 'SiTerraform' },

    // cloud
    { name: 'AWS', category: 'cloud', icon_name: 'SiAmazonwebservices' },
    { name: 'GCP', category: 'cloud', icon_name: 'SiGooglecloud' },
    { name: 'Azure', category: 'cloud', icon_name: 'SiMicrosoftazure' },

    // tools
    { name: 'Linux', category: 'tools', icon_name: 'SiLinux' },
    { name: 'Git', category: 'tools', icon_name: 'SiGit' },
    { name: 'GitHub', category: 'tools', icon_name: 'SiGithub' },

    // data
    { name: 'Airflow', category: 'data', icon_name: 'SiApacheairflow' },
    { name: 'Kafka', category: 'data', icon_name: 'SiApachekafka' },
    { name: 'Databricks', category: 'data', icon_name: 'SiDatabricks' },
    { name: 'Pandas', category: 'data', icon_name: 'SiPandas' },
    { name: 'NumPy', category: 'data', icon_name: 'SiNumpy' },
    { name: 'Jupyter', category: 'data', icon_name: 'SiJupyter' },

    // ml
    { name: 'scikit-learn', category: 'ml', icon_name: 'SiScikitlearn' },
    { name: 'PyTorch', category: 'ml', icon_name: 'SiPytorch' },
    { name: 'TensorFlow', category: 'ml', icon_name: 'SiTensorflow' }
  ]

  let insertedCount = 0
  for (const s of defaults) {
    const key = `${s.category}::${String(s.name || '').toLowerCase()}`
    if (existing.has(key)) continue

    const order = nextOrder.get(s.category) ?? 0
    nextOrder.set(s.category, order + 1)

    await sql`
      INSERT INTO skills (name, category, icon_url, icon_name, sort_order)
      VALUES (${s.name}, ${s.category}, ${null}, ${s.icon_name}, ${order})
    `
    insertedCount += 1
  }

  const skills = await getAllSkills()
  return { insertedCount, skills }
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
