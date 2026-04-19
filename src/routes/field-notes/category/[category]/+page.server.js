import { error } from '@sveltejs/kit';
import { getFieldNoteCategoryEntries, getFieldNotesCategoryPage } from '$lib/field-notes';

export function entries() {
	return getFieldNoteCategoryEntries();
}

export function load({ params }) {
	const page = getFieldNotesCategoryPage(params.category);

	if (!page) {
		throw error(404, 'Category not found');
	}

	return { page };
}

