import { error } from '@sveltejs/kit';
import { getFieldNoteYearEntries, getFieldNotesYearPage } from '$lib/field-notes';

export function entries() {
	return getFieldNoteYearEntries();
}

export function load({ params }) {
	const page = getFieldNotesYearPage(params.year);

	if (!page) {
		throw error(404, 'Year not found');
	}

	return { page };
}

