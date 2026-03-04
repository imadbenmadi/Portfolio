import { put } from '@vercel/blob'
import formidable from 'formidable'
import fs from 'fs'
import { getAuthPayload } from '../../../lib/auth'

export const config = {
  api: { bodyParser: false }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  // Auth check
  const payload = getAuthPayload(req)
  if (!payload) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  const form = formidable({ maxFileSize: 10 * 1024 * 1024 }) // 10 MB max

  try {
    const [, files] = await form.parse(req)
    const file = files.file?.[0]

    if (!file) {
      return res
        .status(400)
        .json({ error: 'No file uploaded. Use field name "file".' })
    }

    const allowedTypes = [
      'image/jpeg',
      'image/png',
      'image/webp',
      'image/gif',
      'image/svg+xml'
    ]
    if (!allowedTypes.includes(file.mimetype)) {
      return res
        .status(400)
        .json({
          error: 'Only image files are allowed (jpg, png, webp, gif, svg)'
        })
    }

    const buffer = fs.readFileSync(file.filepath)
    const filename = `portfolio/${Date.now()}-${file.originalFilename}`

    const blob = await put(filename, buffer, {
      access: 'public',
      contentType: file.mimetype
    })

    // Clean up temp file
    fs.unlinkSync(file.filepath)

    return res.status(200).json({ url: blob.url })
  } catch (err) {
    console.error('Upload error:', err)
    return res.status(500).json({ error: err.message })
  }
}
