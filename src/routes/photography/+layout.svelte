<script>
  import { page } from '$app/stores';

  let { children } = $props();

  const links = [
    { href: '/photography/projects', label: 'Portfolio' },
    { href: '/photography/about', label: 'About' }
  ];

  function isActive(href) {
    const path = $page.url.pathname.replace(/\/$/, '');
    const target = href.replace(/\/$/, '');
    if (target === '/photography/projects') return path.startsWith('/photography/projects');
    return path === target;
  }
</script>

<div class="photo-shell">
  <header class="photo-header">
    <a class="logo" href="/photography">galuh sahid</a>
    <nav class="photo-nav" aria-label="Photography navigation">
      {#each links as link}
        <a
          href={link.href}
          class="photo-nav-link"
          class:current={isActive(link.href)}
        >
          {link.label}
        </a>
      {/each}
    </nav>
  </header>

  <main class="photo-main">
    {@render children()}
  </main>

  <footer class="photo-footer">
    <a href="/">&larr; back to galuhsahid.com</a>
  </footer>
</div>

<style>
  .photo-shell {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
  }

  .photo-header {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    padding: var(--spacing-xl) var(--spacing-2xl);
    gap: var(--spacing-lg);
  }

  .logo {
    font-family: var(--font-serif);
    font-size: var(--text-xl);
    color: var(--text-primary);
    text-decoration: none;
    letter-spacing: 0.01em;
  }

  .photo-nav {
    display: flex;
    gap: var(--spacing-xl);
  }

  .photo-nav-link {
    font-family: var(--font-sans);
    font-size: var(--text-base);
    color: var(--text-secondary);
    text-decoration: none;
    padding-bottom: 2px;
    border-bottom: 1px solid transparent;
    transition: color var(--transition-fast, 150ms ease),
      border-color var(--transition-fast, 150ms ease);
  }

  .photo-nav-link:hover {
    color: var(--text-primary);
  }

  .photo-nav-link.current {
    color: var(--text-primary);
    border-bottom-color: var(--text-primary);
  }

  .photo-main {
    flex: 1;
    padding: var(--spacing-xl) 0 var(--spacing-3xl);
  }

  .photo-footer {
    padding: var(--spacing-xl) var(--spacing-2xl);
    font-family: var(--font-mono);
    font-size: var(--text-xs);
    text-transform: uppercase;
    letter-spacing: 0.08em;
  }

  .photo-footer a {
    color: var(--text-muted);
    text-decoration: none;
  }

  .photo-footer a:hover {
    color: var(--text-primary);
  }

  @media (max-width: 700px) {
    .photo-header {
      padding: var(--spacing-lg) var(--spacing-md);
      flex-direction: row;
      flex-wrap: wrap;
    }

    .photo-nav {
      gap: var(--spacing-md);
    }

    .photo-footer {
      padding: var(--spacing-lg) var(--spacing-md);
    }
  }
</style>
