<script>
  import FieldNotesArchive from '$lib/components/FieldNotesArchive.svelte';
  import { site } from '$lib/site';

  let { data } = $props();

  const title = $derived(`${data.page.activeYear} | Field Notes | ${site.title}`);
  const description = $derived(`Field notes from ${data.page.activeYear}.`);
  const canonical = $derived(`${site.url}/field-notes/year/${data.page.activeYear}/`);
</script>

<svelte:head>
  <title>{title}</title>
  <meta name="description" content={description} />
  <meta property="og:title" content={title} />
  <meta property="og:description" content={description} />
  <meta property="og:type" content="website" />
  <meta property="og:url" content={canonical} />
  <link rel="canonical" href={canonical} />
</svelte:head>

<FieldNotesArchive page={data.page} />
