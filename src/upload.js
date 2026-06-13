import { mount } from 'svelte'
import './app.css'
import Upload from './Upload.svelte'

const app = mount(Upload, {
  target: document.getElementById('upload-app'),
})

export default app
