/**
 * Seed the skills table with all default built-in skills.
 * Rows that already exist (matched by LOWER(name) + category) are skipped.
 *
 * Usage (from repo root):
 *   node --env-file=.env.local scripts/seed-skills.mjs
 */

import { createClient } from '@vercel/postgres'
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const sql = readFileSync(join(__dirname, 'seed-skills.sql'), 'utf8')

async function main() {
  if (!process.env.POSTGRES_URL) {
    console.error(
      '❌  POSTGRES_URL is not set.\n' +
        '   Run with: node --env-file=.env.local scripts/seed-skills.mjs'
    )
    process.exit(1)
  }

  const client = createClient()
  await client.connect()

  try {
    const result = await client.query(sql)
    const inserted = result.rowCount ?? 0
    if (inserted === 0) {
      console.log('✅  Done. All skills already exist — nothing to insert.')
    } else {
      console.log(
        `✅  Done. ${inserted} skill(s) inserted (existing rows skipped).`
      )
    }

    // Show current counts per category
    const { rows } = await client.query(
      `SELECT category, COUNT(*)::int AS count
       FROM skills GROUP BY category ORDER BY category`
    )
    console.log('\nCurrent skills in DB:')
    rows.forEach(r => console.log(`  ${r.category.padEnd(12)} ${r.count}`))
  } finally {
    await client.end()
  }
}

main().catch(err => {
  console.error('❌  Seed failed:', err.message)
  process.exit(1)
})
