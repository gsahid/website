<script>
  import FieldNoteArticle from '$lib/components/FieldNoteArticle.svelte';
  import { site } from '$lib/site';

  let { data } = $props();

  const title = $derived(`${data.note.title} | Field Notes | ${site.title}`);
  const description = $derived(data.note.description);
  const url = $derived(`${site.url}${data.note.url}`);
</script>

<svelte:head>
  <title>{title}</title>
  <meta name="description" content={description} />
  <meta property="og:title" content={title} />
  <meta property="og:description" content={description} />
  <meta property="og:type" content="article" />
  <meta property="og:url" content={url} />
  {#if data.note.featuredImage}
    <meta property="og:image" content={data.note.featuredImage} />
  {/if}
  <meta property="article:published_time" content={`${data.note.dateIso}T00:00:00.000Z`} />
  <link rel="canonical" href={url} />
</svelte:head>

<FieldNoteArticle note={data.note} />
