<script>
  import { browser } from '$app/environment';
  import { onDestroy, onMount } from 'svelte';
  import { fallbackMapTheme, getMapStyle, resolveMapTheme } from '$lib/map-system';
  import { site } from '$lib/site';
  import 'maplibre-gl/dist/maplibre-gl.css';

  export let data;
  const MAPTILER_KEY = import.meta.env.VITE_MAPTILER_KEY;

  let mapContainer;
  let map;
  let maplibregl;
  let resolvedMapTheme = fallbackMapTheme;
  let activeYear = 'all';
  let activeCategory = 'all';
  let activeCountry = 'all';
  let activeView = 'grid';
  let activeSketchId = data.sketches[0]?.id ?? null;
  let activeImageIndex = 0;
  let lightboxOpen = false;

  $: filteredSketches = data.sketches.filter((sketch) => {
    if (activeYear !== 'all' && sketch.year !== activeYear) {
      return false;
    }

    if (activeCategory !== 'all' && sketch.category !== activeCategory) {
      return false;
    }

    if (activeCountry !== 'all' && sketch.country !== activeCountry) {
      return false;
    }

    return true;
  });

  $: if (!filteredSketches.some((sketch) => sketch.id === activeSketchId)) {
    activeSketchId = filteredSketches[0]?.id ?? null;
    activeImageIndex = 0;
  }

  $: activeSketch = filteredSketches.find((sketch) => sketch.id === activeSketchId) ?? filteredSketches[0] ?? null;
  $: activeImage = activeSketch?.images[activeImageIndex] ?? null;
  $: filteredDrawingCount = filteredSketches.reduce((sum, sketch) => sum + sketch.imageCount, 0);
  $: filteredCountryCount = new Set(filteredSketches.map((sketch) => sketch.location.split(', ').at(-1))).size;

  $: if (activeSketch && activeImageIndex >= activeSketch.images.length) {
    activeImageIndex = 0;
  }

  $: filteredSketches, updateMapData();
  $: activeSketchId, resolvedMapTheme, updateSelectedSketchPaint();

  function selectYear(year) {
    activeYear = year;
    activeImageIndex = 0;
  }

  function selectCategory(category) {
    activeCategory = category;
    activeImageIndex = 0;
  }

  function selectCountry(country) {
    activeCountry = country;
    activeImageIndex = 0;
  }

  function selectView(view) {
    activeView = view;

    if (view === 'map') {
      setTimeout(async () => {
        if (!map) {
          await initializeMap();
          return;
        }
        map.resize();
        fitMapToSketches();
      }, 0);
    }
  }

  function selectSketch(sketch, options = {}) {
    activeSketchId = sketch.id;
    activeImageIndex = 0;

    if (options.flyTo && map) {
      map.flyTo({
        center: [sketch.longitude, sketch.latitude],
        zoom: Math.max(map.getZoom(), 5.5),
        essential: true
      });
    }
  }

  function showPrevImage() {
    if (!activeSketch || activeImageIndex === 0) {
      return;
    }

    activeImageIndex -= 1;
  }

  function showNextImage() {
    if (!activeSketch || activeImageIndex >= activeSketch.images.length - 1) {
      return;
    }

    activeImageIndex += 1;
  }

  function openLightbox() {
    lightboxOpen = true;
  }

  function openSketchInLightbox(sketch) {
    selectSketch(sketch);
    openLightbox();
  }

  function closeLightbox() {
    lightboxOpen = false;
  }

  function handleLightboxKeydown(event) {
    if (!lightboxOpen) {
      return;
    }

    if (event.key === 'Escape') {
      closeLightbox();
    } else if (event.key === 'ArrowLeft') {
      showPrevImage();
    } else if (event.key === 'ArrowRight') {
      showNextImage();
    }
  }

  function createFeatureCollection(sketches) {
    return {
      type: 'FeatureCollection',
      features: sketches.map((sketch) => ({
        type: 'Feature',
        properties: {
          id: sketch.id,
          location: sketch.location,
          year: sketch.year,
          imageCount: sketch.imageCount
        },
        geometry: {
          type: 'Point',
          coordinates: [sketch.longitude, sketch.latitude]
        }
      }))
    };
  }

  function updateMapData() {
    if (!map?.getSource('sketches')) {
      return;
    }

    map.getSource('sketches').setData(createFeatureCollection(filteredSketches));
    fitMapToSketches();
  }

  function updateSelectedSketchPaint() {
    if (!map?.getLayer('sketch-points')) {
      return;
    }

    map.setPaintProperty('sketch-points', 'circle-color', [
      'match',
      ['get', 'id'],
      activeSketchId ?? '',
      resolvedMapTheme.markerActiveColor,
      resolvedMapTheme.markerColor
    ]);
  }

  function fitMapToSketches() {
    if (!map || !maplibregl || filteredSketches.length === 0) {
      return;
    }

    if (filteredSketches.length === 1) {
      const [sketch] = filteredSketches;
      map.easeTo({
        center: [sketch.longitude, sketch.latitude],
        zoom: 5.5,
        duration: 600
      });
      return;
    }

    const bounds = filteredSketches.reduce((result, sketch) => {
      result.extend([sketch.longitude, sketch.latitude]);
      return result;
    }, new maplibregl.LngLatBounds());

    map.fitBounds(bounds, {
      padding: {
        top: 56,
        right: 56,
        bottom: 56,
        left: 56
      },
      duration: 600,
      maxZoom: 5.5
    });
  }

  async function initializeMap() {
    if (!browser || !mapContainer) {
      return;
    }

    const module = await import('maplibre-gl');
    maplibregl = module.default;
    resolvedMapTheme = resolveMapTheme();

    map = new maplibregl.Map({
      container: mapContainer,
      style: getMapStyle(MAPTILER_KEY),
      center: [15, 20],
      zoom: 1.6,
      cooperativeGestures: true
    });

    map.addControl(new maplibregl.NavigationControl(), 'top-right');

    map.on('load', () => {
      map.addSource('sketches', {
        type: 'geojson',
        data: createFeatureCollection(filteredSketches),
        cluster: true,
        clusterMaxZoom: 10,
        clusterRadius: 44
      });

      map.addLayer({
        id: 'sketch-clusters',
        type: 'circle',
        source: 'sketches',
        filter: ['has', 'point_count'],
        paint: {
          'circle-color': resolvedMapTheme.clusterColor,
          'circle-radius': [
            'step',
            ['get', 'point_count'],
            17,
            8,
            20,
            20,
            25
          ],
          'circle-stroke-color': resolvedMapTheme.markerStrokeColor,
          'circle-stroke-width': 3
        }
      });

      map.addLayer({
        id: 'sketch-cluster-count',
        type: 'symbol',
        source: 'sketches',
        filter: ['has', 'point_count'],
        layout: {
          'text-field': ['get', 'point_count_abbreviated'],
          'text-font': ['Open Sans Bold'],
          'text-size': 12
        },
        paint: {
          'text-color': resolvedMapTheme.pointCountTextColor
        }
      });

      map.addLayer({
        id: 'sketch-points',
        type: 'circle',
        source: 'sketches',
        filter: ['!', ['has', 'point_count']],
        paint: {
          'circle-color': resolvedMapTheme.markerColor,
          'circle-radius': [
            'interpolate',
            ['linear'],
            ['zoom'],
            1,
            6,
            5,
            9,
            9,
            12
          ],
          'circle-stroke-width': 3,
          'circle-stroke-color': resolvedMapTheme.markerStrokeColor
        }
      });

      map.addLayer({
        id: 'sketch-point-count',
        type: 'symbol',
        source: 'sketches',
        filter: ['!', ['has', 'point_count']],
        layout: {
          'text-field': ['to-string', ['get', 'imageCount']],
          'text-size': 10
        },
        paint: {
          'text-color': resolvedMapTheme.pointCountTextColor
        }
      });

      map.on('click', 'sketch-clusters', async (event) => {
        const cluster = map.queryRenderedFeatures(event.point, {
          layers: ['sketch-clusters']
        })[0];

        const zoom = await map.getSource('sketches').getClusterExpansionZoom(cluster.properties.cluster_id);
        map.easeTo({
          center: cluster.geometry.coordinates,
          zoom
        });
      });

      map.on('click', 'sketch-points', (event) => {
        const feature = event.features?.[0];
        if (!feature) {
          return;
        }

        const sketch = filteredSketches.find((item) => item.id === feature.properties.id);
        if (sketch) {
          selectSketch(sketch);
        }
      });

      for (const layerId of ['sketch-clusters', 'sketch-points']) {
        map.on('mouseenter', layerId, () => {
          map.getCanvas().style.cursor = 'pointer';
        });

        map.on('mouseleave', layerId, () => {
          map.getCanvas().style.cursor = '';
        });
      }

      fitMapToSketches();
      updateSelectedSketchPaint();
    });
  }

  onMount(() => {
    initializeMap();
  });

  onDestroy(() => {
    map?.remove();
  });
</script>

<svelte:window onkeydown={handleLightboxKeydown} />

<svelte:head>
  <title>Sketches | {site.title}</title>
  <meta
    name="description"
    content="A map-led archive of travel sketches, rebuilt in SvelteKit and aligned with the website design system."
  />
  <meta property="og:title" content={`Sketches | ${site.title}`} />
  <meta
    property="og:description"
    content="A map-led archive of travel sketches, rebuilt in SvelteKit and aligned with the website design system."
  />
  <meta property="og:type" content="website" />
  <meta property="og:url" content={`${site.url}/sketches/`} />
  <link rel="canonical" href={`${site.url}/sketches/`} />
</svelte:head>

<section class="sketches-shell">
  <header class="sketches-hero container-editorial">
    <h1>Sketches</h1>
  </header>

  <div class="sketches-toolbar-wrap container-editorial">
    <div class="sketches-toolbar" aria-label="Sketch controls">
      <div class="sketches-toolbar-filters">
        <div class="sketches-filter">
          <span class="meta sketches-filter-label">View</span>
          <div class="sketches-filter-pills">
            <button type="button" class:is-active={activeView === 'map'} class="map-pill" onclick={() => selectView('map')}>Map</button>
            <button type="button" class:is-active={activeView === 'grid'} class="map-pill" onclick={() => selectView('grid')}>Grid</button>
          </div>
        </div>

        <div class="sketches-filter">
          <span class="meta sketches-filter-label">Year</span>
          <div class="sketches-filter-pills">
            <button
              type="button"
              class:chip-active={activeYear === 'all'}
              class="chip-button map-pill"
              onclick={() => selectYear('all')}
            >
              All
            </button>

            {#each data.years as year}
              <button
                type="button"
                class:chip-active={activeYear === year}
                class="chip-button map-pill"
                onclick={() => selectYear(year)}
              >
                {year}
              </button>
            {/each}
          </div>
        </div>

        {#if data.categories.length > 0}
          <div class="sketches-filter">
            <span class="meta sketches-filter-label">Category</span>
            <div class="sketches-filter-pills">
              <button
                type="button"
                class:chip-active={activeCategory === 'all'}
                class="chip-button map-pill"
                onclick={() => selectCategory('all')}
              >
                All
              </button>

              {#each data.categories as category}
                <button
                  type="button"
                  class:chip-active={activeCategory === category}
                  class="chip-button map-pill"
                  onclick={() => selectCategory(category)}
                >
                  {category}
                </button>
              {/each}
            </div>
          </div>
        {/if}

        {#if data.countries.length > 0}
          <div class="sketches-filter">
            <span class="meta sketches-filter-label">Country</span>
            <div class="sketches-filter-pills">
              <button
                type="button"
                class:chip-active={activeCountry === 'all'}
                class="chip-button map-pill"
                onclick={() => selectCountry('all')}
              >
                All
              </button>

              {#each data.countries as country}
                <button
                  type="button"
                  class:chip-active={activeCountry === country}
                  class="chip-button map-pill"
                  onclick={() => selectCountry(country)}
                >
                  {country}
                </button>
              {/each}
            </div>
          </div>
        {/if}
      </div>

      <p class="meta sketches-toolbar-count">
        {filteredSketches.length} {filteredSketches.length === 1 ? 'location' : 'locations'} · {filteredDrawingCount} {filteredDrawingCount === 1 ? 'drawing' : 'drawings'}
      </p>
    </div>
  </div>

  <div class="sketches-layout container-editorial">

    {#if activeView === 'map'}
      <section class="sketches-map-panel map-surface">
        <div class="sketches-map-shell">
          <div bind:this={mapContainer} class="sketches-map map-frame" aria-label="Map of sketch locations"></div>

          {#if activeSketch && activeImage}
            <article class="surface-panel sketch-detail-overlay">
              <button
                type="button"
                class="sketch-detail-image-frame"
                onclick={openLightbox}
                aria-label="Expand sketch"
              >
                <img
                  class="sketch-detail-image"
                  src={activeImage.path}
                  alt={activeImage.title}
                  loading="lazy"
                />
                <span class="sketch-detail-expand" aria-hidden="true">
                  <span class="material-symbol">open_in_full</span>
                </span>
              </button>

              <div class="sketch-detail-copy">
                <h2>{activeImage.title}</h2>

                <div class="sketch-meta-list">
                  <p class="sketch-meta-item">
                    <span class="material-symbol" aria-hidden="true">location_on</span>
                    <span>{activeSketch.location}</span>
                  </p>
                  <p class="sketch-meta-item">
                    <span class="material-symbol" aria-hidden="true">calendar_today</span>
                    <span>{activeSketch.dateLabel}</span>
                  </p>
                </div>

                {#if activeImage.description}
                  <p class="sketch-detail-description">{activeImage.description}</p>
                {/if}

                {#if activeSketch.images.length > 1}
                  <div class="sketch-detail-thumbs" aria-label="Sketch images">
                    {#each activeSketch.images as image, index}
                      <button
                        type="button"
                        class:sketch-thumb-active={activeImageIndex === index}
                        class="sketch-thumb"
                        onclick={() => (activeImageIndex = index)}
                      >
                        <img src={image.path} alt={image.title} loading="lazy" />
                      </button>
                    {/each}
                  </div>

                  <div class="sketch-detail-nav">
                    <button type="button" class="btn" onclick={showPrevImage} disabled={activeImageIndex === 0}>
                      Previous
                    </button>
                    <p class="meta">{activeImageIndex + 1} / {activeSketch.images.length}</p>
                    <button
                      type="button"
                      class="btn"
                      onclick={showNextImage}
                      disabled={activeImageIndex === activeSketch.images.length - 1}
                    >
                      Next
                    </button>
                  </div>
                {/if}
              </div>
            </article>
          {/if}
        </div>
      </section>
    {:else}
      <section class="sketch-grid" aria-label="Sketch grid">
        {#each filteredSketches as sketch}
          <button type="button" class="sketch-card" onclick={() => openSketchInLightbox(sketch)} aria-label={`Expand ${sketch.images[0].title}`}>
            <span class="sketch-card-image-frame">
              <img src={sketch.images[0].path} alt={sketch.images[0].title} class="sketch-card-image" loading="lazy" />
              <span class="sketch-card-expand" aria-hidden="true">
                <span class="material-symbol">open_in_full</span>
              </span>
            </span>
            <span class="sketch-card-body">
              <span class="sketch-card-title">{sketch.images[0].title}</span>
              <span class="meta sketch-card-date">{sketch.dateLabel ?? sketch.year}</span>
            </span>
          </button>
        {/each}
      </section>
    {/if}
  </div>
</section>

{#if lightboxOpen && activeSketch && activeImage}
  <div
    class="sketch-lightbox"
    role="dialog"
    aria-modal="true"
    aria-label={activeImage.title}
  >
    <button
      type="button"
      class="sketch-lightbox-backdrop"
      onclick={closeLightbox}
      aria-label="Close"
    ></button>

    <button
      type="button"
      class="sketch-lightbox-close"
      onclick={closeLightbox}
      aria-label="Close"
    >
      <span class="material-symbol" aria-hidden="true">close</span>
    </button>

    <div class="sketch-lightbox-content">
      <figure class="sketch-lightbox-figure">
        <img
          class="sketch-lightbox-image"
          src={activeImage.path}
          alt={activeImage.title}
        />
        <figcaption class="sketch-lightbox-caption">
          <p class="sketch-lightbox-title">{activeImage.title}</p>
          <p class="meta">{activeSketch.location} — {activeSketch.dateLabel}</p>
        </figcaption>
      </figure>

      {#if activeSketch.images.length > 1}
        <div class="sketch-lightbox-nav">
          <button type="button" class="btn" onclick={showPrevImage} disabled={activeImageIndex === 0}>
            Previous
          </button>
          <p class="meta">{activeImageIndex + 1} / {activeSketch.images.length}</p>
          <button
            type="button"
            class="btn"
            onclick={showNextImage}
            disabled={activeImageIndex === activeSketch.images.length - 1}
          >
            Next
          </button>
        </div>
      {/if}
    </div>
  </div>
{/if}

<style>
  .sketches-shell {
    padding-bottom: var(--spacing-3xl);
  }

  .sketches-hero {
    display: grid;
    gap: var(--spacing-md);
    padding-top: var(--spacing-3xl);
    padding-bottom: var(--spacing-xl);
  }

  h1 {
    max-width: 12ch;
    font-size: clamp(2.6rem, 5vw, 4.5rem);
    line-height: 0.98;
    letter-spacing: -0.05em;
    margin: 0;
  }

  .sketches-hero-lede {
    max-width: 44rem;
    color: var(--text-secondary);
    font-size: var(--text-lg);
    margin: 0;
  }

  .sketches-toolbar-wrap {
    padding-top: var(--spacing-md);
    padding-bottom: var(--spacing-md);
    border-top: 1px solid var(--border);
    border-bottom: 1px solid var(--border);
  }

  .sketches-toolbar {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: var(--spacing-lg);
  }

  .sketches-toolbar-filters {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: var(--spacing-lg);
  }

  .sketches-filter {
    display: flex;
    align-items: center;
    gap: var(--spacing-sm);
  }

  .sketches-filter-label {
    color: var(--text-muted);
  }

  .sketches-filter-pills {
    display: flex;
    flex-wrap: wrap;
    gap: var(--spacing-xs);
  }

  .sketches-toolbar-count {
    margin: 0;
    color: var(--text-muted);
  }

  .sketches-layout {
    display: grid;
    gap: var(--spacing-xl);
    padding-top: var(--spacing-xl);
  }

  .sketch-detail-image-frame {
    position: relative;
    display: block;
    width: 100%;
    padding: 0;
    overflow: hidden;
    border: 1px solid var(--border);
    background: var(--bg-secondary);
    cursor: zoom-in;
  }

  .sketch-detail-image {
    display: block;
    width: 100%;
    aspect-ratio: 4 / 3;
    max-height: 12rem;
    object-fit: cover;
    transition: transform var(--transition-fast);
  }

  .sketch-detail-image-frame:hover .sketch-detail-image {
    transform: scale(1.02);
  }

  .sketch-detail-expand {
    position: absolute;
    top: var(--spacing-sm);
    right: var(--spacing-sm);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 2rem;
    height: 2rem;
    background: var(--surface-overlay);
    border: 1px solid var(--border);
    color: var(--text-primary);
    opacity: 0;
    transition: opacity var(--transition-fast);
  }

  .sketch-detail-image-frame:hover .sketch-detail-expand,
  .sketch-detail-image-frame:focus-visible .sketch-detail-expand {
    opacity: 1;
  }

  .sketch-detail-expand .material-symbol {
    font-size: 1rem;
  }

  .sketch-detail-copy h2 {
    margin-bottom: var(--spacing-sm);
    font-size: clamp(1.7rem, 2vw, 2.1rem);
  }

  .sketch-detail-description {
    margin-bottom: 0;
    color: var(--text-secondary);
  }

  .sketch-meta-list {
    display: grid;
    gap: var(--spacing-xs);
  }

  .sketch-meta-item {
    display: flex;
    align-items: start;
    gap: var(--spacing-sm);
    margin: 0;
    color: var(--text-secondary);
  }

  .sketch-meta-item .material-symbol {
    font-size: 1rem;
    margin-top: 0.1rem;
  }

  .sketch-detail-description {
    margin-top: var(--spacing-md);
  }

  .sketch-detail-thumbs {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(4.25rem, 1fr));
    gap: var(--spacing-sm);
    margin-top: var(--spacing-lg);
  }

  .sketch-thumb {
    padding: 0;
    border: 1px solid var(--border);
    background: var(--bg-secondary);
  }

  .sketch-thumb img {
    width: 100%;
    aspect-ratio: 1;
    object-fit: cover;
    opacity: 0.72;
    transition: opacity var(--transition-fast), transform var(--transition-fast);
  }

  .sketch-thumb:hover img,
  .sketch-thumb-active img {
    opacity: 1;
    transform: scale(1.02);
  }

  .sketch-thumb-active {
    border-color: var(--accent);
  }

  .sketch-detail-nav {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--spacing-sm);
    margin-top: var(--spacing-lg);
  }

  .sketches-map-panel {
    padding: 0;
  }

  .sketches-map-shell {
    position: relative;
  }

  .sketches-map {
    min-height: 70vh;
  }

  .sketch-detail-overlay {
    position: absolute;
    left: var(--spacing-lg);
    bottom: var(--spacing-lg);
    width: min(26rem, calc(100% - (var(--spacing-lg) * 2)));
    max-height: calc(100% - (var(--spacing-lg) * 2));
    display: grid;
    gap: var(--spacing-md);
    padding: var(--spacing-md);
    background: var(--surface-overlay);
    backdrop-filter: blur(10px);
    overflow-y: auto;
    overscroll-behavior: contain;
  }

  .sketch-grid {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: var(--spacing-xl) var(--spacing-lg);
  }

  .sketch-card {
    display: grid;
    gap: var(--spacing-md);
    padding: 0;
    text-align: left;
    color: inherit;
    background: transparent;
    border: 0;
    cursor: zoom-in;
  }

  .sketch-card-image-frame {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    aspect-ratio: 3 / 4;
    padding: var(--spacing-md);
    overflow: hidden;
    background: var(--surface-elevated);
  }

  .sketch-card-image {
    display: block;
    max-width: 100%;
    max-height: 100%;
    width: auto;
    height: auto;
    object-fit: contain;
    transition: transform var(--transition-slow, 320ms ease);
  }

  .sketch-card:hover .sketch-card-image {
    transform: scale(1.03);
  }

  .sketch-card-expand {
    position: absolute;
    top: var(--spacing-sm);
    right: var(--spacing-sm);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 2rem;
    height: 2rem;
    background: var(--surface-overlay);
    border: 1px solid var(--border);
    color: var(--text-primary);
    opacity: 0;
    transition: opacity var(--transition-fast);
  }

  .sketch-card:hover .sketch-card-expand,
  .sketch-card:focus-visible .sketch-card-expand {
    opacity: 1;
  }

  .sketch-card-expand .material-symbol {
    font-size: 1rem;
  }

  .sketch-card-body {
    display: grid;
    gap: calc(var(--spacing-xs) / 2);
    padding: 0;
  }

  .sketch-card-title {
    font-family: var(--font-serif);
    font-size: var(--text-lg);
    line-height: 1.2;
    color: var(--text-primary);
  }

  .sketch-card-date {
    color: var(--text-muted);
  }

  .sketch-lightbox {
    position: fixed;
    inset: 0;
    z-index: 100;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: var(--spacing-xl);
  }

  .sketch-lightbox-backdrop {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    padding: 0;
    border: 0;
    background: rgba(15, 14, 12, 0.88);
    backdrop-filter: blur(6px);
    cursor: zoom-out;
  }

  .sketch-lightbox-content {
    position: relative;
    display: grid;
    gap: var(--spacing-md);
    max-width: min(90vw, 1100px);
    max-height: 100%;
  }

  .sketch-lightbox-close {
    position: absolute;
    top: var(--spacing-lg);
    right: var(--spacing-lg);
    width: 2.5rem;
    height: 2.5rem;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border: 1px solid rgba(255, 255, 255, 0.3);
    background: transparent;
    color: #fff;
  }

  .sketch-lightbox-close:hover {
    border-color: #fff;
  }

  .sketch-lightbox-close .material-symbol {
    font-size: 1.25rem;
  }

  .sketch-lightbox-figure {
    display: grid;
    gap: var(--spacing-md);
    margin: 0;
  }

  .sketch-lightbox-image {
    display: block;
    max-width: 100%;
    max-height: 75vh;
    object-fit: contain;
    margin: 0 auto;
    background: #111;
  }

  .sketch-lightbox-caption {
    color: #f4f1ea;
    text-align: center;
    display: grid;
    gap: var(--spacing-xs);
  }

  .sketch-lightbox-caption .meta {
    color: rgba(244, 241, 234, 0.7);
  }

  .sketch-lightbox-title {
    font-family: var(--font-serif);
    font-size: clamp(1.3rem, 2vw, 1.75rem);
    margin: 0;
  }

  .sketch-lightbox-nav {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: var(--spacing-lg);
    color: #f4f1ea;
  }

  .sketch-lightbox-nav .meta {
    color: rgba(244, 241, 234, 0.7);
  }

  @media (max-width: 1200px) {
    .sketch-grid {
      grid-template-columns: repeat(3, minmax(0, 1fr));
    }
  }

  @media (max-width: 900px) {
    .sketch-grid {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }

    .sketches-map {
      min-height: 60vh;
    }
  }

  @media (max-width: 760px) {
    h1 {
      max-width: 11ch;
    }

    .sketches-toolbar,
    .sketch-detail-nav {
      flex-direction: column;
      align-items: start;
    }

    .sketch-grid {
      grid-template-columns: 1fr;
    }

    .sketch-detail-overlay {
      position: static;
      width: 100%;
      margin-top: var(--spacing-md);
      backdrop-filter: none;
    }

    .sketches-map {
      min-height: 52vh;
    }
  }
</style>
