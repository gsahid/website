import { error } from '@sveltejs/kit';
import { getFieldNote, getFieldNoteEntries } from '$lib/field-notes';

export function entries() {
	return getFieldNoteEntries();
}

export function load({ params }) {
	const note = getFieldNote(params.slug);

	if (!note) {
		throw error(404, 'Field note not found');
	}

	return { note };
}
