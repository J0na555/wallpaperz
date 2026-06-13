<script>
  let { searchQuery = $bindable() } = $props();
</script>

<section id="search" style="padding-bottom: var(--gap-lg);">
  <div class="container">
    <div class="search-wrap">
      <span class="search-icon">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
          <circle cx="11" cy="11" r="8"></circle>
          <path d="m21 21-4.35-4.35"></path>
        </svg>
      </span>
      <input 
        type="text" 
        class="search-input" 
        bind:value={searchQuery} 
        placeholder="Search wallpapers by tag..." 
      />
    </div>
  </div>
</section>

<style>
  .search-wrap {
    max-width: 420px;
    margin: 0 auto var(--gap-xl);
    position: relative;
  }
  .search-icon {
    position: absolute;
    left: 14px;
    top: 50%;
    transform: translateY(-50%);
    color: var(--muted);
    width: 15px;
    height: 15px;
    pointer-events: none;
  }
  .search-icon svg {
    display: block;
    width: 100%;
    height: 100%;
  }
  .search-input {
    width: 100%;
    padding: 11px 16px 11px 40px;
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 999px;
    color: var(--fg);
    font-family: var(--font-body);
    font-size: 14px;
    outline: none;
    transition: border-color 0.15s ease, background 0.15s ease;
  }
  .search-input::placeholder {
    color: var(--muted);
  }
  .search-input:focus {
    border-color: var(--search-focus-border);
  }
</style>
