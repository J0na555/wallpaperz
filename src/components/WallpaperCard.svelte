<script>
  let { wallpaper, index, onSelect } = $props();
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div 
  class="wallpaper-card" 
  style="animation-delay: {index * 0.05}s;"
  onclick={() => onSelect(wallpaper)}
>
  <div class="card-media {wallpaper.aspect}">
    {#if wallpaper.previewUrl || wallpaper.imageUrl}
      <img
        class="card-img"
        src={wallpaper.previewUrl || wallpaper.imageUrl}
        alt={wallpaper.label}
        loading="lazy"
      />
    {:else}
      <div class="card-img {wallpaper.class}" role="img" aria-label="{wallpaper.label} wallpaper"></div>
    {/if}
  </div>
  <div class="card-info">
    <div class="card-tags">
      <span class="card-tag">{wallpaper.category}</span>
    </div>
    <div class="card-meta">
      <span class="card-resolution">{wallpaper.resolution}</span>
    </div>
  </div>
</div>

<style>
  .wallpaper-card {
    break-inside: avoid;
    margin-bottom: var(--gap-md);
    border-radius: var(--radius-lg);
    overflow: hidden;
    background: var(--surface);
    border: 1px solid var(--border);
    position: relative;
    cursor: pointer;
    transition: border-color 0.2s ease, transform 0.2s ease, box-shadow 0.2s ease;
    opacity: 0;
    animation: cardIn 0.4s cubic-bezier(0.23, 1, 0.32, 1) forwards;
  }
  .wallpaper-card:hover {
    border-color: var(--card-border-hover);
    transform: translateY(-2px);
    box-shadow: var(--card-hover-shadow);
  }
  .card-img {
    width: 100%;
    display: block;
    aspect-ratio: auto;
  }
  .card-media {
    overflow: hidden;
  }
  .card-img.portrait { aspect-ratio: 3 / 4; }
  .card-img.landscape { aspect-ratio: 16 / 10; }
  .card-img.square { aspect-ratio: 1 / 1; }
  .card-img.wide { aspect-ratio: 21 / 9; }
  .card-media img.card-img {
    object-fit: cover;
    width: 100%;
    height: 100%;
  }

  .card-info {
    padding: 14px 16px;
  }
  .card-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
  }
  .card-tag {
    font-family: var(--font-mono);
    font-size: 11px;
    color: var(--muted);
    letter-spacing: 0.01em;
  }
  .card-meta {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 8px;
  }
  .card-resolution {
    font-family: var(--font-mono);
    font-size: 11px;
    color: var(--muted);
  }

  /* card click hint */
  .wallpaper-card::after {
    content: 'Click to view';
    position: absolute;
    bottom: 12px;
    right: 12px;
    padding: 4px 10px;
    border-radius: var(--radius);
    background: var(--nav-bg);
    backdrop-filter: blur(6px);
    -webkit-backdrop-filter: blur(6px);
    font-family: var(--font-mono);
    font-size: 10px;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    color: var(--muted);
    opacity: 0;
    transition: opacity 0.2s ease;
    pointer-events: none;
  }
  .wallpaper-card:hover::after {
    opacity: 1;
  }

  @keyframes cardIn {
    from {
      opacity: 0;
      transform: translateY(16px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
</style>
