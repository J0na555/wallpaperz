import { createGalleryRequestHandler } from '../upload-handler.js'

const handler = createGalleryRequestHandler(process.env)

export default async function wallpapers(req, res) {
  return handler(req, res)
}
