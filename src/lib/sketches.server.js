import { existsSync, statSync } from 'node:fs';
import path from 'node:path';
import sketchesSource from '../_data/sketches.json';

const publicDir = path.resolve(process.cwd(), 'public');

function imageIsAvailable(imagePath) {
  const publicPath = path.join(publicDir, imagePath.replace(/^\//, ''));

  if (!existsSync(publicPath)) {
    return false;
  }

  return statSync(publicPath).size > 0;
}

function normalizeSketch(sketch) {
  const date = new Date(sketch.date);
  const year = String(date.getUTCFullYear());
  const images = sketch.images
    .filter((image) => imageIsAvailable(image.path))
    .map((image) => ({
      ...image
    }));

  return {
    ...sketch,
    images,
    year,
    imageCount: images.length,
    dateLabel: date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      timeZone: 'UTC'
    })
  };
}

export const sketches = sketchesSource.sketches
  .map(normalizeSketch)
  .filter((sketch) => sketch.imageCount > 0)
  .sort((left, right) => new Date(right.date).getTime() - new Date(left.date).getTime());

export const sketchYears = [...new Set(sketches.map((sketch) => sketch.year))].sort((left, right) => Number(right) - Number(left));

export const sketchCategories = [...new Set(sketches.map((sketch) => sketch.category).filter(Boolean))].sort((left, right) => left.localeCompare(right));

export const sketchCountries = [...new Set(sketches.map((sketch) => sketch.country).filter(Boolean))].sort((left, right) => left.localeCompare(right));

export function getSketchesPageData() {
  return {
    sketches,
    years: sketchYears,
    categories: sketchCategories,
    countries: sketchCountries,
    stats: {
      sketchCount: sketches.length,
      drawingCount: sketches.reduce((sum, sketch) => sum + sketch.imageCount, 0),
      countryCount: new Set(sketches.map((sketch) => sketch.location.split(', ').at(-1))).size
    }
  };
}
