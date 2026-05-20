#!/usr/bin/env node
import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const CATEGORY_MAP = {
	liturgia: 'liturgia',
	Liturgia: 'liturgia',
	'misa_tradicional': 'misa-tradicional',
	'Misa Tradicional': 'misa-tradicional',
	'misa-tradicional': 'misa-tradicional',
	fe: 'fe',
	Fe: 'fe',
};

const OUTPUT_DIR = join(__dirname, '..', 'src', 'content', 'blog');

function extractBetween(str, open, close) {
	const start = str.indexOf(open);
	if (start === -1) return '';
	const end = str.indexOf(close, start + open.length);
	if (end === -1) return '';
	return str.slice(start + open.length, end);
}

function extractAll(str, open, close) {
	const results = [];
	let offset = 0;
	while (true) {
		const start = str.indexOf(open, offset);
		if (start === -1) break;
		const end = str.indexOf(close, start + open.length);
		if (end === -1) break;
		results.push(str.slice(start + open.length, end));
		offset = end + close.length;
	}
	return results;
}

function decodeCdata(str) {
	return str.replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, (_, content) => content);
}

function decodeEntities(str) {
	return str
		.replace(/&amp;/g, '&')
		.replace(/&lt;/g, '<')
		.replace(/&gt;/g, '>')
		.replace(/&quot;/g, '"')
		.replace(/&#8217;/g, '’')
		.replace(/&#8216;/g, '‘')
		.replace(/&#8220;/g, '“')
		.replace(/&#8221;/g, '”')
		.replace(/&#8212;/g, '—')
		.replace(/&#8211;/g, '–')
		.replace(/&#160;/g, ' ')
		.replace(/&nbsp;/g, ' ');
}

function htmlToMarkdown(html) {
	let md = html;

	md = md.replace(/\r\n/g, '\n').replace(/\r/g, '\n');

	md = md.replace(/<h1[^>]*>([\s\S]*?)<\/h1>/gi, (_, t) => `# ${stripTags(t)}\n\n`);
	md = md.replace(/<h2[^>]*>([\s\S]*?)<\/h2>/gi, (_, t) => `## ${stripTags(t)}\n\n`);
	md = md.replace(/<h3[^>]*>([\s\S]*?)<\/h3>/gi, (_, t) => `### ${stripTags(t)}\n\n`);
	md = md.replace(/<h4[^>]*>([\s\S]*?)<\/h4>/gi, (_, t) => `#### ${stripTags(t)}\n\n`);

	md = md.replace(/<blockquote[^>]*>([\s\S]*?)<\/blockquote>/gi, (_, content) => {
		const lines = stripTags(content).trim().split('\n');
		return lines.map((l) => `> ${l}`).join('\n') + '\n\n';
	});

	md = md.replace(/<strong[^>]*>([\s\S]*?)<\/strong>/gi, (_, t) => `**${stripTags(t)}**`);
	md = md.replace(/<b[^>]*>([\s\S]*?)<\/b>/gi, (_, t) => `**${stripTags(t)}**`);
	md = md.replace(/<em[^>]*>([\s\S]*?)<\/em>/gi, (_, t) => `*${stripTags(t)}*`);
	md = md.replace(/<i[^>]*>([\s\S]*?)<\/i>/gi, (_, t) => `*${stripTags(t)}*`);

	md = md.replace(/<a[^>]+href="([^"]*)"[^>]*>([\s\S]*?)<\/a>/gi, (_, href, text) => {
		return `[${stripTags(text)}](${href})`;
	});

	md = md.replace(/<ul[^>]*>([\s\S]*?)<\/ul>/gi, (_, content) => {
		const items = extractAll(content, '<li', '</li>').map((item) => {
			const inner = item.replace(/^[^>]*>/, '');
			return `- ${stripTags(inner).trim()}`;
		});
		return items.join('\n') + '\n\n';
	});

	md = md.replace(/<ol[^>]*>([\s\S]*?)<\/ol>/gi, (_, content) => {
		const items = extractAll(content, '<li', '</li>').map((item, i) => {
			const inner = item.replace(/^[^>]*>/, '');
			return `${i + 1}. ${stripTags(inner).trim()}`;
		});
		return items.join('\n') + '\n\n';
	});

	md = md.replace(/<p[^>]*>([\s\S]*?)<\/p>/gi, (_, t) => {
		const text = stripTags(t).trim();
		return text ? `${text}\n\n` : '';
	});

	md = md.replace(/<br\s*\/?>/gi, '\n');
	md = md.replace(/<hr\s*\/?>/gi, '\n---\n\n');

	md = md.replace(/<[^>]+>/g, '');

	md = decodeEntities(md);

	md = md.replace(/\n{3,}/g, '\n\n');

	return md.trim();
}

function stripTags(html) {
	return html.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
}

function slugify(text) {
	return text
		.toLowerCase()
		.normalize('NFD')
		.replace(/[̀-ͯ]/g, '')
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-+|-+$/g, '');
}

function getTagValue(xml, tag) {
	const raw = extractBetween(xml, `<${tag}>`, `</${tag}>`);
	return decodeCdata(raw).trim();
}

function escapeYaml(str) {
	return str.replace(/'/g, "''");
}

function parseItems(xml) {
	return extractAll(xml, '<item>', '</item>');
}

function processItem(itemXml) {
	const postType = getTagValue(itemXml, 'wp:post_type');
	if (postType !== 'post') return null;

	const status = getTagValue(itemXml, 'wp:status');
	if (status !== 'publish') return null;

	const title = decodeEntities(decodeCdata(getTagValue(itemXml, 'title')));
	const slug = getTagValue(itemXml, 'wp:post_name') || slugify(title);
	const dateRaw = getTagValue(itemXml, 'wp:post_date');
	const pubDate = dateRaw ? dateRaw.slice(0, 10) : new Date().toISOString().slice(0, 10);
	const contentRaw = getTagValue(itemXml, 'content:encoded');
	const excerptRaw = getTagValue(itemXml, 'excerpt:encoded');

	const description = excerptRaw
		? decodeEntities(stripTags(excerptRaw)).slice(0, 200).trim()
		: decodeEntities(stripTags(contentRaw)).slice(0, 200).trim();

	const categoryMatches = extractAll(itemXml, '<category domain="category"', '</category>');
	const categories = categoryMatches
		.map((c) => {
			const raw = c.replace(/^[^>]*>/, '');
			return decodeCdata(raw).trim();
		})
		.map((c) => CATEGORY_MAP[c])
		.filter(Boolean);

	const category = categories[0] ?? null;

	const content = htmlToMarkdown(contentRaw);

	return { title, slug, pubDate, description, category, content };
}

function buildFrontmatter(post) {
	const lines = ['---'];
	lines.push(`title: '${escapeYaml(post.title)}'`);
	lines.push(`description: '${escapeYaml(post.description)}'`);
	lines.push(`pubDate: '${post.pubDate}'`);
	if (post.category) lines.push(`category: '${post.category}'`);
	lines.push('---');
	return lines.join('\n');
}

function run() {
	const args = process.argv.slice(2);
	if (args.length === 0) {
		console.error('Uso: node scripts/wp-to-mdx.mjs <wordpress-export.xml>');
		process.exit(1);
	}

	const inputPath = args[0];
	let xml;
	try {
		xml = readFileSync(inputPath, 'utf-8');
	} catch {
		console.error(`No se pudo leer el archivo: ${inputPath}`);
		process.exit(1);
	}

	mkdirSync(OUTPUT_DIR, { recursive: true });

	const items = parseItems(xml);
	console.log(`\nEncontrados ${items.length} elementos en el XML.`);

	let written = 0;
	let skipped = 0;

	for (const itemXml of items) {
		const post = processItem(itemXml);
		if (!post) {
			skipped++;
			continue;
		}

		const filename = `${post.slug}.md`;
		const outputPath = join(OUTPUT_DIR, filename);
		const fileContent = `${buildFrontmatter(post)}\n\n${post.content}\n`;

		writeFileSync(outputPath, fileContent, 'utf-8');
		console.log(`  ✓ ${filename}`);
		written++;
	}

	console.log(`\nResumen:`);
	console.log(`  Artículos migrados: ${written}`);
	console.log(`  Omitidos (borradores/páginas): ${skipped}`);
	console.log(`  Destino: ${OUTPUT_DIR}\n`);
}

run();
