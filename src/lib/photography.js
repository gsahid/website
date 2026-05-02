const PHOTO_DIR =
  'https://pub-b61096e0d85d4ca4b13ec99471178910.r2.dev/photography';

export const featuredPhotos = [
  'DSCF0102.jpg',
  'DSCF0750.jpg',
  'DSCF2590.jpg',
  'DSCF3668.jpg',
  'DSCF3856.jpg',
  'DSCF4307.jpg',
  'DSCF5628.jpg',
  'DSCF6151.jpg',
  'DSCF6673.jpg',
  'DSCF7261.jpg',
  'DSCF7575.jpg',
  'DSCF8298.jpg',
  'DSCF9051.jpg',
  'DSCF9573.jpg'
].map((filename) => ({ src: `${PHOTO_DIR}/homepage/${filename}`, caption: '' }));

export const projects = [
  {
    slug: 'karachi',
    title: 'Karachi',
    year: '2024',
    description:
      '',
    cover: `${PHOTO_DIR}/karachi/DSCF0350.jpg`,
    photos: [
      'DSCF0350.jpg', 'DSCF0449.jpg', 'DSCF0811.jpg', 'DSCF0967.jpg', 'DSCF1145.jpg',
      'DSCF1361.jpg', 'DSCF1470.jpg', 'DSCF1496.jpg', 'DSCF1659.jpg', 'DSCF1771.jpg',
      'DSCF1802.jpg', 'DSCF2127.jpg', 'DSCF2317.jpg', 'DSCF2550.jpg', 'DSCF2590.jpg',
      'DSCF3019.jpg', 'DSCF3140.jpg', 'DSCF3498.jpg', 'DSCF3647.jpg', 'DSCF3668.jpg',
      'DSCF3807.jpg', 'DSCF4307.jpg', 'DSCF4532.jpg', 'DSCF4669.jpg', 'DSCF4704.jpg',
      'DSCF4926.jpg', 'DSCF5089.jpg', 'DSCF5301.jpg', 'DSCF5317.jpg', 'DSCF5455.jpg',
      'DSCF5628.jpg', 'DSCF5711.jpg', 'DSCF5764.jpg', 'DSCF5774.jpg', 'DSCF5811.jpg',
      'DSCF5900.jpg', 'DSCF6497.jpg', 'DSCF6550.jpg', 'DSCF6656.jpg', 'DSCF6731.jpg',
      'DSCF7224.jpg', 'DSCF8399.jpg', 'DSCF8579.jpg', 'DSCF8608.jpg', 'DSCF8729.jpg',
      'DSCF8817.jpg', 'DSCF9220.jpg', 'DSCF9224.jpg', 'DSCF9271.jpg', 'DSCF9308.jpg',
      'DSCF9494.jpg', 'DSCF9529.jpg', 'DSCF9565.jpg', 'DSCF9759.jpg'
    ].map((filename) => ({ src: `${PHOTO_DIR}/karachi/${filename}`, caption: '' }))
  },
  {
    slug: 'indonesia',
    title: 'Indonesia',
    year: '2022-2026',
    description:
      '',
    cover: `${PHOTO_DIR}/indonesia/DSCF0827.jpg`,
    photos: [
      'DSCF0827.jpg', 'DSCF1074.jpg', 'DSCF1151.jpg', 'DSCF1326.jpg', 'DSCF6751.jpg',
      'DSCF7070.jpg', 'DSCF7084.jpg', 'DSCF7100.jpg', 'DSCF7216.jpg', 'DSCF7246.jpg',
      'DSCF7261.jpg', 'DSCF7350.jpg', 'DSCF7370.jpg', 'DSCF7455.jpg', 'DSCF7501.jpg',
      'DSCF7545.jpg', 'DSCF7575.jpg', 'DSCF7660-2.jpg', 'DSCF7660.jpg', 'DSCF7677.jpg',
      'DSCF7798.jpg', 'DSCF7976.jpg', 'DSCF7986.jpg', 'DSCF8005.jpg', 'DSCF8079.jpg',
      'DSCF8197.jpg', 'DSCF8292.jpg', 'DSCF8298.jpg', 'DSCF8300.jpg', 'DSCF8315.jpg',
      'DSCF8629.jpg', 'DSCF8681.jpg'
    ].map((filename) => ({ src: `${PHOTO_DIR}/indonesia/${filename}`, caption: '' }))
  },
  {
    slug: 'berlin',
    title: 'Berlin',
    year: '2024-2026',
    description:
      '',
    cover: `${PHOTO_DIR}/berlin/DSCF0102.jpg`,
    photos: [
      'DSCF0102.jpg', 'DSCF0502.jpg', 'DSCF0551.jpg', 'DSCF0774.jpg', 'DSCF1325.jpg',
      'DSCF1349.jpg', 'DSCF1391.jpg', 'DSCF1469.jpg', 'DSCF1491.jpg', 'DSCF1919.jpg',
      'DSCF1983.jpg', 'DSCF2033.jpg', 'DSCF2077.jpg', 'DSCF2105.jpg', 'DSCF2305.jpg',
      'DSCF2350.jpg', 'DSCF2359.jpg', 'DSCF2409.jpg', 'DSCF3000.jpg', 'DSCF3617.jpg',
      'DSCF3650.jpg', 'DSCF3651.jpg', 'DSCF3689.jpg', 'DSCF3751.jpg', 'DSCF3823.jpg',
      'DSCF3853.jpg', 'DSCF3856.jpg', 'DSCF5311.jpg', 'DSCF5582.jpg', 'DSCF5639.jpg',
      'DSCF5643.jpg', 'DSCF5683.jpg', 'DSCF5815.jpg', 'DSCF5915.jpg', 'DSCF5999.jpg',
      'DSCF6127.jpg', 'DSCF6164.jpg', 'DSCF6233.jpg', 'DSCF6486.jpg', 'DSCF7373.jpg',
      'DSCF7751.jpg', 'DSCF7754.jpg', 'DSCF8468.jpg', 'DSCF8769.jpg', 'DSCF9043.jpg',
      'DSCF9051.jpg', 'DSCF9149.jpg', 'DSCF9579.jpg', 'DSCF9612.jpg'
    ].map((filename) => ({ src: `${PHOTO_DIR}/berlin/${filename}`, caption: '' }))
  },
  {
    slug: 'europe',
    title: 'Europe',
    year: '2022-2026',
    description:
      'Photographs from across European cities.',
    cover: `${PHOTO_DIR}/europe/DSCF0338.jpg`,
    photos: [
      'DSCF0338.jpg', 'DSCF0470.jpg', 'DSCF0694.jpg', 'DSCF0704.jpg', 'DSCF2577.jpg',
      'DSCF3178.jpg', 'DSCF4420.jpg', 'DSCF4718.jpg', 'DSCF5693.jpg', 'DSCF5824.jpg',
      'DSCF5872.jpg', 'DSCF5883.jpg', 'DSCF5916.jpg', 'DSCF5944.jpg', 'DSCF6022.jpg',
      'DSCF6035.jpg', 'DSCF9450.jpg', 'DSCF9530.jpg', 'DSCF9545.jpg', 'DSCF9552.jpg',
      'DSCF9554.jpg', 'DSCF9558.jpg', 'DSCF9573.jpg', 'DSCF9699.jpg', 'DSCF9772.jpg',
      'DSCF9788.jpg'
    ].map((filename) => ({ src: `${PHOTO_DIR}/europe/${filename}`, caption: '' }))
  }
];

export function getProject(slug) {
  return projects.find((p) => p.slug === slug);
}

export function listProjectSlugs() {
  return projects.map((p) => ({ slug: p.slug }));
}
