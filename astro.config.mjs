// @ts-check
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { defineConfig } from 'astro/config';

export default defineConfig({
	site: 'https://untradi.com',
	integrations: [mdx(), sitemap()],
	redirects: {
		// Páginas movidas
		'/contacto': { status: 301, destination: '/contacto-roma/' },

		// Podcast platforms
		'/anchor':          { status: 301, destination: 'https://anchor.fm/untradi' },
		'/breaker':         { status: 301, destination: 'https://www.breaker.audio/un-tradi-en-el-novus-ordo' },
		'/google-podcast':  { status: 301, destination: 'https://www.google.com/podcasts?feed=aHR0cHM6Ly9hbmNob3IuZm0vcy8xYTZhYzg0NC9wb2RjYXN0L3Jzcw==' },
		'/pocket-cast':     { status: 301, destination: 'https://pca.st/eq318gq0' },
		'/radio-public':    { status: 301, destination: 'https://radiopublic.com/un-tradi-en-el-novus-ordo-WlRP24' },
		'/spotify-podcast': { status: 301, destination: 'https://open.spotify.com/show/58P6usnZ1lS6TDp5NOqofY' },
		'/youtube-podcast': { status: 301, destination: 'https://www.youtube.com/playlist?list=PLUC7QcN3rnrvGrgzdO1xqB1u89fJBHolu' },

		// Social media
		'/instagram': { status: 301, destination: 'https://instagram.com/tio_tradi' },
		'/facebook':  { status: 301, destination: 'https://facebook.com/TioTradi' },
		'/twitter':   { status: 301, destination: 'https://twitter.com/UnTradi' },
		'/whatsapp':  { status: 301, destination: 'https://whatsapp.com/channel/0029VaePhfh17EmnywYPho1t' },
		'/youtube':   { status: 301, destination: 'https://www.youtube.com/channel/UC3Ic_Os9T5UPJB448wkjgwg' },
		'/spotify':   { status: 301, destination: 'https://open.spotify.com/playlist/5WGyFEz6gDENIVXCmRMMEy' },

		// Recursos
		'/g_rosario':         { status: 301, destination: 'https://drive.google.com/open?id=1BvkxrsBZCTmxd3GRCYmbkFSvbtpYQMTZ' },
		'/g_pronunciacion':   { status: 301, destination: 'https://drive.google.com/open?id=12tQFFScDcAUIk1Vq7XVnTzoc1wg9X5J4' },
		'/g_mortificaciones': { status: 301, destination: 'https://drive.google.com/open?id=1KVtuPpEx1SRpzPazDEMrOoQ8aNPfSaAp' },
		'/g_conoce-tu-misa':  { status: 301, destination: 'https://drive.google.com/open?id=1REAuCrhthSpqSchP47PkN5PtNpB-1g-E' },
		'/d_alta-importancia':{ status: 301, destination: 'https://www.dropbox.com/sh/i71hpyr3i1xz5io/AABLl8MqFzth3ugCM5iKSzAAa?dl=0' },
		'/drive':             { status: 301, destination: 'https://drive.google.com/drive/folders/1CKNMBsV9Ffxube-Irl3YcwK2PL7Tgelb?usp=share_link' },
	},
});
