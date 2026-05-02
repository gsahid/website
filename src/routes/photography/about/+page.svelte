<script>
  import { site } from '$lib/site';

  const exhibitions = [
    {
      title: 'Montreal Street Photography Festival',
      location: 'Montreal',
      year: '2025',
      href: 'https://www.mspfestival.com/cafe-leo'
    },
    {
      title: 'Seen By Her',
      location: 'Jakarta',
      year: '2025',
      href: 'https://www.instagram.com/p/DIZN3ZXB3K7/'
    },
    {
      title: 'Bandung Street Photo Festival',
      location: 'Bandung',
      year: '2024',
      href: 'https://www.instagram.com/bandungstreetphotofestival'
    }
  ];

  const publications = [
    {
      title: "No Man's Land",
      detail: 'Eyeshot Magazine',
      href: 'https://www.eyeshotstreetphotography.com/shop/magazines/no-mans-land-18'
    },
    {
      title: 'Photographer of the Week',
      detail: 'All About Photo',
      href: 'https://www.all-about-photo.com/all-about-photo-contest.php?cid=108'
    },
    {
      title: 'Honorable Mention',
      detail: 'Paris International Street Photo Awards',
      href: 'https://www.streetphotoawards.art/site/winners-gallery/spa-2024/single/honorable-mention'
    }
  ];
</script>

<svelte:head>
  <title>About | Photography | {site.title}</title>
</svelte:head>

<article class="about">
  <p class="lede">
    Indonesian street photographer currently based in Berlin. For prints or
    inquiries, reach me at
    <a href="mailto:galuh.sahid@protonmail.com">galuh.sahid@protonmail.com</a>.
  </p>

  <section>
    <h2>Exhibitions</h2>
    <ul>
      {#each exhibitions as item}
        <li>
          <a href={item.href}>{item.title}</a>
          <span class="meta">{item.location}, {item.year}</span>
        </li>
      {/each}
    </ul>
  </section>

  <section>
    <h2>Publications &amp; Awards</h2>
    <ul>
      {#each publications as item}
        <li>
          <a href={item.href}>{item.title}</a>
          <span class="meta">{item.detail}</span>
        </li>
      {/each}
    </ul>
  </section>
</article>

<style>
  .about {
    max-width: 36rem;
    margin: 0 auto;
    padding: var(--spacing-xl) var(--spacing-lg) 0;
  }

  .lede {
    color: var(--text-secondary);
    line-height: 1.7;
    margin: 0 0 var(--spacing-3xl);
  }

  .lede a {
    color: var(--text-primary);
    text-decoration: underline;
    text-underline-offset: 3px;
  }

  .lede a:hover {
    color: var(--accent);
  }

  section {
    margin-bottom: var(--spacing-2xl);
  }

  h2 {
    font-family: var(--font-mono);
    font-size: var(--text-xs);
    font-weight: var(--font-medium);
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: var(--text-muted);
    margin: 0 0 var(--spacing-md);
    padding-bottom: var(--spacing-sm);
    border-bottom: 1px solid var(--border);
  }

  ul {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  li {
    display: flex;
    flex-direction: column;
    gap: 2px;
    padding: var(--spacing-sm) 0;
  }

  li + li {
    border-top: 1px solid var(--border-subtle);
  }

  li a {
    color: var(--text-primary);
    text-decoration: none;
    font-size: var(--text-base);
  }

  li a:hover {
    color: var(--accent);
  }

  .meta {
    font-family: var(--font-mono);
    font-size: var(--text-xs);
    color: var(--text-muted);
    letter-spacing: 0.04em;
  }
</style>
