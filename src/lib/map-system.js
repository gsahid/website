export const MAP_TILER_STYLE = 'streets-v2';

export const fallbackMapTheme = {
  markerColor: '#d45c45',
  markerActiveColor: '#1f4d2f',
  clusterColor: '#245236',
  markerStrokeColor: '#fcfbf5',
  pointCountTextColor: '#fcfbf5'
};

export function resolveMapTheme() {
  if (typeof document === 'undefined') {
    return fallbackMapTheme;
  }

  const styles = getComputedStyle(document.documentElement);
  const read = (name, fallback) => styles.getPropertyValue(name).trim() || fallback;

  return {
    markerColor: read('--map-marker', fallbackMapTheme.markerColor),
    markerActiveColor: read('--map-marker-active', fallbackMapTheme.markerActiveColor),
    clusterColor: read('--map-cluster', fallbackMapTheme.clusterColor),
    markerStrokeColor: read('--map-marker-stroke', fallbackMapTheme.markerStrokeColor),
    pointCountTextColor: read('--map-marker-text', fallbackMapTheme.pointCountTextColor)
  };
}

export function getMapStyle(maptilerKey) {
  if (maptilerKey) {
    return `https://api.maptiler.com/maps/${MAP_TILER_STYLE}/style.json?key=${maptilerKey}`;
  }

  console.warn('VITE_MAPTILER_KEY not set in website — falling back to OpenStreetMap raster tiles');

  return {
    version: 8,
    sources: {
      osm: {
        type: 'raster',
        tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
        tileSize: 256,
        attribution: '© OpenStreetMap contributors'
      }
    },
    layers: [{ id: 'osm', type: 'raster', source: 'osm' }]
  };
}
