<script>
  import { tick } from 'svelte';

  let { photos = [], caption: showCaption = false } = $props();

  let index = $state(0);
  const count = $derived(photos.length);
  const current = $derived(photos[index]);

  let thumbsEl;
  const thumbRefs = [];

  function go(delta) {
    if (count === 0) return;
    index = (index + delta + count) % count;
  }

  function select(i) {
    index = i;
  }

  function onKey(e) {
    if (e.key === 'ArrowLeft') go(-1);
    if (e.key === 'ArrowRight') go(1);
  }

  // Preload neighbors so navigation feels instant
  $effect(() => {
    if (typeof window === 'undefined' || count === 0) return;
    const targets = [
      photos[(index + 1) % count],
      photos[(index - 1 + count) % count],
      photos[(index + 2) % count]
    ];
    for (const photo of targets) {
      const img = new Image();
      img.decoding = 'async';
      img.src = photo.src;
    }
  });

  // Keep the active thumbnail centered in the scroll strip
  $effect(() => {
    const i = index;
    if (!thumbsEl) return;
    tick().then(() => {
      const el = thumbRefs[i];
      if (!el) return;
      const target =
        el.offsetLeft - thumbsEl.clientWidth / 2 + el.offsetWidth / 2;
      thumbsEl.scrollTo({ left: target, behavior: 'smooth' });
    });
  });
</script>

<svelte:window on:keydown={onKey} />

{#if count > 0}
  <div class="slideshow">
    <div class="stage">
      <button
        class="nav nav-prev"
        aria-label="Previous image"
        onclick={() => go(-1)}
      >
        <span aria-hidden="true">&larr;</span>
      </button>

      <div class="frame">
        <img
          src={current.src}
          alt={current.caption || 'Photograph'}
          decoding="async"
          fetchpriority="high"
        />
      </div>

      <button
        class="nav nav-next"
        aria-label="Next image"
        onclick={() => go(1)}
      >
        <span aria-hidden="true">&rarr;</span>
      </button>
    </div>

    {#if showCaption && current.caption}
      <p class="caption">{current.caption}</p>
    {/if}

    <div
      class="thumbs"
      role="tablist"
      aria-label="Image thumbnails"
      bind:this={thumbsEl}
    >
      {#each photos as photo, i}
        <button
          class="thumb"
          class:active={i === index}
          aria-label={`Show image ${i + 1}`}
          aria-selected={i === index}
          role="tab"
          bind:this={thumbRefs[i]}
          onclick={() => select(i)}
        >
          <img src={photo.src} alt="" loading="lazy" decoding="async" />
        </button>
      {/each}
    </div>
  </div>
{/if}

<style>
  .slideshow {
    width: 100%;
    max-width: min(960px, 92vw);
    margin: 0 auto;
  }

  .stage {
    position: relative;
  }

  .frame {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 0;
    width: 100%;
  }

  .frame img {
    width: 100%;
    max-height: 75vh;
    height: auto;
    object-fit: contain;
    display: block;
  }

  .nav {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    background: transparent;
    border: none;
    color: var(--text-muted);
    font-size: 1.5rem;
    line-height: 1;
    width: 2.5rem;
    height: 2.5rem;
    cursor: pointer;
    transition: color var(--transition-fast, 150ms ease);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 2;
  }

  .nav-prev { left: -3.5rem; }
  .nav-next { right: -3.5rem; }

  .nav:hover,
  .nav:focus-visible {
    color: var(--text-primary);
  }

  .nav:focus-visible {
    outline: 2px solid var(--accent);
    outline-offset: 2px;
  }

  .caption {
    text-align: center;
    font-family: var(--font-serif);
    font-style: italic;
    color: var(--text-secondary);
    margin: var(--spacing-md) 0 0;
    font-size: var(--text-sm);
  }

  .thumbs {
    display: flex;
    gap: var(--spacing-sm);
    margin-top: var(--spacing-xl);
    flex-wrap: nowrap;
    overflow-x: auto;
    overflow-y: hidden;
    scroll-behavior: smooth;
    scrollbar-width: none;
    padding-bottom: 2px;
  }

  .thumbs::-webkit-scrollbar {
    display: none;
  }

  .thumb {
    flex: 0 0 auto;
    width: 64px;
    height: 64px;
    padding: 0;
    border: none;
    background: var(--bg-secondary);
    cursor: pointer;
    overflow: hidden;
    opacity: 0.55;
    transition: opacity var(--transition-fast, 150ms ease);
  }

  .thumb img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }

  .thumb:hover,
  .thumb:focus-visible {
    opacity: 1;
  }

  .thumb.active {
    opacity: 1;
    outline: 1px solid var(--text-primary);
    outline-offset: 2px;
  }

  .thumb:focus-visible {
    outline: 2px solid var(--accent);
    outline-offset: 2px;
  }

  @media (max-width: 900px) {
    .slideshow {
      max-width: calc(100vw - 6rem);
    }

    .nav-prev { left: -2.5rem; }
    .nav-next { right: -2.5rem; }
  }

  @media (max-width: 700px) {
    .nav-prev { left: -2rem; }
    .nav-next { right: -2rem; }

    .thumb {
      width: 48px;
      height: 48px;
    }
  }
</style>
