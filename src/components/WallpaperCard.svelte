<script>
  let { wallpaper, index, onSelect } = $props();

  function hashString(value) {
    let hash = 0;
    const text = String(value || '');

    for (let i = 0; i < text.length; i += 1) {
      hash = (hash * 31 + text.charCodeAt(i)) % 360;
    }

    return hash;
  }

  function getCategoryAccent(category) {
    const hue = hashString(category);
    return `hsl(${hue} 68% 56%)`;
  }

  function getClampedRatio(wallpaper) {
    const rawRatio = Number(wallpaper?.ratio) || 0;

    if (rawRatio > 0) {
      return Math.min(1.55, Math.max(0.82, rawRatio));
    }

    switch (wallpaper?.aspect) {
      case 'portrait':
        return 0.9;
      case 'square':
        return 1;
      case 'wide':
        return 1.55;
      default:
        return 1.35;
    }
  }

  let accent = $derived(getCategoryAccent(wallpaper.category));
  let clampedRatio = $derived(getClampedRatio(wallpaper));
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div 
  class="wallpaper-card" 
  style={`animation-delay: ${index * 0.05}s; --card-accent: ${accent}; --card-ratio: ${clampedRatio};`}
  onclick={() => onSelect(wallpaper)}
>
  <div class="card-media {wallpaper.aspect}">
    {#if wallpaper.previewUrl || wallpaper.imageUrl}
      <div class="media-shell">
        <img
          class="card-img"
          src={wallpaper.previewUrl || wallpaper.imageUrl}
          alt={wallpaper.label}
          loading="lazy"
        />
        <div class="media-overlay"></div>
      </div>
    {:else}
      <div class="media-shell">
        <div class="card-img {wallpaper.class}" role="img" aria-label="{wallpaper.label} wallpaper"></div>
        <div class="media-overlay"></div>
      </div>
    {/if}
    <div class="card-badges">
      <span class="card-badge card-badge-accent">{wallpaper.category}</span>
      <span class="card-badge card-badge-muted">{wallpaper.resolution}</span>
    </div>
    <div class="card-action">Preview</div>
  </div>
  <div class="card-info">
    <div class="card-title-row">
      <h3 class="card-title">{wallpaper.label}</h3>
      <span class="card-arrow" aria-hidden="true">↗</span>
    </div>
  </div>
</div>

<style>
  .wallpaper-card {
    break-inside: avoid;
    margin-bottom: var(--gap-md);
    border-radius: 18px;
    overflow: hidden;
    background:
      linear-gradient(180deg, color-mix(in srgb, var(--card-accent) 9%, transparent), transparent 40%),
      var(--surface);
    border: 1px solid color-mix(in srgb, var(--card-accent) 18%, var(--border));
    position: relative;
    cursor: pointer;
    transition: border-color 0.2s ease, transform 0.25s ease, box-shadow 0.25s ease, background 0.25s ease;
    opacity: 0;
    animation: cardIn 0.4s cubic-bezier(0.23, 1, 0.32, 1) forwards;
  }
  .wallpaper-card:hover {
    border-color: color-mix(in srgb, var(--card-accent) 36%, var(--card-border-hover));
    transform: translateY(-4px);
    box-shadow: var(--card-hover-shadow);
  }
  .card-media {
    position: relative;
    overflow: hidden;
    background: linear-gradient(180deg, rgba(255,255,255,0.02), rgba(0,0,0,0.08));
  }
  .media-shell {
    position: relative;
    overflow: hidden;
    aspect-ratio: var(--card-ratio);
  }
  .card-img {
    width: 100%;
    display: block;
    aspect-ratio: auto;
  }
  .card-img.portrait { aspect-ratio: auto; }
  .card-img.landscape { aspect-ratio: auto; }
  .card-img.square { aspect-ratio: auto; }
  .card-img.wide { aspect-ratio: auto; }
  .card-media img.card-img {
    object-fit: cover;
    width: 100%;
    height: 100%;
    transition: transform 0.45s cubic-bezier(0.23, 1, 0.32, 1), filter 0.45s ease;
    transform: scale(1);
    will-change: transform;
  }
  .wallpaper-card:hover .card-media img.card-img {
    transform: scale(1.05);
    filter: saturate(1.04) contrast(1.02);
  }
  .media-overlay {
    position: absolute;
    inset: 0;
    background:
      linear-gradient(180deg, rgba(0,0,0,0.02) 0%, rgba(0,0,0,0.00) 36%, rgba(0,0,0,0.28) 100%),
      linear-gradient(135deg, color-mix(in srgb, var(--card-accent) 24%, transparent), transparent 55%);
    opacity: 0.85;
    pointer-events: none;
    transition: opacity 0.25s ease;
  }
  :global(.theme-dark) .media-overlay {
    background:
      linear-gradient(180deg, rgba(255,255,255,0.02) 0%, rgba(0,0,0,0.00) 36%, rgba(0,0,0,0.45) 100%),
      linear-gradient(135deg, color-mix(in srgb, var(--card-accent) 18%, transparent), transparent 60%);
  }
  .wallpaper-card:hover .media-overlay {
    opacity: 1;
  }

  .card-info {
    padding: 16px 16px 18px;
  }
  .card-title-row {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 12px;
  }
  .card-title {
    font-size: 15px;
    line-height: 1.3;
    letter-spacing: -0.02em;
    font-weight: 650;
    margin: 0;
  }
  .card-arrow {
    color: var(--muted);
    font-size: 14px;
    line-height: 1;
    flex: none;
    transition: transform 0.25s ease, color 0.25s ease;
  }
  .wallpaper-card:hover .card-arrow {
    color: var(--fg);
    transform: translate(1px, -1px);
  }

  .card-badges {
    position: absolute;
    top: 12px;
    left: 12px;
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    z-index: 1;
  }
  .card-badge {
    padding: 5px 10px;
    border-radius: 999px;
    font-family: var(--font-mono);
    font-size: 11px;
    letter-spacing: 0.02em;
    text-transform: uppercase;
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
  }
  .card-badge-accent {
    color: var(--bg);
    background: color-mix(in srgb, var(--card-accent) 85%, #000);
    box-shadow: 0 8px 20px color-mix(in srgb, var(--card-accent) 26%, transparent);
  }
  .card-badge-muted {
    color: var(--muted);
    background: color-mix(in srgb, var(--nav-bg) 90%, transparent);
    border: 1px solid color-mix(in srgb, var(--card-accent) 12%, var(--border));
  }

  .card-action {
    position: absolute;
    right: 12px;
    bottom: 12px;
    z-index: 1;
    padding: 6px 10px;
    border-radius: 999px;
    border: 1px solid color-mix(in srgb, var(--card-accent) 18%, var(--border));
    background: color-mix(in srgb, var(--nav-bg) 90%, transparent);
    font-family: var(--font-mono);
    font-size: 10px;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: var(--muted);
    pointer-events: none;
    opacity: 0.9;
    transition: transform 0.25s ease, opacity 0.25s ease, color 0.25s ease, border-color 0.25s ease;
  }
  .wallpaper-card:hover .card-action {
    transform: translateY(-1px);
    opacity: 1;
    color: var(--fg);
    border-color: color-mix(in srgb, var(--card-accent) 38%, var(--border));
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
