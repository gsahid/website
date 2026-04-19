import { getAllFieldNotes, getFieldNotesFeedUpdatedAt } from '$lib/field-notes';
import { site } from '$lib/site';

export const prerender = true;

function toRfc3339(date) {
	return date.toISOString();
}

function xmlEscape(value) {
	return value
		.replaceAll('&', '&amp;')
		.replaceAll('<', '&lt;')
		.replaceAll('>', '&gt;')
		.replaceAll('"', '&quot;')
		.replaceAll("'", '&apos;');
}

export function GET() {
	const notes = getAllFieldNotes();
	const updatedAt = getFieldNotesFeedUpdatedAt();

	const entries = notes.map((note) => {
		const url = `${site.url}${note.url}`;
		const content = note.html.replaceAll(']]>', ']]]]><![CDATA[>');

		return `
  <entry>
    <title>${xmlEscape(note.title)}</title>
    <link href="${url}"/>
    <updated>${toRfc3339(note.date)}</updated>
    <id>${url}</id>
    <content type="html"><![CDATA[${content}]]></content>
  </entry>`;
	}).join('');

	const body = `<?xml version="1.0" encoding="utf-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <title>Field Notes - ${xmlEscape(site.title)}</title>
  <subtitle>Travel journals and hiking adventures</subtitle>
  <link href="${site.url}/field-notes/feed.xml" rel="self"/>
  <link href="${site.url}/field-notes/"/>
  <updated>${updatedAt ? toRfc3339(updatedAt) : ''}</updated>
  <id>${site.url}/field-notes/</id>
  <author>
    <name>${xmlEscape(site.title)}</name>
  </author>${entries}
</feed>`;

	return new Response(body, {
		headers: {
			'content-type': 'application/atom+xml; charset=utf-8'
		}
	});
}
