<script>
  import WallpaperCard from './WallpaperCard.svelte';

  let { wallpapers, onSelect, loading = false, error = '' } = $props();
</script>

<section class="section" id="gallery" style="padding-top: 0;">
  <div class="container">
    {#if loading}
      <div class="empty-state">Loading uploaded wallpapers...</div>
    {:else if error}
      <div class="empty-state">{error}</div>
    {:else if wallpapers.length === 0}
      <div class="empty-state">No uploaded wallpapers yet.</div>
    {:else}
      <div class="masonry">
        {#each wallpapers as wallpaper, index (wallpaper.id)}
          <WallpaperCard {wallpaper} {index} {onSelect} />
        {/each}
      </div>
    {/if}
  </div>
</section>

<style>
  .masonry {
    columns: 3;
    column-gap: var(--gap-md);
  }

  @media (max-width: 920px) {
    .masonry {
      columns: 2;
    }
  }
  @media (max-width: 560px) {
    .masonry {
      columns: 1;
    }
  }

  .empty-state {
    padding: 32px 20px;
    text-align: center;
    color: var(--muted);
    border: 1px dashed var(--border);
    border-radius: var(--radius-lg);
    background: var(--surface);
  }
</style>
