// @ts-check
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { defineConfig } from 'astro/config';

// Rutas que son redirecciones y no deben aparecer en el sitemap
const REDIRECT_PATHS = [
	'/contacto/',
	'/anchor/', '/breaker/', '/google-podcast/', '/pocket-cast/',
	'/radio-public/', '/spotify-podcast/', '/youtube-podcast/',
	'/instagram/', '/facebook/', '/twitter/', '/whatsapp/',
	'/youtube/', '/spotify/',
	'/g_rosario/', '/g_pronunciacion/', '/g_mortificaciones/',
	'/g_conoce-tu-misa/', '/d_alta-importancia/', '/drive/',
];

export default defineConfig({
	site: 'https://untradi.com',
	integrations: [
		mdx(),
		sitemap({
			filter: (page) => !REDIRECT_PATHS.some((path) =>
				page === `https://untradi.com${path}`
			),
		}),
	],
});
