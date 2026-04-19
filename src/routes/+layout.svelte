<script>
  import '$lib/styles/theme.css';
  import '$lib/styles/fonts.css';
  import '$lib/styles/global.css';
  import { site } from '$lib/site';

  let { children } = $props();
</script>

<svelte:head>
  <title>{site.title}</title>
  <meta name="description" content={site.description} />
  <meta property="og:title" content={site.title} />
  <meta property="og:description" content={site.description} />
  <meta property="og:type" content="website" />
  <meta property="og:url" content={site.url} />
</svelte:head>

<div class="app-shell">
  <main>
    {@render children()}
  </main>
</div>

<style>
  .app-shell {
    min-height: 100vh;
  }

  main {
    padding-bottom: var(--spacing-3xl);
  }
</style>
