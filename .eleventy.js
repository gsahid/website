import markdownIt from 'markdown-it'
import markdownItAnchor from 'markdown-it-anchor'

import EleventyPluginNavigation from '@11ty/eleventy-navigation';
import EleventyPluginRss from '@11ty/eleventy-plugin-rss'
import EleventyPluginSyntaxhighlight from '@11ty/eleventy-plugin-syntaxhighlight'
import EleventyVitePlugin from '@11ty/eleventy-plugin-vite'

import rollupPluginCritical from 'rollup-plugin-critical'


import filters from './utils/filters.js'
import transforms from './utils/transforms.js'
import shortcodes from './utils/shortcodes.js'

export default function (eleventyConfig) {
	eleventyConfig.setServerPassthroughCopyBehavior('copy');
	eleventyConfig.addPassthroughCopy("public");

	// Plugins
	eleventyConfig.addPlugin(EleventyPluginNavigation)
	eleventyConfig.addPlugin(EleventyPluginRss)
	eleventyConfig.addPlugin(EleventyPluginSyntaxhighlight)
	eleventyConfig.addPlugin(EleventyVitePlugin, {
		tempFolderName: '.11ty-vite', // Default name of the temp folder

		// Vite options (equal to vite.config.js inside project root)
		viteOptions: {
			publicDir: 'public',
			clearScreen: false,
			server: {
				mode: 'development',
				middlewareMode: true,
			},
			appType: 'custom',
			assetsInclude: ['**/*.xml', '**/*.txt'],
			build: {
				mode: 'production',
				sourcemap: 'true',
				manifest: true,
				// This puts CSS and JS in subfolders – remove if you want all of it to be in /assets instead
				rollupOptions: {
					output: {
						assetFileNames: 'assets/css/main.[hash].css',
						chunkFileNames: 'assets/js/[name].[hash].js',
						entryFileNames: 'assets/js/[name].[hash].js'
					},
					plugins: [rollupPluginCritical({
							criticalUrl: './_site/',
							criticalBase: './_site/',
							criticalPages: [
								{ uri: 'index.html', template: 'index' },
								{ uri: 'posts/index.html', template: 'posts/index' },
								{ uri: '404.html', template: '404' },
							],
							criticalConfig: {
								inline: true,
								dimensions: [
									{
									  height: 900,
									  width: 375,
									},
									{
									  height: 720,
									  width: 1280,
									},
									{
										height: 1080,
										width: 1920,
									}
								],
								penthouse: {
									forceInclude: ['.fonts-loaded-1 body', '.fonts-loaded-2 body'],
								  }
							}
						})
					]
				}
			}
		}
	})

	// Filters
	Object.keys(filters).forEach((filterName) => {
		eleventyConfig.addFilter(filterName, filters[filterName])
	})

	// Transforms
	Object.keys(transforms).forEach((transformName) => {
		eleventyConfig.addTransform(transformName, transforms[transformName])
	})

	// Shortcodes
	Object.keys(shortcodes).forEach((shortcodeName) => {
		eleventyConfig.addShortcode(shortcodeName, shortcodes[shortcodeName])
	})

	eleventyConfig.addShortcode('year', () => `${new Date().getFullYear()}`)

	// Async featured image shortcode for list page thumbnails
	eleventyConfig.addAsyncShortcode('featuredImage', async function(src, alt) {
		if (!src) return '';

		// Check if it's a remote URL (R2 or other CDN)
		if (src.startsWith('http://') || src.startsWith('https://')) {
			// For remote URLs, just output a simple img tag
			return `<img src="${src}" alt="${alt}" loading="lazy" decoding="async">`
		}

		// Remove leading slash if present
		let cleanSrc = src.startsWith('/') ? src.substring(1) : src;
		let file = path.join('src', cleanSrc);

		let metadata = await EleventyImage(file, {
			widths: [600],  // Smaller width for thumbnails
			formats: ['webp'],  // Only webp for speed
			outputDir: './_site/assets/images/field-notes/thumbs/',
			urlPath: '/assets/images/field-notes/thumbs/',
			filenameFormat: function (id, src, width, format) {
				const extension = path.extname(src)
				const name = path.basename(src, extension)
				const parentDir = path.basename(path.dirname(src))
				return `${parentDir}-${name}-${width}w.${format}`
			},
			cacheOptions: {
				duration: '30d',  // Cache much longer for speed
				directory: '.cache',
				removeUrlQueryParams: false,
			},
			sharpOptions: {
				animated: false,
				webp: {
					quality: 75,
					effort: 2,  // Faster compression (0-6, lower = faster)
				}
			}
		})

		let imageAttributes = {
			alt,
			sizes: "(min-width: 670px) 670px, 100vw",
			loading: "lazy",
			decoding: "async",
		}

		// Just return the img tag directly, no wrapper needed
		let webp = metadata.webp[metadata.webp.length - 1]
		return `<img src="${webp.url}" alt="${alt}" width="${webp.width}" height="${webp.height}" loading="lazy" decoding="async">`
	})

	// Async image shortcode for responsive images with optimization
	eleventyConfig.addAsyncShortcode('image', async function(src, alt, caption, widths, sizes) {
		// Check if it's a remote URL (R2 or other CDN)
		if (src.startsWith('http://') || src.startsWith('https://')) {
			// For remote URLs, just output a simple img tag
			let imgTag = `<img src="${src}" alt="${alt}" loading="lazy" decoding="async">`
			if (caption) {
				return `<figure class="field-note-figure">${imgTag}<figcaption>${caption}</figcaption></figure>`
			}
			return `<figure class="field-note-figure">${imgTag}</figure>`
		}

		// Resolve path relative to the markdown file location
		let file = this.page.inputPath ?
			path.join(path.dirname(this.page.inputPath), src) : src

		let metadata = await EleventyImage(file, {
			widths: widths || [1200],  // Single width for speed
			formats: ['webp'],  // Only webp for modern browsers
			outputDir: './_site/assets/images/field-notes/',
			urlPath: '/assets/images/field-notes/',
			filenameFormat: function (id, src, width, format) {
				const extension = path.extname(src)
				const name = path.basename(src, extension)
				const parentDir = path.basename(path.dirname(src))
				return `${parentDir}-${name}-${width}w.${format}`
			},
			// Cache processed images for much longer
			cacheOptions: {
				duration: '30d',  // Cache for 30 days
				directory: '.cache',
				removeUrlQueryParams: false,
			},
			sharpOptions: {
				animated: false,
				webp: {
					quality: 80,
					effort: 2,  // Faster compression
				}
			}
		})

		let imageAttributes = {
			alt,
			sizes: sizes || "(min-width: 1024px) 1200px, (min-width: 768px) 90vw, 100vw",
			loading: "lazy",
			decoding: "async",
		}

		// Generate picture element with all formats
		let picture = EleventyImage.generateHTML(metadata, imageAttributes)

		// Always wrap in figure for consistent styling and full-width breakout
		if (caption) {
			return `<figure class="field-note-figure">${picture}<figcaption>${caption}</figcaption></figure>`
		}

		return `<figure class="field-note-figure">${picture}</figure>`
	})

	// Customize Markdown library and settings:
	let markdownLibrary = markdownIt({
		html: true,
		breaks: true,
		linkify: true
	}).use(markdownItAnchor, {
		permalink: markdownItAnchor.permalink.ariaHidden({
			placement: 'after',
			class: 'direct-link',
			symbol: '#',
			level: [1, 2, 3, 4]
		}),
		slugify: eleventyConfig.getFilter('slug')
	})
	eleventyConfig.setLibrary('md', markdownLibrary)

	// Layouts
	eleventyConfig.addLayoutAlias('base', 'base.njk')
	eleventyConfig.addLayoutAlias('post', 'post.njk')
	eleventyConfig.addLayoutAlias('field-note', 'field-note.njk')

	// Copy/pass-through files
	eleventyConfig.addPassthroughCopy('src/assets/css')
	eleventyConfig.addPassthroughCopy('src/assets/js')

	return {
		templateFormats: ['md', 'njk', 'html', 'liquid'],
		htmlTemplateEngine: 'njk',
		passthroughFileCopy: true,
		dir: {
			input: 'src',
			// better not use "public" as the name of the output folder (see above...)
			output: '_site',
			includes: '_includes',
			layouts: 'layouts',
			data: '_data'
		}
	}
}
