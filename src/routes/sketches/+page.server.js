import { getSketchesPageData } from '$lib/sketches.server';

export function load() {
  return getSketchesPageData();
}
