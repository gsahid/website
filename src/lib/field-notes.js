import matter from 'gray-matter';
import { marked } from 'marked';

const NOTE_FILES = import.meta.glob('/src/field-notes/*.md', {
	eager: true,
	query: '?raw',
	import: 'default'
});

const NOTES_PER_PAGE = 12;
const CATEGORY_ORDER = [
	'Borneo',
	'Tour du Mont Blanc',
	'Malerweg',
	'Alta Via 1',
	"Fisherman's Trail",
	'Camino Portuguese',
	'Thailand',
	'Laos'
];
const CATEGORY_SLUGS = new Map([
	['Borneo', 'borneo'],
	['Tour du Mont Blanc', 'tour-du-mont-blanc'],
	['Malerweg', 'malerweg'],
	['Alta Via 1', 'alta-via-1'],
	["Fisherman's Trail", 'fishermans-trail'],
	['Camino Portuguese', 'camino-portuguese'],
	['Thailand', 'thailand'],
	['Laos', 'laos']
]);
const CATEGORY_BY_SLUG = new Map(
	Array.from(CATEGORY_SLUGS.entries(), ([label, slug]) => [slug, label])
);

const imageShortcodePattern = /\{%\s*image\s+"([^"]+)"\s*,\s*"([^"]*)"\s*%\}/g;

const renderer = new marked.Renderer();

renderer.image = ({ href, title, text }) => {
	const alt = text || '';
	const titleAttribute = title ? ` title="${escapeHtml(title)}"` : '';
	const caption = alt ? `<figcaption>${escapeHtml(alt)}</figcaption>` : '';

	return [
		'<figure class="field-note-figure">',
		`<img src="${escapeHtml(href)}" alt="${escapeHtml(alt)}" loading="lazy"${titleAttribute}>`,
		caption,
		'</figure>'
	].join('');
};

marked.setOptions({
	gfm: true,
	breaks: false,
	renderer
});

function escapeHtml(value) {
	return value
		.replaceAll('&', '&amp;')
		.replaceAll('<', '&lt;')
		.replaceAll('>', '&gt;')
		.replaceAll('"', '&quot;');
}

function slugFromPath(path) {
	return path.split('/').pop().replace(/\.md$/, '');
}

function toDate(dateString) {
	if (dateString instanceof Date) {
		return dateString;
	}

	return new Date(`${dateString}T00:00:00.000Z`);
}

function toDateIso(dateValue, date) {
	if (typeof dateValue === 'string') {
		return dateValue;
	}

	return date.toISOString().slice(0, 10);
}

function getCategorySlug(category) {
	return CATEGORY_SLUGS.get(category) ?? null;
}

function getCategoryLabel(categorySlug) {
	return CATEGORY_BY_SLUG.get(categorySlug) ?? null;
}

function getCategoryLinks(activeCategory = null) {
	return CATEGORY_ORDER.map((category) => ({
		label: category,
		slug: getCategorySlug(category),
		href: `/field-notes/category/${getCategorySlug(category)}/`,
		isActive: category === activeCategory
	}));
}

function getYearLinks(activeYear = null) {
	const years = [...new Set(notesDescending.map((note) => note.year))].sort((left, right) => right - left);

	return years.map((year) => ({
		label: String(year),
		year,
		href: `/field-notes/year/${year}/`,
		isActive: year === activeYear
	}));
}

function replaceImageShortcodes(content) {
	return content.replaceAll(imageShortcodePattern, (_, url, alt) => {
		const escapedUrl = escapeHtml(url);
		const escapedAlt = escapeHtml(alt);
		const caption = alt ? `<figcaption>${escapedAlt}</figcaption>` : '';

		return `\n<figure class="field-note-figure"><img src="${escapedUrl}" alt="${escapedAlt}" loading="lazy">${caption}</figure>\n`;
	});
}

function stripHtml(html) {
	return html
		.replaceAll(/<style[\s\S]*?<\/style>/gi, ' ')
		.replaceAll(/<[^>]+>/g, ' ')
		.replaceAll(/\s+/g, ' ')
		.trim();
}

function getExcerpt(content) {
	const paragraphs = content.split(/\n\s*\n/).map((block) => block.trim()).filter(Boolean);
	const firstParagraph = paragraphs.find((block) => !block.startsWith('![')) || '';
	return firstParagraph.slice(0, 220).trim();
}

function renderMarkdown(content) {
	return marked.parse(replaceImageShortcodes(content));
}

function buildNote([path, rawSource]) {
	const slug = slugFromPath(path);
	const { data, content } = matter(rawSource);
	const date = toDate(data.date);
	const dateIso = toDateIso(data.date, date);
	const year = date.getUTCFullYear();
	const category = data.category;
	const html = renderMarkdown(content);
	const excerpt = getExcerpt(stripHtml(html));

	if (!category || !CATEGORY_SLUGS.has(category)) {
		throw new Error(`Field note "${slug}" is missing a valid category frontmatter value.`);
	}

	return {
		slug,
		title: data.title,
		subtitle: data.subtitle || '',
		date,
		dateIso,
		year,
		category,
		categorySlug: getCategorySlug(category),
		featuredImage: data.featuredImage || '',
		html,
		excerpt,
		description: data.subtitle || excerpt,
		url: `/field-notes/${slug}/`
	};
}

const notesAscending = Object.entries(NOTE_FILES)
	.map(buildNote)
	.sort((left, right) => left.date.getTime() - right.date.getTime());

const notesDescending = [...notesAscending].reverse();

const notesBySlug = new Map(notesDescending.map((note) => [note.slug, note]));

function withNavigation(note) {
	const index = notesAscending.findIndex((entry) => entry.slug === note.slug);
	return {
		...note,
		prevNote: index > 0 ? notesAscending[index - 1] : null,
		nextNote: index < notesAscending.length - 1 ? notesAscending[index + 1] : null
	};
}

export function getAllFieldNotes() {
	return notesDescending;
}

export function getFieldNoteEntries() {
	return notesDescending.map((note) => ({ slug: note.slug }));
}

export function getFieldNotesPageEntries() {
	return Array.from({ length: getFieldNotesPageCount() - 1 }, (_, index) => ({
		page: String(index + 2)
	}));
}

export function getFieldNoteCategoryEntries() {
	return CATEGORY_ORDER.map((category) => ({
		category: getCategorySlug(category)
	}));
}

export function getFieldNotesPageCount() {
	return Math.ceil(notesDescending.length / NOTES_PER_PAGE);
}

function buildPageMeta(notes, activeCategory = null) {
	return {
		notes,
		categories: getCategoryLinks(activeCategory),
		years: getYearLinks(),
		activeCategory,
		activeYear: null
	};
}

export function getFieldNotesPage(pageNumber) {
	const totalPages = getFieldNotesPageCount();

	if (!Number.isInteger(pageNumber) || pageNumber < 1 || pageNumber > totalPages) {
		return null;
	}

	const start = (pageNumber - 1) * NOTES_PER_PAGE;
	const notes = notesDescending.slice(start, start + NOTES_PER_PAGE);

	return {
		pageNumber,
		totalPages,
		...buildPageMeta(notes),
		prevPageHref: pageNumber > 1 ? (pageNumber === 2 ? '/field-notes/' : `/field-notes/page-${pageNumber - 1}/`) : null,
		nextPageHref: pageNumber < totalPages ? `/field-notes/page-${pageNumber + 1}/` : null
	};
}

export function getFieldNotesCategoryPage(categorySlug) {
	const activeCategory = getCategoryLabel(categorySlug);

	if (!activeCategory) {
		return null;
	}

	const notes = notesDescending.filter((note) => note.category === activeCategory);

	return {
		pageNumber: 1,
		totalPages: 1,
		...buildPageMeta(notes, activeCategory),
		prevPageHref: null,
		nextPageHref: null
	};
}

export function getFieldNoteYearEntries() {
	return getYearLinks().map(({ label }) => ({
		year: label
	}));
}

export function getFieldNotesYearPage(yearValue) {
	const activeYear = Number(yearValue);

	if (!Number.isInteger(activeYear)) {
		return null;
	}

	const notes = notesDescending.filter((note) => note.year === activeYear);

	if (!notes.length) {
		return null;
	}

	return {
		pageNumber: 1,
		totalPages: 1,
		notes,
		categories: getCategoryLinks(),
		years: getYearLinks(activeYear),
		activeCategory: null,
		activeYear,
		prevPageHref: null,
		nextPageHref: null
	};
}

export function getFieldNote(slug) {
	const note = notesBySlug.get(slug);
	return note ? withNavigation(note) : null;
}

export function getFieldNotesFeedUpdatedAt() {
	return notesDescending[0]?.date ?? null;
}
