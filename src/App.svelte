<script>
  import { wallpapers } from './lib/data.js';
  import TopNav from './components/TopNav.svelte';
  import Hero from './components/Hero.svelte';
  import SearchBar from './components/SearchBar.svelte';
  import FilterChips from './components/FilterChips.svelte';
  import WallpaperGrid from './components/WallpaperGrid.svelte';
  import Lightbox from './components/Lightbox.svelte';
  import Footer from './components/Footer.svelte';

  let activeCategory = $state('all');
  let searchQuery = $state('');
  let selectedWallpaper = $state(null);
  let isDark = $state(false);

  // Sync isDark with localStorage and OS preference on mount
  $effect(() => {
    const stored = localStorage.getItem('theme');
    isDark = stored === 'dark' || (stored !== 'light' && window.matchMedia('(prefers-color-scheme: dark)').matches);
    document.documentElement.classList.toggle('theme-dark', isDark);
  });

  // Listen for changes in OS color scheme preference
  $effect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = (e) => {
      const stored = localStorage.getItem('theme');
      if (!stored) {
        isDark = e.matches;
        document.documentElement.classList.toggle('theme-dark', isDark);
      }
    };
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  });

  // Reset category filter if search query is typed (matching original JS behavior)
  $effect(() => {
    if (searchQuery.trim() !== '') {
      activeCategory = 'all';
    }
  });

  // Toggle theme utility
  function toggleTheme() {
    isDark = !isDark;
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    document.documentElement.classList.toggle('theme-dark', isDark);
    document.documentElement.classList.toggle('theme-light', !isDark);
  }

  // Derived filtered wallpapers list
  let filteredWallpapers = $derived(
    wallpapers.filter(wp => {
      const matchesCategory = activeCategory === 'all' || wp.category === activeCategory;
      const matchesSearch = !searchQuery || wp.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase().trim()));
      return matchesCategory && matchesSearch;
    })
  );

  function selectWallpaper(wp) {
    selectedWallpaper = wp;
  }

  function closeLightbox() {
    selectedWallpaper = null;
  }
</script>

<TopNav {isDark} {toggleTheme} />

<main id="content">
  <Hero count={filteredWallpapers.length} />
  
  <SearchBar bind:searchQuery />
  
  <FilterChips bind:activeCategory />
  
  <WallpaperGrid wallpapers={filteredWallpapers} onSelect={selectWallpaper} />
</main>

<Lightbox wallpaper={selectedWallpaper} onClose={closeLightbox} />

<Footer />
