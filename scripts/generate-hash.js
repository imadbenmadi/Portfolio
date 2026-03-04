/**
 * Run this script once to generate the bcrypt hash for your admin password.
 *
 * Usage:
 *   node scripts/generate-hash.js yourpassword
 *
 * Then set ADMIN_PASSWORD_HASH=<output> in your Vercel environment variables.
 */

const bcrypt = require('bcryptjs')

const password = process.argv[2]

if (!password) {
  console.error('Usage: node scripts/generate-hash.js <your-password>')
  process.exit(1)
}

bcrypt.hash(password, 12).then(hash => {
  console.log('\n✅ Your bcrypt hash (copy this into ADMIN_PASSWORD_HASH):\n')
  console.log(hash)
  console.log()
})
