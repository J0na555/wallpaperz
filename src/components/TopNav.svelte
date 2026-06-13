<script>
  let { isDark, toggleTheme } = $props();
  let visible = $state(false);

  function handleScroll() {
    visible = window.scrollY > 200;
  }
</script>

<svelte:window onscroll={handleScroll} />

<header class="topnav" class:visible>
  <div class="container topnav-inner">
    <span class="logo">Wallpapers</span>
    <nav>
      <a href="#gallery">Collections</a>
      <a href="#search">Search</a>
      <a href="#about">About</a>
      <button 
        type="button" 
        class="theme-btn" 
        onclick={toggleTheme} 
        aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      >
        <svg class="icon-sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
          <circle cx="12" cy="12" r="4"></circle>
          <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"></path>
        </svg>
        <svg class="icon-moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
        </svg>
      </button>
    </nav>
  </div>
</header>

<style>
  .topnav {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 100;
    background: var(--nav-bg);
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
    border-bottom: 1px solid var(--border);
    transform: translateY(-100%);
    transition: transform 0.3s cubic-bezier(0.23, 1, 0.32, 1);
  }
  .topnav.visible {
    transform: translateY(0);
  }
  .topnav-inner {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-block: 14px;
  }
  .logo {
    font-family: var(--font-body);
    font-size: 15px;
    font-weight: 600;
    color: var(--fg);
    letter-spacing: -0.01em;
  }
  nav {
    display: flex;
    align-items: center;
    gap: var(--gap-lg);
  }
  nav a {
    font-size: 13px;
    color: var(--muted);
    transition: color 0.15s ease;
  }
  nav a:hover {
    color: var(--fg);
  }

  /* Theme button styles */
  .theme-btn {
    background: none;
    border: none;
    padding: 6px;
    color: var(--muted);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    transition: color 0.15s ease;
  }
  .theme-btn:hover {
    color: var(--fg);
  }
  .theme-btn svg {
    width: 18px;
    height: 18px;
    display: block;
  }

  .icon-moon {
    display: none;
  }
  .icon-sun {
    display: block;
  }

  :global(.theme-dark) .icon-sun {
    display: none;
  }
  :global(.theme-dark) .icon-moon {
    display: block;
  }

  @media (max-width: 920px) {
    nav {
      gap: var(--gap-md);
    }
  }
  @media (max-width: 560px) {
    nav a {
      font-size: 12px;
    }
  }
</style>
