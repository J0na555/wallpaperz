<script>
  let { wallpaper, onClose } = $props();

  let downloaded = $state(false);

  // Sync scroll lock on body when wallpaper is selected
  $effect(() => {
    if (wallpaper) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  });

  function handleKeydown(event) {
    if (event.key === 'Escape' && wallpaper) {
      onClose();
    }
  }

  function handleOverlayClick(event) {
    // Only close if user clicked directly on the overlay backdrop
    if (event.target === event.currentTarget) {
      onClose();
    }
  }

  function handleDownload(event) {
    event.stopPropagation();
    downloaded = true;
    setTimeout(() => {
      downloaded = false;
    }, 1500);
  }

  function getAspectRatio(aspect) {
    if (aspect === 'portrait') return '3 / 4';
    if (aspect === 'wide') return '21 / 9';
    if (aspect === 'square') return '1 / 1';
    return '16 / 10';
  }
</script>

<svelte:window onkeydown={handleKeydown} />

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div 
  class="lightbox" 
  class:open={!!wallpaper}
  onclick={handleOverlayClick}
>
  {#if wallpaper}
    <button class="lightbox-close" onclick={onClose} aria-label="Close">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
        <line x1="18" y1="6" x2="6" y2="18"></line>
        <line x1="6" y1="6" x2="18" y2="18"></line>
      </svg>
    </button>
    <div 
      class="lightbox-image-placeholder {wallpaper.class}" 
      style="aspect-ratio: {getAspectRatio(wallpaper.aspect)};"
    ></div>
    <div class="lightbox-info">
      <div class="card-tags">
        {#each wallpaper.tags as tag}
          <span class="card-tag">{tag}</span>
        {/each}
      </div>
      <div class="card-resolution">{wallpaper.resolution}</div>
    </div>
    <div class="lightbox-actions">
      <button 
        class="lightbox-download" 
        class:saved={downloaded}
        onclick={handleDownload}
      >
        {#if downloaded}
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
          Saved
        {:else}
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
            <polyline points="7 10 12 15 17 10"></polyline>
            <line x1="12" y1="15" x2="12" y2="3"></line>
          </svg>
          Download Full Resolution
        {/if}
      </button>
    </div>
  {/if}
</div>

<style>
  .lightbox {
    position: fixed;
    inset: 0;
    z-index: 200;
    background: var(--lightbox-bg);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.25s cubic-bezier(0.23, 1, 0.32, 1);
  }
  .lightbox.open {
    opacity: 1;
    pointer-events: auto;
  }
  .lightbox-image-placeholder {
    max-width: 85vw;
    max-height: 70vh;
    border-radius: var(--radius-lg);
    width: 640px;
    aspect-ratio: 16 / 10;
  }
  .lightbox-info {
    margin-top: var(--gap-md);
    text-align: center;
  }
  .card-tags {
    justify-content: center;
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    margin-bottom: 8px;
  }
  .card-tag {
    font-family: var(--font-mono);
    font-size: 11px;
    color: var(--muted);
    letter-spacing: 0.01em;
  }
  .card-tag + .card-tag::before {
    content: '·';
    margin-right: 6px;
    color: var(--border);
  }
  .card-resolution {
    font-family: var(--font-mono);
    font-size: 12px;
    color: var(--muted);
  }
  .lightbox-actions {
    margin-top: var(--gap-md);
    display: flex;
    gap: var(--gap-sm);
  }
  .lightbox-download {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 11px 22px;
    background: var(--fg);
    color: var(--bg);
    border: none;
    border-radius: var(--radius);
    font-family: var(--font-mono);
    font-size: 12px;
    font-weight: 600;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    cursor: pointer;
    transition: transform 0.1s ease, opacity 0.15s ease, background-color 0.15s ease, color 0.15s ease;
  }
  .lightbox-download:hover {
    opacity: 0.85;
  }
  .lightbox-download:active {
    transform: scale(0.97);
  }
  .lightbox-download.saved {
    background: var(--accent);
    color: var(--bg);
  }
  .lightbox-download svg {
    width: 15px;
    height: 15px;
    display: block;
  }
  .lightbox-close {
    position: absolute;
    top: 24px;
    right: 24px;
    width: 38px;
    height: 38px;
    border-radius: 50%;
    background: var(--surface);
    border: 1px solid var(--border);
    display: grid;
    place-items: center;
    color: var(--muted);
    cursor: pointer;
    transition: color 0.15s ease, border-color 0.15s ease;
  }
  .lightbox-close:hover {
    color: var(--fg);
    border-color: var(--lightbox-close-border);
  }
  .lightbox-close svg {
    width: 16px;
    height: 16px;
    display: block;
  }
</style>
