<script>
  import FieldNotesArchive from '$lib/components/FieldNotesArchive.svelte';
  import { site } from '$lib/site';

  let { data } = $props();

  const title = $derived(`Field Notes, Page ${data.page.pageNumber} | ${site.title}`);
  const description = $derived(`Page ${data.page.pageNumber} of the field notes archive.`);
</script>

<svelte:head>
  <title>{title}</title>
  <meta name="description" content={description} />
  <meta property="og:title" content={title} />
  <meta property="og:description" content={description} />
  <meta property="og:type" content="website" />
  <meta property="og:url" content={`${site.url}/field-notes/page-${data.page.pageNumber}/`} />
  <link rel="canonical" href={`${site.url}/field-notes/page-${data.page.pageNumber}/`} />
</svelte:head>

<FieldNotesArchive page={data.page} />
