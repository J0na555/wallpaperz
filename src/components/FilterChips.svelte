<script>
  let { activeCategory = $bindable() } = $props();

  const categories = [
    { value: 'all', label: 'All' },
    { value: 'nature', label: 'Nature' },
    { value: 'abstract', label: 'Abstract' },
    { value: 'space', label: 'Space' },
    { value: 'cyberpunk', label: 'Cyberpunk' },
    { value: 'minimal', label: 'Minimal' },
    { value: 'city', label: 'City' }
  ];
</script>

<section style="padding-bottom: var(--gap-xl);">
  <div class="container">
    <div class="filters">
      {#each categories as category}
        <button 
          class="filter-chip" 
          class:active={activeCategory === category.value}
          onclick={() => activeCategory = category.value}
        >
          {category.label}
        </button>
      {/each}
    </div>
  </div>
</section>

<style>
  .filters {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: var(--gap-sm);
    margin-bottom: var(--gap-xl);
    flex-wrap: wrap;
  }
  .filter-chip {
    padding: 7px 16px;
    border-radius: 999px;
    border: 1px solid var(--border);
    background: transparent;
    color: var(--muted);
    font-family: var(--font-mono);
    font-size: 12px;
    letter-spacing: 0.02em;
    transition: all 0.15s ease;
  }
  .filter-chip:hover {
    border-color: var(--chip-hover-border);
    color: var(--fg);
  }
  .filter-chip.active {
    background: var(--fg);
    color: var(--bg);
    border-color: var(--fg);
  }

  @media (max-width: 560px) {
    .filters {
      gap: 6px;
    }
    .filter-chip {
      padding: 6px 12px;
      font-size: 11px;
    }
  }
</style>
