<script>
  import WallpaperCard from './WallpaperCard.svelte';

  let { wallpapers, onSelect } = $props();
</script>

<section class="section" id="gallery" style="padding-top: 0;">
  <div class="container">
    <div class="masonry">
      {#each wallpapers as wallpaper, index (wallpaper.id)}
        <WallpaperCard {wallpaper} {index} {onSelect} />
      {/each}
    </div>
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
</style>
