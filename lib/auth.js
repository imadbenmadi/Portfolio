import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'

const JWT_SECRET = process.env.JWT_SECRET || 'change-this-in-production'
const COOKIE_NAME = 'portfolio_admin_token'

// ─── Password helpers ──────────────────────────────────────────────────────────

/**
 * Hash a plain-text password (run this in a one-off script to generate
 * ADMIN_PASSWORD_HASH for your .env / Vercel env vars).
 */
export async function hashPassword(password) {
  return bcrypt.hash(password, 12)
}

/**
 * Verify a plain-text password against a bcrypt hash.
 */
export async function verifyPassword(password, hash) {
  return bcrypt.compare(password, hash)
}

// ─── JWT helpers ───────────────────────────────────────────────────────────────

export function signToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' })
}

export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET)
  } catch {
    return null
  }
}

// ─── Cookie helpers ────────────────────────────────────────────────────────────

/**
 * Set the auth cookie on a Next.js API response.
 */
export function setAuthCookie(res, token) {
  res.setHeader(
    'Set-Cookie',
    `${COOKIE_NAME}=${token}; Path=/; HttpOnly; SameSite=Strict; Max-Age=${
      60 * 60 * 24 * 7
    }${process.env.NODE_ENV === 'production' ? '; Secure' : ''}`
  )
}

/**
 * Clear the auth cookie.
 */
export function clearAuthCookie(res) {
  res.setHeader(
    'Set-Cookie',
    `${COOKIE_NAME}=; Path=/; HttpOnly; SameSite=Strict; Max-Age=0`
  )
}

/**
 * Parse the auth token from request cookies.
 */
export function getTokenFromRequest(req) {
  const cookieHeader = req.headers.cookie || ''
  const match = cookieHeader.match(new RegExp(`(?:^|; )${COOKIE_NAME}=([^;]+)`))
  return match ? match[1] : null
}

/**
 * Verify the request is authenticated. Returns the decoded payload or null.
 */
export function getAuthPayload(req) {
  const token = getTokenFromRequest(req)
  if (!token) return null
  return verifyToken(token)
}

/**
 * Higher-order helper: guards an API route handler.
 * Usage: export default withAuth(async (req, res) => { ... })
 */
export function withAuth(handler) {
  return async (req, res) => {
    const payload = getAuthPayload(req)
    if (!payload) {
      return res.status(401).json({ error: 'Unauthorized' })
    }
    req.admin = payload
    return handler(req, res)
  }
}
