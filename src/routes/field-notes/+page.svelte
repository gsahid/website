<script>
  import FieldNotesArchive from '$lib/components/FieldNotesArchive.svelte';
  import { site } from '$lib/site';

  let { data } = $props();

  const description = 'Travel journals and hiking adventures.';
</script>

<svelte:head>
  <title>Field Notes | {site.title}</title>
  <meta name="description" content={description} />
  <meta property="og:title" content={`Field Notes | ${site.title}`} />
  <meta property="og:description" content={description} />
  <meta property="og:type" content="website" />
  <meta property="og:url" content={`${site.url}/field-notes/`} />
  <link rel="canonical" href={`${site.url}/field-notes/`} />
</svelte:head>

<FieldNotesArchive page={data.page} />

