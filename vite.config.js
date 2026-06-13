import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import { createViteUploadMiddleware } from './upload-handler.js'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    svelte(),
    {
      name: 'cloudinary-upload-endpoint',
      configureServer(server) {
        server.middlewares.use(createViteUploadMiddleware(server.config.mode))
      },
      configurePreviewServer(server) {
        server.middlewares.use(createViteUploadMiddleware(server.config.mode))
      },
    },
  ],
  build: {
    rollupOptions: {
      input: {
        main: 'index.html',
        upload: 'upload.html',
      },
    },
  },
})
