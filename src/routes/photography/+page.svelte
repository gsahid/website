<script>
  import PhotoSlideshow from '$lib/components/PhotoSlideshow.svelte';
  import { featuredPhotos } from '$lib/photography';
  import { site } from '$lib/site';
</script>

<svelte:head>
  <title>Photography | {site.title}</title>
  <meta name="description" content="Selected street photography by Galuh Sahid." />
</svelte:head>

<PhotoSlideshow photos={featuredPhotos} />
