<script>
  import PhotoSlideshow from '$lib/components/PhotoSlideshow.svelte';
  import { site } from '$lib/site';

  let { data } = $props();
  const project = $derived(data.project);
</script>

<svelte:head>
  <title>{project.title} | Photography | {site.title}</title>
  <meta name="description" content={project.description} />
</svelte:head>

<section class="project">
  <header class="intro">
    <h1>{project.title}</h1>
    <span class="year">{project.year}</span>
  </header>
  {#if project.description}
    <p class="lede">{project.description}</p>
  {/if}

  <PhotoSlideshow photos={project.photos} caption />
</section>

<style>
  .project {
    width: 100%;
  }

  .intro {
    max-width: min(960px, 92vw);
    margin: 0 auto var(--spacing-md);
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    gap: var(--spacing-md);
  }

  h1 {
    font-family: var(--font-serif);
    font-size: var(--text-3xl);
    margin: 0;
    color: var(--text-primary);
    font-weight: var(--font-normal);
  }

  .year {
    font-family: var(--font-mono);
    font-size: var(--text-xs);
    color: var(--text-muted);
    text-transform: uppercase;
    letter-spacing: 0.08em;
  }

  .lede {
    max-width: min(960px, 92vw);
    margin: 0 auto var(--spacing-2xl);
    color: var(--text-secondary);
    line-height: 1.7;
  }
</style>
