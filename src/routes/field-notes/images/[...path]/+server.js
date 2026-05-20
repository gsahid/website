import { error } from '@sveltejs/kit';
import { readFile } from 'fs/promises';
import { join } from 'path';

const MIME_TYPES = {
	'.jpg': 'image/jpeg',
	'.jpeg': 'image/jpeg',
	'.png': 'image/png',
	'.gif': 'image/gif',
	'.webp': 'image/webp',
	'.avif': 'image/avif'
};

export async function GET({ params }) {
	const imagePath = params.path;
	const ext = imagePath.substring(imagePath.lastIndexOf('.')).toLowerCase();
	const mimeType = MIME_TYPES[ext];

	if (!mimeType) {
		throw error(400, 'Invalid image type');
	}

	try {
		const fullPath = join(process.cwd(), 'src', 'field-notes', 'images', imagePath);
		const imageBuffer = await readFile(fullPath);

		return new Response(imageBuffer, {
			headers: {
				'Content-Type': mimeType,
				'Cache-Control': 'public, max-age=31536000'
			}
		});
	} catch (e) {
		throw error(404, 'Image not found');
	}
}
