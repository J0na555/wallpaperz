import { createHash } from 'node:crypto'

function getEnvValue(env, ...keys) {
  for (const key of keys) {
    if (env?.[key]) return env[key]
  }

  return ''
}

function sendJson(res, statusCode, payload) {
  res.statusCode = statusCode
  res.setHeader('Content-Type', 'application/json; charset=utf-8')
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  res.end(JSON.stringify(payload))
}

function readRequestBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = []

    req.on('data', (chunk) => chunks.push(chunk))
    req.on('end', () => resolve(Buffer.concat(chunks)))
    req.on('error', reject)
  })
}

function parseContentDisposition(value) {
  const result = {
    name: '',
    filename: '',
  }

  const nameMatch = /name="([^"]+)"/i.exec(value)
  const filenameMatch = /filename="([^"]*)"/i.exec(value)

  if (nameMatch) result.name = nameMatch[1]
  if (filenameMatch) result.filename = filenameMatch[1]

  return result
}

function parseMultipartFormData(body, contentType) {
  const boundaryMatch = /boundary=(?:"([^"]+)"|([^;]+))/i.exec(contentType || '')

  if (!boundaryMatch) {
    throw new Error('Missing multipart boundary.')
  }

  const boundaryValue = boundaryMatch[1] || boundaryMatch[2]
  const boundary = Buffer.from(`--${boundaryValue}`)
  const boundaryWithCrlf = Buffer.from(`\r\n--${boundaryValue}`)
  const headerSeparator = Buffer.from('\r\n\r\n')
  const fields = {}
  let file = null

  let position = body.indexOf(boundary)

  while (position !== -1) {
    position += boundary.length

    if (body[position] === 45 && body[position + 1] === 45) {
      break
    }

    if (body[position] === 13 && body[position + 1] === 10) {
      position += 2
    }

    const nextBoundary = body.indexOf(boundaryWithCrlf, position)
    if (nextBoundary === -1) {
      break
    }

    let part = body.slice(position, nextBoundary)
    if (part.length >= 2 && part[part.length - 2] === 13 && part[part.length - 1] === 10) {
      part = part.slice(0, -2)
    }

    const headerEnd = part.indexOf(headerSeparator)
    if (headerEnd === -1) {
      position = nextBoundary
      continue
    }

    const headerText = part.slice(0, headerEnd).toString('utf8')
    const content = part.slice(headerEnd + headerSeparator.length)
    const headers = Object.fromEntries(
      headerText
        .split('\r\n')
        .map((line) => line.split(':'))
        .map(([key, ...rest]) => [key.trim().toLowerCase(), rest.join(':').trim()]),
    )

    const disposition = parseContentDisposition(headers['content-disposition'] || '')
    if (!disposition.name) {
      position = nextBoundary
      continue
    }

    if (disposition.filename) {
      file = {
        fieldName: disposition.name,
        filename: disposition.filename,
        mimeType: headers['content-type'] || 'application/octet-stream',
        buffer: content,
      }
    } else {
      fields[disposition.name] = content.toString('utf8')
    }

    position = nextBoundary
  }

  return { fields, file }
}

function buildSignature(params, apiSecret) {
  const signatureBase = Object.entries(params)
    .filter(([, value]) => value !== undefined && value !== null && value !== '')
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([key, value]) => `${key}=${value}`)
    .join('&')

  return createHash('sha1').update(signatureBase + apiSecret).digest('hex')
}

async function uploadToCloudinary({
  cloudName,
  apiKey,
  apiSecret,
  file,
  filename,
  mimeType,
  folder,
  publicId,
  tags,
}) {
  const timestamp = String(Math.floor(Date.now() / 1000))
  const paramsToSign = { timestamp }

  if (folder) paramsToSign.folder = folder
  if (publicId) paramsToSign.public_id = publicId
  if (tags) paramsToSign.tags = tags

  const signature = buildSignature(paramsToSign, apiSecret)
  const formData = new FormData()

  formData.append('file', new Blob([file], { type: mimeType }), filename)
  formData.append('api_key', apiKey)
  formData.append('timestamp', timestamp)
  formData.append('signature', signature)

  if (folder) formData.append('folder', folder)
  if (publicId) formData.append('public_id', publicId)
  if (tags) formData.append('tags', tags)

  const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
    method: 'POST',
    body: formData,
  })

  const payload = await response.json()

  if (!response.ok) {
    throw new Error(payload?.error?.message || `Cloudinary upload failed with status ${response.status}.`)
  }

  return payload
}

function respondWithUploadRouteInfo(res) {
  sendJson(res, 200, {
    endpoint: '/api/upload',
    method: 'POST',
    fields: {
      file: 'multipart/form-data file field',
      folder: 'optional Cloudinary folder',
      publicId: 'optional Cloudinary public_id',
      tags: 'optional comma-separated tags',
    },
  })
}

async function readUploadRequest(req) {
  const contentType = req.headers['content-type'] || ''
  const body = await readRequestBody(req)
  let fields = {}
  let file = null

  if (contentType.includes('multipart/form-data')) {
    ({ fields, file } = parseMultipartFormData(body, contentType))
  } else if (contentType.includes('application/json')) {
    const parsed = JSON.parse(body.toString('utf8') || '{}')
    fields = parsed

    if (parsed.fileBase64 && parsed.fileName) {
      file = {
        fieldName: 'file',
        filename: parsed.fileName,
        mimeType: parsed.mimeType || 'application/octet-stream',
        buffer: Buffer.from(parsed.fileBase64, 'base64'),
      }
    }
  } else {
    throw new Error('Use multipart/form-data or application/json.')
  }

  return { fields, file }
}

export function createUploadRequestHandler(env) {
  const cloudName = getEnvValue(env, 'CLOUD_NAME', 'CLOUD_NAMA')
  const apiKey = getEnvValue(env, 'API_KEY')
  const apiSecret = getEnvValue(env, 'SECRET', 'API_SECRET')

  return async function handleUploadRequest(req, res) {
    if (req.method === 'OPTIONS') {
      res.statusCode = 204
      res.setHeader('Access-Control-Allow-Origin', '*')
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
      return res.end()
    }

    if (req.method === 'GET') {
      return respondWithUploadRouteInfo(res)
    }

    if (req.method !== 'POST') {
      res.setHeader('Allow', 'POST, OPTIONS')
      return sendJson(res, 405, { error: 'Method not allowed.' })
    }

    if (!cloudName || !apiKey || !apiSecret) {
      return sendJson(res, 500, {
        error: 'Cloudinary configuration is incomplete.',
      })
    }

    try {
      const { fields, file } = await readUploadRequest(req)

      if (!file || !file.buffer || file.buffer.length === 0) {
        return sendJson(res, 400, {
          error: 'No image file was provided.',
        })
      }

      const cloudinaryResult = await uploadToCloudinary({
        cloudName,
        apiKey,
        apiSecret,
        file: file.buffer,
        filename: file.filename || 'upload',
        mimeType: file.mimeType,
        folder: fields.folder || '',
        publicId: fields.publicId || fields.public_id || '',
        tags: fields.tags || '',
      })

      return sendJson(res, 200, {
        ok: true,
        asset: cloudinaryResult,
      })
    } catch (error) {
      return sendJson(res, 500, {
        error: error instanceof Error ? error.message : 'Upload failed.',
      })
    }
  }
}

export function createViteUploadMiddleware(mode) {
  return async function uploadMiddleware(req, res, next) {
    if (!req.url || !req.url.startsWith('/api/upload')) {
      return next()
    }

    const { loadEnv } = await import('vite')
    const env = loadEnv(mode, process.cwd(), '')
    return createUploadRequestHandler(env)(req, res)
  }
}
