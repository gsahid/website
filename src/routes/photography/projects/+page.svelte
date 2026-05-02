<script>
  import { projects } from '$lib/photography';
  import { site } from '$lib/site';
</script>

<svelte:head>
  <title>Portfolio | Photography | {site.title}</title>
</svelte:head>

<section class="portfolio">
  <ul class="grid">
    {#each projects as project}
      <li>
        <a class="project-card" href={`/photography/projects/${project.slug}`}>
          <div class="cover">
            <img src={project.cover} alt="" loading="lazy" />
          </div>
          <div class="meta">
            <h2>{project.title}</h2>
            <span class="year">{project.year}</span>
          </div>
        </a>
      </li>
    {/each}
  </ul>
</section>

<style>
  .portfolio {
    max-width: 64rem;
    margin: 0 auto;
    padding: 0 var(--spacing-lg);
  }

  .grid {
    list-style: none;
    padding: 0;
    margin: 0;
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
    gap: var(--spacing-2xl) var(--spacing-xl);
  }

  .project-card {
    display: block;
    text-decoration: none;
    color: inherit;
    background: transparent;
    border: none;
    padding: 0;
  }

  .cover {
    aspect-ratio: 4 / 3;
    overflow: hidden;
  }

  .cover img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 400ms ease;
  }

  .project-card:hover .cover img {
    transform: scale(1.03);
  }

  .meta {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    gap: var(--spacing-md);
    margin-top: var(--spacing-md);
  }

  h2 {
    font-family: var(--font-sans);
    font-weight: var(--font-medium);
    font-size: var(--text-base);
    letter-spacing: 0.04em;
    text-transform: uppercase;
    margin: 0;
    color: var(--text-primary);
  }

  .year {
    font-family: var(--font-mono);
    font-size: var(--text-xs);
    color: var(--text-muted);
    text-transform: uppercase;
    letter-spacing: 0.08em;
  }
</style>
