function formatDate(date, options) {
	return new Intl.DateTimeFormat('en-US', {
		timeZone: 'UTC',
		...options
	}).format(date);
}

export function formatFieldNoteDate(date) {
	return formatDate(date, {
		month: 'long',
		day: 'numeric',
		year: 'numeric'
	});
}

export function formatFieldNoteArchiveDate(date) {
	return formatDate(date, {
		month: 'short',
		year: 'numeric'
	});
}
