import { error } from '@sveltejs/kit';
import { getFieldNotesPage, getFieldNotesPageEntries } from '$lib/field-notes';

export function entries() {
	return getFieldNotesPageEntries();
}

export function load({ params }) {
	const pageNumber = Number(params.page);

	if (pageNumber <= 1) {
		throw error(404, 'Page not found');
	}

	const page = getFieldNotesPage(pageNumber);

	if (!page) {
		throw error(404, 'Page not found');
	}

	return { page };
}
