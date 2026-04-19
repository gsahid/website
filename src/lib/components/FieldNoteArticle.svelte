<script>
  import { formatFieldNoteDate } from '$lib/field-notes-format';

  let { note } = $props();
</script>

<article class="field-note-page">
  {#if note.featuredImage}
    <div class="field-note-feature container-editorial">
      <img src={note.featuredImage} alt="" class="field-note-featured-image" />
    </div>
  {/if}

  <header class="field-note-header container-editorial">
    <div class="field-note-heading-block">
      <a class="field-note-back meta" href="/field-notes/">Field Notes</a>
      <h1>
        {note.title}
        <span class="field-note-separator" aria-hidden="true">·</span>
        <span class="field-note-subtitle">{note.subtitle}</span>
      </h1>
    </div>

    <div class="field-note-meta">
      <div class="field-note-meta-group">
        <p class="meta">Published</p>
        <time datetime={note.dateIso}>{formatFieldNoteDate(note.date)}</time>
      </div>

      <div class="field-note-meta-group">
        <p class="meta">Category</p>
        <a class="field-note-category" href={`/field-notes/category/${note.categorySlug}/`}>
          {note.category}
        </a>
      </div>
    </div>
  </header>

  <div class="field-note-content-shell container-editorial">
    <div class="field-note-prose">
      {@html note.html}
    </div>
  </div>

  <nav class="field-note-navigation container-editorial" aria-label="Field note navigation">
    <div class="field-note-nav-side field-note-nav-side-prev">
      {#if note.prevNote}
        <a class="field-note-nav-link" href={note.prevNote.url}>
          <span class="meta">← Prev</span>
          <span>{note.prevNote.title}</span>
        </a>
      {/if}
    </div>

    <div class="field-note-nav-center">
      <a class="meta" href="/field-notes/">Back to archive</a>
    </div>

    <div class="field-note-nav-side field-note-nav-side-next">
      {#if note.nextNote}
        <a class="field-note-nav-link field-note-nav-link-next" href={note.nextNote.url}>
          <span class="meta">Next →</span>
          <span>{note.nextNote.title}</span>
        </a>
      {/if}
    </div>
  </nav>
</article>

<style>
  .field-note-page {
    padding: 0 0 var(--spacing-3xl);
  }

  .field-note-feature {
    padding-top: var(--spacing-xl);
  }

  .field-note-featured-image {
    display: block;
    width: 100%;
    max-height: 76vh;
    object-fit: cover;
    border: 1px solid var(--border);
  }

  .field-note-header {
    display: grid;
    grid-template-columns: minmax(0, 1fr) 13rem;
    gap: var(--spacing-2xl);
    padding-top: var(--spacing-xl);
    padding-bottom: var(--spacing-xl);
    border-bottom: 1px solid var(--border);
  }

  .field-note-back {
    display: inline-block;
    margin-bottom: var(--spacing-md);
    color: var(--text-secondary);
    text-decoration: none;
  }

  h1 {
    max-width: 16ch;
    font-size: clamp(2.7rem, 6vw, 5.4rem);
    line-height: 0.95;
    letter-spacing: -0.05em;
  }

  .field-note-separator {
    display: inline;
    margin: 0 0.2em 0 0.28em;
    color: var(--accent);
    font-weight: 600;
  }

  .field-note-subtitle {
    display: inline;
    color: var(--text-secondary);
    font-weight: 300;
  }

  .field-note-meta {
    align-self: end;
  }

  .field-note-meta-group + .field-note-meta-group {
    margin-top: var(--spacing-lg);
  }

  .field-note-meta time {
    display: block;
    margin-top: var(--spacing-xs);
    color: var(--text-secondary);
    font-family: var(--font-sans);
    font-size: var(--text-base);
  }

  .field-note-category {
    display: inline-block;
    margin-top: var(--spacing-xs);
    color: var(--text-primary);
    font-family: var(--font-sans);
    font-size: var(--text-base);
    font-weight: 500;
    letter-spacing: 0;
    text-transform: none;
    text-decoration: none;
    text-decoration-line: underline;
    text-decoration-color: color-mix(in srgb, var(--accent) 65%, transparent);
    text-underline-offset: 0.2em;
    transition: color var(--transition-fast);
  }

  .field-note-category:hover {
    color: var(--accent);
  }

  .field-note-content-shell {
    padding-top: var(--spacing-2xl);
  }

  .field-note-prose {
    max-width: var(--max-width-prose);
  }

  .field-note-prose :global(p),
  .field-note-prose :global(ul),
  .field-note-prose :global(ol),
  .field-note-prose :global(blockquote) {
    margin-top: var(--spacing-lg);
    color: var(--text-secondary);
  }

  .field-note-prose :global(a) {
    color: var(--text-primary);
    text-decoration-color: color-mix(in srgb, var(--accent) 65%, transparent);
    text-underline-offset: 0.18em;
  }

  .field-note-prose :global(a:hover) {
    color: var(--accent);
  }

  .field-note-prose :global(strong) {
    color: var(--text-primary);
  }

  .field-note-prose :global(h2),
  .field-note-prose :global(h3) {
    margin-top: var(--spacing-2xl);
    font-size: var(--text-2xl);
  }

  .field-note-prose :global(ul),
  .field-note-prose :global(ol) {
    padding-left: 1.25rem;
  }

  .field-note-prose :global(.field-note-figure) {
    width: min(100vw - (var(--padding-mobile) * 2), 56rem);
    margin: var(--spacing-xl) 0;
  }

  .field-note-prose :global(.field-note-figure img) {
    display: block;
    width: 100%;
    border: 1px solid var(--border);
  }

  .field-note-prose :global(.field-note-figure figcaption) {
    margin-top: var(--spacing-sm);
    font-family: var(--font-mono);
    font-size: var(--text-xs);
    letter-spacing: var(--tracking-wider);
    text-transform: uppercase;
    color: var(--text-muted);
  }

  .field-note-navigation {
    position: relative;
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    column-gap: var(--spacing-2xl);
    row-gap: var(--spacing-md);
    padding-top: var(--spacing-2xl);
    border-top: 1px solid var(--border);
    align-items: start;
  }

  .field-note-nav-center {
    position: absolute;
    top: var(--spacing-2xl);
    left: 50%;
    transform: translateX(-50%);
    text-align: center;
  }

  .field-note-nav-center a {
    color: var(--text-secondary);
    text-decoration: none;
  }

  .field-note-nav-side {
    min-width: 0;
  }

  .field-note-nav-side-next {
    display: flex;
    justify-content: flex-end;
  }

  .field-note-nav-link {
    display: inline-grid;
    gap: var(--spacing-xs);
    color: var(--text-primary);
    text-decoration: none;
  }

  .field-note-nav-link-next {
    justify-self: end;
    text-align: right;
  }

  @media (max-width: 900px) {
    .field-note-header {
      grid-template-columns: 1fr;
    }

    .field-note-prose :global(.field-note-figure) {
      width: 100%;
    }
  }

  @media (max-width: 700px) {
    .field-note-navigation {
      position: static;
      grid-template-columns: 1fr;
    }

    .field-note-nav-side-next {
      display: block;
    }

    .field-note-nav-center,
    .field-note-nav-link-next {
      position: static;
      transform: none;
      text-align: left;
      justify-self: start;
    }
  }
</style>
