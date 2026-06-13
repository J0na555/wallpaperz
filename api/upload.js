import { createUploadRequestHandler } from '../upload-handler.js'

const handler = createUploadRequestHandler(process.env)

export default async function upload(req, res) {
  return handler(req, res)
}
