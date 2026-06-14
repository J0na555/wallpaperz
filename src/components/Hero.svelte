<script>
  let { count } = $props();
</script>

<section class="section hero">
  <div class="container">
    <p class="eyebrow">Curated · Dark · High-Resolution</p>
    <h1>Wallpaperz</h1>
    <p class="lead">A curated collection of wallpapers I love. Click any image to preview and download in full resolution.</p>
    <span class="status-pill">{count} {count === 1 ? 'wallpaper' : 'wallpapers'}</span>
    <div class="hero-divider"></div>
  </div>
</section>

<style>
  .hero {
    padding-top: clamp(120px, 18vw, 220px);
    padding-bottom: clamp(32px, 5vw, 60px);
    text-align: center;
  }
  .eyebrow {
    font-family: var(--font-mono);
    font-size: 12px;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--muted);
    margin-bottom: var(--gap-md);
  }
  h1 {
    font-family: var(--font-display);
    font-size: var(--fs-h1);
    line-height: 1.08;
    letter-spacing: -0.03em;
    font-weight: 700;
    margin-bottom: var(--gap-md);
  }
  .lead {
    font-size: var(--fs-lead);
    color: var(--muted);
    max-width: 42ch;
    margin: 0 auto var(--gap-md);
    line-height: 1.6;
  }
  .status-pill {
    display: inline-block;
    margin-top: var(--gap-md);
    padding: 5px 14px;
    border-radius: 999px;
    border: 1px solid var(--border);
    font-family: var(--font-mono);
    font-size: 11px;
    letter-spacing: 0.03em;
    color: var(--muted);
  }
  .hero-divider {
    width: 48px;
    height: 1px;
    background: var(--border);
    margin: var(--gap-xl) auto 0;
  }

  @media (max-width: 920px) {
    h1 {
      font-size: clamp(32px, 8vw, 48px);
    }
  }
</style>
