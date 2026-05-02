import { error } from '@sveltejs/kit';
import { getProject, listProjectSlugs } from '$lib/photography';

export const prerender = true;

export function entries() {
  return listProjectSlugs();
}

export function load({ params }) {
  const project = getProject(params.slug);
  if (!project) {
    throw error(404, 'Project not found');
  }
  return { project };
}
