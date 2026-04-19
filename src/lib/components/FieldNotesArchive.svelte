<script>
  import { formatFieldNoteArchiveDate } from '$lib/field-notes-format';

  let { page } = $props();

  const allCategoriesActive = $derived(!page.categories.some((category) => category.isActive));
  const allYearsActive = $derived(!page.years.some((year) => year.isActive));
</script>

<section class="field-notes-shell">
  <header class="field-notes-hero container-editorial">
    <h1>Field Notes</h1>
  </header>

  <div class="field-notes-toolbar-wrap container-editorial">
    <div class="field-notes-toolbar" aria-label="Field notes filters">
      <div class="field-notes-toolbar-filters">
        <div class="field-notes-filter">
          <span class="meta field-notes-filter-label">Category</span>
          <div class="field-notes-filter-pills">
            <a
              href="/field-notes/"
              class:chip-active={allCategoriesActive}
              class="chip-button map-pill"
            >All</a>
            {#each page.categories as category}
              <a
                href={category.href}
                class:chip-active={category.isActive}
                class="chip-button map-pill"
              >{category.label}</a>
            {/each}
          </div>
        </div>

        <div class="field-notes-filter">
          <span class="meta field-notes-filter-label">Year</span>
          <div class="field-notes-filter-pills">
            <a
              href="/field-notes/"
              class:chip-active={allYearsActive}
              class="chip-button map-pill"
            >All</a>
            {#each page.years as year}
              <a
                href={year.href}
                class:chip-active={year.isActive}
                class="chip-button map-pill"
              >{year.label}</a>
            {/each}
          </div>
        </div>
      </div>

      {#if page.totalPages > 1}
        <p class="meta field-notes-toolbar-count">Page {page.pageNumber} of {page.totalPages}</p>
      {:else}
        <p class="meta field-notes-toolbar-count">
          {page.notes.length} {page.notes.length === 1 ? 'note' : 'notes'}
        </p>
      {/if}
    </div>
  </div>

  <div class="field-notes-grid container-editorial">
    {#each page.notes as note}
      <article class="note-card">
        <a class="note-card-link" href={note.url} aria-label={`Read ${note.title}`}>
          {#if note.featuredImage}
            <img class="note-card-image" src={note.featuredImage} alt="" loading="lazy" />
          {/if}

          <div class="note-card-body">
            <p class="meta">{formatFieldNoteArchiveDate(note.date)}</p>
            <h2>
              {note.title}
              {#if note.subtitle}
                <span class="note-card-separator" aria-hidden="true">·</span>
                <span class="note-card-subtitle">{note.subtitle}</span>
              {/if}
            </h2>
          </div>
        </a>
      </article>
    {/each}
  </div>

  {#if page.totalPages > 1}
    <nav class="archive-pagination container-editorial" aria-label="Field notes pagination">
      {#if page.prevPageHref}
        <a class="pagination-link" href={page.prevPageHref}>← Newer posts</a>
      {:else}
        <span class="pagination-spacer"></span>
      {/if}

      <p class="meta">Page {page.pageNumber} of {page.totalPages}</p>

      {#if page.nextPageHref}
        <a class="pagination-link" href={page.nextPageHref}>Older posts →</a>
      {:else}
        <span class="pagination-spacer"></span>
      {/if}
    </nav>
  {/if}
</section>

<style>
  .field-notes-shell {
    padding-bottom: var(--spacing-3xl);
  }

  .field-notes-hero {
    display: grid;
    gap: var(--spacing-md);
    padding-top: var(--spacing-3xl);
    padding-bottom: var(--spacing-xl);
  }

  h1 {
    max-width: 12ch;
    font-size: clamp(2.2rem, 5vw, 4rem);
    line-height: 0.94;
    letter-spacing: -0.05em;
    margin: 0;
  }

  .field-notes-hero-lede {
    max-width: 44rem;
    color: var(--text-secondary);
    font-size: var(--text-lg);
    margin: 0;
  }

  .field-notes-toolbar-wrap {
    padding-top: var(--spacing-md);
    padding-bottom: var(--spacing-md);
    border-top: 1px solid var(--border);
    border-bottom: 1px solid var(--border);
  }

  .field-notes-toolbar {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: var(--spacing-lg);
  }

  .field-notes-toolbar-filters {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: var(--spacing-lg);
  }

  .field-notes-filter {
    display: flex;
    align-items: center;
    gap: var(--spacing-sm);
  }

  .field-notes-filter-label {
    color: var(--text-muted);
  }

  .field-notes-filter-pills {
    display: flex;
    flex-wrap: wrap;
    gap: var(--spacing-xs);
  }

  .field-notes-toolbar-count {
    margin: 0;
    color: var(--text-muted);
  }

  .field-notes-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: var(--spacing-xl);
    padding-top: var(--spacing-2xl);
  }

  .note-card {
    border: 0;
    padding: 0;
  }

  .note-card-link {
    display: grid;
    gap: var(--spacing-md);
    color: inherit;
    text-decoration: none;
  }

  .note-card-image {
    width: 100%;
    aspect-ratio: 4 / 3;
    object-fit: cover;
    border: 1px solid var(--border);
    transition: transform var(--transition-fast);
  }

  .note-card-link:hover .note-card-image {
    transform: scale(1.01);
  }

  .note-card-body h2 {
    margin-top: var(--spacing-sm);
    font-size: clamp(1.45rem, 2vw, 2rem);
    line-height: 1.05;
  }

  .note-card-separator {
    display: inline;
    margin: 0 0.2em 0 0.28em;
    color: var(--accent);
    font-weight: 600;
  }

  .note-card-subtitle {
    display: inline;
    color: var(--text-secondary);
    font-weight: 300;
  }

  .archive-pagination {
    display: grid;
    grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr);
    align-items: center;
    gap: var(--spacing-md);
    padding-top: var(--spacing-2xl);
  }

  .pagination-link {
    color: var(--text-primary);
    text-decoration: none;
    transition: color var(--transition-fast);
  }

  .pagination-link:hover {
    color: var(--accent);
  }

  .pagination-link:last-child {
    justify-self: end;
  }

  .pagination-spacer {
    display: block;
    min-height: 1px;
  }

  @media (max-width: 900px) {
    .field-notes-grid {
      grid-template-columns: 1fr;
    }
  }

  @media (max-width: 640px) {
    h1 {
      max-width: 10ch;
    }

    .archive-pagination {
      grid-template-columns: 1fr;
      justify-items: start;
    }

    .pagination-link:last-child {
      justify-self: start;
    }
  }
</style>
