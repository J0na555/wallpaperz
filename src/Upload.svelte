<script>
  let selectedFile = $state(null);
  let previewUrl = $state('');
  let uploadStatus = $state('idle');
  let responseText = $state('Ready to upload.');
  let responseUrl = $state('');
  let dragging = $state(false);
  let fileInput;

  const endpoint = '/api/upload';

  function setFile(file) {
    if (!file) {
      clearFile();
      return;
    }

    if (!file.type.startsWith('image/')) {
      uploadStatus = 'error';
      responseText = 'Select an image file.';
      return;
    }

    selectedFile = file;
    responseText = `${file.name} selected.`;

    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    previewUrl = URL.createObjectURL(file);
    responseUrl = '';
    uploadStatus = 'idle';
  }

  function clearFile() {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    selectedFile = null;
    previewUrl = '';
    uploadStatus = 'idle';
    responseText = 'Ready to upload.';
    responseUrl = '';

    if (fileInput) {
      fileInput.value = '';
    }
  }

  function handleInputChange(event) {
    setFile(event.currentTarget.files?.[0] ?? null);
  }

  function handleDragOver(event) {
    event.preventDefault();
    dragging = true;
  }

  function handleDragLeave() {
    dragging = false;
  }

  function handleDrop(event) {
    event.preventDefault();
    dragging = false;
    setFile(event.dataTransfer?.files?.[0] ?? null);
  }

  function handleDropzoneKeydown(event) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      fileInput?.click();
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (!selectedFile) {
      uploadStatus = 'error';
      responseText = 'Choose an image first.';
      return;
    }

    const form = event.currentTarget;
    const formData = new FormData(form);
    formData.set('file', selectedFile);

    uploadStatus = 'uploading';
    responseText = 'Uploading to Cloudinary...';
    responseUrl = '';

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        body: formData,
      });

      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload?.error || 'Upload failed.');
      }

      uploadStatus = 'success';
      responseText = 'Upload complete.';
      responseUrl = payload?.asset?.secure_url || payload?.asset?.url || '';
      form.reset();
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
      selectedFile = null;
      previewUrl = '';
      if (fileInput) {
        fileInput.value = '';
      }
    } catch (error) {
      uploadStatus = 'error';
      responseText = error instanceof Error ? error.message : 'Upload failed.';
    }
  }

  $effect(() => () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
  });
</script>

<svelte:head>
  <title>Upload Panel</title>
  <meta name="color-scheme" content="dark light" />
</svelte:head>

<main class="shell">
  <section class="hero">
    <div class="hero-copy">
      <p class="eyebrow">Wallpaper intake console</p>
      <h1>Drop an image, push it to Cloudinary, and keep the gallery separate.</h1>
      <p class="lede">
        This page stays off the main site. It only submits to <code>{endpoint}</code> and shows the upload result.
      </p>
    </div>

    <div class="endpoint-card">
      <span>Upload endpoint</span>
      <strong>{endpoint}</strong>
      <p>POST a multipart form with a <code>file</code> field and optional metadata fields.</p>
    </div>
  </section>

  <section class="panel-grid">
    <div class="panel uploader">
      <div
        class:dragging
        class="dropzone"
        role="button"
        tabindex="0"
        aria-label="Select or drop an image"
        ondragover={handleDragOver}
        ondragleave={handleDragLeave}
        ondrop={handleDrop}
        onkeydown={handleDropzoneKeydown}
      >
        <input bind:this={fileInput} class="file-input" type="file" accept="image/*" onchange={handleInputChange} />
        <div class="dropzone-copy">
          <p class="drop-title">Drag an image here</p>
          <p class="drop-hint">or click to choose a file from your device.</p>
        </div>
      </div>

      <form class="form" onsubmit={handleSubmit}>
        <div class="split">
          <label>
            <span>Folder</span>
            <input name="folder" type="text" placeholder="wallpapers" />
          </label>
          <label>
            <span>Public ID</span>
            <input name="publicId" type="text" placeholder="optional custom name" />
          </label>
        </div>

        <label>
          <span>Tags</span>
          <input name="tags" type="text" placeholder="nature, neon, abstract" />
        </label>

        <div class="actions">
          <button type="button" class="ghost" onclick={clearFile}>Reset file</button>
          <button type="submit" class="primary" disabled={uploadStatus === 'uploading'}>
            {uploadStatus === 'uploading' ? 'Uploading...' : 'Upload image'}
          </button>
        </div>
      </form>
    </div>

    <aside class="panel preview">
      <div class="preview-head">
        <div>
          <p class="panel-label">Selected file</p>
          <h2>{selectedFile ? selectedFile.name : 'No file chosen'}</h2>
        </div>
        <span class:success={uploadStatus === 'success'} class:error={uploadStatus === 'error'} class="status-pill">
          {uploadStatus}
        </span>
      </div>

      <div class="preview-stage">
        {#if previewUrl}
          <img src={previewUrl} alt={selectedFile ? `Preview of ${selectedFile.name}` : 'Selected image preview'} />
        {:else}
          <div class="empty-preview">
            <p>Preview will appear here.</p>
          </div>
        {/if}
      </div>

      <div class="console">
        <p class="panel-label">Response</p>
        <p class="response-text">{responseText}</p>

        {#if responseUrl}
          <a class="response-link" href={responseUrl} target="_blank" rel="noreferrer">Open uploaded image</a>
        {/if}
      </div>
    </aside>
  </section>
</main>

<style>
  :global(body) {
    background:
      radial-gradient(circle at top left, rgba(255, 214, 165, 0.16), transparent 32%),
      radial-gradient(circle at right 20%, rgba(255, 122, 89, 0.18), transparent 28%),
      linear-gradient(180deg, #0b0f14, #090b0f 60%, #050607);
    color: #f5efe6;
    font-family: 'Iowan Old Style', 'Palatino Linotype', 'Book Antiqua', Georgia, serif;
  }

  :global(code) {
    font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', monospace;
  }

  .shell {
    min-height: 100vh;
    padding: 40px 20px 56px;
    position: relative;
    isolation: isolate;
  }

  .shell::before {
    content: '';
    position: fixed;
    inset: 0;
    pointer-events: none;
    background-image:
      linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px);
    background-size: 28px 28px;
    mask-image: linear-gradient(180deg, rgba(0,0,0,0.8), transparent 95%);
    opacity: 0.35;
    z-index: -1;
  }

  .hero,
  .panel-grid {
    width: min(1180px, 100%);
    margin: 0 auto;
  }

  .hero {
    display: grid;
    grid-template-columns: minmax(0, 1.5fr) minmax(280px, 0.8fr);
    gap: 24px;
    align-items: end;
    margin-bottom: 28px;
  }

  .hero-copy,
  .endpoint-card,
  .panel {
    border: 1px solid rgba(255, 255, 255, 0.12);
    background: rgba(12, 16, 22, 0.72);
    backdrop-filter: blur(18px);
    -webkit-backdrop-filter: blur(18px);
    box-shadow: 0 24px 80px rgba(0, 0, 0, 0.34);
  }

  .hero-copy {
    padding: clamp(24px, 4vw, 40px);
    border-radius: 28px;
    animation: rise 700ms ease both;
  }

  .eyebrow,
  .panel-label {
    letter-spacing: 0.24em;
    text-transform: uppercase;
    font-size: 11px;
    color: #c39a72;
    margin-bottom: 14px;
  }

  h1 {
    font-size: clamp(2.4rem, 5vw, 5.1rem);
    line-height: 0.94;
    letter-spacing: -0.05em;
    max-width: 12ch;
    margin: 0;
  }

  .lede {
    margin-top: 18px;
    max-width: 60ch;
    font-size: 1.05rem;
    line-height: 1.7;
    color: rgba(245, 239, 230, 0.8);
  }

  .endpoint-card {
    padding: 24px;
    border-radius: 24px;
    transform: translateY(6px);
    animation: rise 800ms 120ms ease both;
  }

  .endpoint-card span,
  .endpoint-card p {
    color: rgba(245, 239, 230, 0.68);
  }

  .endpoint-card strong {
    display: block;
    margin: 12px 0 10px;
    font-size: 1.2rem;
    letter-spacing: 0.02em;
  }

  .panel-grid {
    display: grid;
    grid-template-columns: minmax(0, 1.1fr) minmax(320px, 0.9fr);
    gap: 24px;
  }

  .panel {
    border-radius: 28px;
    padding: 24px;
    animation: rise 900ms 180ms ease both;
  }

  .uploader {
    display: grid;
    gap: 20px;
  }

  .dropzone {
    position: relative;
    min-height: 220px;
    border-radius: 24px;
    border: 1px dashed rgba(255, 255, 255, 0.18);
    background:
      radial-gradient(circle at top left, rgba(195, 154, 114, 0.16), transparent 30%),
      rgba(255, 255, 255, 0.02);
    display: grid;
    place-items: center;
    overflow: hidden;
    transition: border-color 160ms ease, transform 160ms ease, background 160ms ease;
  }

  .dropzone.dragging {
    transform: translateY(-2px);
    border-color: rgba(195, 154, 114, 0.7);
    background:
      radial-gradient(circle at top left, rgba(255, 195, 119, 0.24), transparent 34%),
      rgba(255, 255, 255, 0.04);
  }

  .file-input {
    position: absolute;
    inset: 0;
    opacity: 0;
    cursor: pointer;
  }

  .dropzone-copy {
    text-align: center;
    pointer-events: none;
    padding: 24px;
  }

  .drop-title {
    font-size: clamp(1.25rem, 2vw, 1.8rem);
    margin-bottom: 8px;
  }

  .drop-hint {
    color: rgba(245, 239, 230, 0.72);
  }

  .form {
    display: grid;
    gap: 16px;
  }

  label {
    display: grid;
    gap: 8px;
    font-size: 0.85rem;
    color: rgba(245, 239, 230, 0.8);
  }

  input {
    width: 100%;
    border-radius: 16px;
    border: 1px solid rgba(255, 255, 255, 0.12);
    background: rgba(255, 255, 255, 0.04);
    color: #fff8ef;
    padding: 14px 16px;
    font: inherit;
    outline: none;
  }

  input:focus {
    border-color: rgba(195, 154, 114, 0.6);
    box-shadow: 0 0 0 4px rgba(195, 154, 114, 0.12);
  }

  input::placeholder {
    color: rgba(245, 239, 230, 0.38);
  }

  .split {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 14px;
  }

  .actions {
    display: flex;
    gap: 12px;
    justify-content: space-between;
    align-items: center;
    margin-top: 4px;
  }

  button {
    border: 0;
    border-radius: 999px;
    padding: 13px 18px;
    font: inherit;
    transition: transform 160ms ease, opacity 160ms ease, background 160ms ease;
  }

  button:hover {
    transform: translateY(-1px);
  }

  button:disabled {
    opacity: 0.6;
    cursor: wait;
  }

  .ghost {
    background: rgba(255, 255, 255, 0.05);
    color: #f5efe6;
  }

  .primary {
    background: linear-gradient(135deg, #d9b38c, #f3dcc3);
    color: #1a140f;
    font-weight: 700;
  }

  .preview {
    display: grid;
    gap: 20px;
  }

  .preview-head {
    display: flex;
    align-items: start;
    justify-content: space-between;
    gap: 16px;
  }

  .preview h2 {
    font-size: 1.3rem;
    margin-top: 2px;
  }

  .status-pill {
    padding: 8px 12px;
    border-radius: 999px;
    background: rgba(255, 255, 255, 0.06);
    color: rgba(245, 239, 230, 0.72);
    font-size: 0.82rem;
    text-transform: capitalize;
  }

  .status-pill.success {
    background: rgba(95, 184, 111, 0.18);
    color: #9fe2ac;
  }

  .status-pill.error {
    background: rgba(227, 99, 84, 0.18);
    color: #ffb5ac;
  }

  .preview-stage {
    min-height: 360px;
    border-radius: 24px;
    overflow: hidden;
    border: 1px solid rgba(255, 255, 255, 0.08);
    background: rgba(255, 255, 255, 0.03);
  }

  .preview-stage img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }

  .empty-preview {
    min-height: 360px;
    display: grid;
    place-items: center;
    color: rgba(245, 239, 230, 0.48);
  }

  .console {
    border-top: 1px solid rgba(255, 255, 255, 0.1);
    padding-top: 20px;
  }

  .response-text {
    margin: 0;
    font-size: 1rem;
    line-height: 1.6;
  }

  .response-link {
    display: inline-flex;
    margin-top: 12px;
    color: #f3dcc3;
    border-bottom: 1px solid rgba(243, 220, 195, 0.4);
    padding-bottom: 2px;
  }

  @keyframes rise {
    from {
      opacity: 0;
      transform: translateY(14px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @media (max-width: 920px) {
    .hero,
    .panel-grid {
      grid-template-columns: 1fr;
    }
  }

  @media (max-width: 640px) {
    .shell {
      padding-inline: 14px;
    }

    .split,
    .actions {
      grid-template-columns: 1fr;
      display: grid;
    }

    .actions {
      justify-content: stretch;
    }

    button {
      width: 100%;
    }
  }
</style>
