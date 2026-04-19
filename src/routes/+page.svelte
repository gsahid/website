<script>
  import { contactLinks, experience, publications } from '$lib/site';
</script>

<svelte:head>
  <title>Galuh Sahid</title>
</svelte:head>

<section class="hero">
  <div class="container-prose">
    <p class="intro">
      Hi! My name is Galuh. I&apos;m an Indonesian machine learning engineer based in Berlin. I currently work at Parloa, where I build
      tools to evaluate conversational AI agents.
    </p>
    <p class="intro">
      Before that, I worked on machine learning systems across fraud and risk, NLP, computer
      vision, and customer analytics in Southeast Asia and Europe, having previously lived in Indonesia and Singapore.
    </p>
  </div>
</section>

<section id="about" class="section">
  <div class="container-prose">
    <h2>About</h2>
    <p>
      My work sits somewhere between machine learning systems and product development. I&apos;ve built
      and shipped models, pipelines, and supporting infrastructure for products in social media,
      payments, food delivery, and customer support.
    </p>
    <p>
      Outside day-to-day engineering, I&apos;ve also spent time contributing to more inclusive tech
      communities. I co-hosted <a href="https://kartiniteknologi.id">Kartini Teknologi</a>, served
      as a <a href="https://developers.google.com/community/experts/directory/profile/profile-galuh_tunggadewi_sahid">Google Developer Expert in Machine Learning</a>,
      co-organized <a href="https://globaldiversitycfpday.com/">Global Diversity CFP Day</a> in Jakarta,
      and volunteered with organizations including <a href="https://redi-school.org">ReDI School</a>
      and <a href="https://Aidha.org">Aidha</a>.
    </p>
    <p>
      Outside of work, I&apos;m an avid <a href="https://library.velouria.dev">reader</a>, <a href="/sketches">urban sketcher</a>, and street photographer. My
      photography has been exhibited in Jakarta and <a href="https://www.mspfestival.com/cafe-leo">Montreal</a>
      and published in <a href="https://www.eyeshotstreetphotography.com/shop/magazines/no-mans-land-18">Eyeshot Magazine</a>.
      I also enjoy long-distance hiking, spending time outdoors, and <a href="/field-notes">writing field notes from my journeys</a>.
    </p>
  </div>
</section>

<section id="experience" class="section">
  <div class="container-prose">
    <h2>Experience</h2>
    <div class="timeline">
      {#each experience as item}
        <article class="timeline-item">
          <div class="timeline-period meta">{item.period}</div>
          <div>
            <h3>{item.role}</h3>
            <p class="timeline-company">{item.company}</p>
          </div>
        </article>
      {/each}
    </div>
  </div>
</section>

<section id="publications" class="section">
  <div class="container-prose">
    <h2>Talks</h2>
    <div class="publication-list">
      {#each publications as item}
        <article class="publication-item">
          <div class="list-meta">{item.year}</div>
          {#if item.href}
            <a href={item.href} class="publication-link">{item.text}</a>
          {:else}
            <p>{item.text}</p>
          {/if}
        </article>
      {/each}
    </div>
  </div>
</section>

<section id="contact" class="section">
  <div class="container-prose">
    <h2>Contact</h2>
    <div class="contact-links">
      {#each contactLinks as link}
        <a href={link.href}>{link.label}</a>
      {/each}
    </div>
  </div>
</section>

<section id="colophon" class="section">
  <div class="container-prose">
    <h2>Colophon</h2>
    <p>
      Set in Averia Serif Libre and Hanken Grotesk. Design components:
      <a href="https://components.velouria.dev">components.velouria.dev</a>.
    </p>
  </div>
</section>

<style>
  .hero {
    padding: 3rem 0 1.5rem;
  }

  h2 {
    font-size: var(--text-2xl);
    margin-bottom: var(--spacing-md);
  }

  h3 {
    font-size: var(--text-base);
    margin-bottom: 0.2rem;
  }

  .intro,
  p {
    color: var(--text-secondary);
    font-size: var(--text-base);
  }

  a {
    color: var(--text-secondary);
    transition: color var(--transition-fast);
  }

  a:hover {
    color: var(--accent);
  }

  .section {
    padding: 1.5rem 0;
  }

  .timeline,
  .publication-list {
    display: grid;
    gap: var(--spacing-md);
  }

  .timeline-item,
  .publication-item {
    display: grid;
    grid-template-columns: minmax(7rem, 8.5rem) minmax(0, 1fr);
    gap: var(--spacing-md);
    padding-top: var(--spacing-md);
    border-top: 1px solid var(--border);
  }

  .list-meta,
  .timeline-period {
    margin: 0;
    font-family: var(--font-mono);
    font-size: var(--text-xs);
    text-transform: uppercase;
    letter-spacing: var(--tracking-wider);
    color: var(--text-muted);
  }

  .timeline-company,
  .publication-item p,
  .publication-link {
    margin: 0;
    color: var(--text-secondary);
  }

  .contact-links {
    display: flex;
    flex-wrap: wrap;
    gap: var(--spacing-md);
  }
  @media (max-width: 700px) {
    .timeline-item,
    .publication-item {
      grid-template-columns: 1fr;
      gap: var(--spacing-xs);
    }
  }
</style>
