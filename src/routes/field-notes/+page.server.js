import { getFieldNotesPage } from '$lib/field-notes';

export function load() {
	return {
		page: getFieldNotesPage(1)
	};
}

