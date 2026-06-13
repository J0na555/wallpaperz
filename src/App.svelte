<script>
  import { onMount } from 'svelte';
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
  let wallpapers = $state([]);
  let isLoading = $state(true);
  let loadError = $state('');

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

  onMount(() => {
    const controller = new AbortController();

    async function loadWallpapers() {
      try {
        isLoading = true;
        loadError = '';

        const response = await fetch('/api/wallpapers', {
          signal: controller.signal,
        });
        const payload = await response.json();

        if (!response.ok) {
          throw new Error(payload?.error || 'Failed to load wallpapers.');
        }

        wallpapers = Array.isArray(payload.wallpapers) ? payload.wallpapers : [];
      } catch (error) {
        if (error?.name !== 'AbortError') {
          loadError = error instanceof Error ? error.message : 'Failed to load wallpapers.';
          wallpapers = [];
        }
      } finally {
        isLoading = false;
      }
    }

    loadWallpapers();

    return () => controller.abort();
  });

  // Toggle theme utility
  function toggleTheme() {
    isDark = !isDark;
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    document.documentElement.classList.toggle('theme-dark', isDark);
    document.documentElement.classList.toggle('theme-light', !isDark);
  }

  // Derived filtered wallpapers list
  function getFolderLabel(folder) {
    const parts = String(folder || '')
      .split('/')
      .map(part => part.trim())
      .filter(Boolean);

    if (parts.length === 0) {
      return 'Unsorted';
    }

    return parts[parts.length - 1]
      .split(/[-_]/g)
      .map(part => part.charAt(0).toUpperCase() + part.slice(1))
      .join(' ');
  }

  let categories = $derived([
    { value: 'all', label: 'All' },
    ...Array.from(
      new Set(
        wallpapers
          .map(wp => wp.folder || wp.category)
          .filter(Boolean)
      )
    ).map(category => ({
      value: category,
      label: getFolderLabel(category)
    }))
  ]);

  let filteredWallpapers = $derived(
    wallpapers.filter(wp => {
      const categoryKey = wp.folder || wp.category;
      const matchesCategory = activeCategory === 'all' || categoryKey === activeCategory;
      const searchTerm = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !searchTerm ||
        wp.label.toLowerCase().includes(searchTerm) ||
        (wp.folder || '').toLowerCase().includes(searchTerm) ||
        (wp.publicId || '').toLowerCase().includes(searchTerm);
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
  <Hero count={wallpapers.length} />
  
  <SearchBar bind:searchQuery />
  
  <FilterChips bind:activeCategory {categories} />
  
  <WallpaperGrid wallpapers={filteredWallpapers} loading={isLoading} error={loadError} onSelect={selectWallpaper} />
</main>

<Lightbox wallpaper={selectedWallpaper} onClose={closeLightbox} />

<Footer />
