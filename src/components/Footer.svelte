<section id="about">
  <footer class="pagefoot">
    <div class="container pagefoot-inner">
      <div class="foot-left">
        <p class="foot-copy">
          © 2026 <a href="https://github.com/J0na555" target="_blank" rel="noopener noreferrer" class="link-accent">Jonas</a>
        </p>
      </div>
    </div>
  </footer>
</section>

<style>
  .pagefoot {
    padding-block: var(--gap-xl);
    border-top: 1px solid var(--border);
    margin-top: var(--gap-2xl);
  }
  .pagefoot-inner {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: var(--gap-md);
  }
  .foot-left {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  .foot-copy {
    font-size: 12px;
    color: var(--muted);
  }
  .link-accent {
    color: var(--fg);
    font-weight: 500;
    border-bottom: 1px solid var(--border);
    padding-bottom: 1px;
    transition: border-color 0.15s ease;
  }
  .link-accent:hover {
    border-color: var(--fg);
  }

  @media (max-width: 560px) {
    .pagefoot-inner {
      flex-direction: column;
      align-items: flex-start;
    }
  }
</style>
