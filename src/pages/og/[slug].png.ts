import type { APIRoute, GetStaticPaths } from 'astro';
import { getCollection } from 'astro:content';
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { SITE_TITLE } from '../../consts';

function h(type: string, props: Record<string, unknown> | null, ...children: unknown[]) {
	const cleaned = children.filter((c) => c !== null && c !== undefined && c !== false);
	return {
		type,
		props: {
			...props,
			children:
				cleaned.length === 0 ? undefined : cleaned.length === 1 ? cleaned[0] : cleaned,
		},
	};
}

const fonts = [
	{
		name: 'Playfair Display',
		data: readFileSync(
			resolve(
				'./node_modules/@fontsource/playfair-display/files/playfair-display-latin-700-normal.woff'
			)
		),
		weight: 700 as const,
		style: 'normal' as const,
	},
	{
		name: 'Lato',
		data: readFileSync(
			resolve('./node_modules/@fontsource/lato/files/lato-latin-400-normal.woff')
		),
		weight: 400 as const,
		style: 'normal' as const,
	},
];

export const getStaticPaths: GetStaticPaths = async () => {
	const posts = await getCollection('blog');
	return posts.map((post) => ({
		params: { slug: post.id },
		props: {
			title: post.data.title,
			description: post.data.description,
			pubDate: post.data.pubDate,
		},
	}));
};

export const GET: APIRoute = async ({ props }) => {
	const { title, description, pubDate } = props as {
		title: string;
		description?: string;
		pubDate: Date;
	};

	const dateStr = pubDate
		? pubDate.toLocaleDateString('es-MX', {
				year: 'numeric',
				month: 'long',
				day: 'numeric',
			})
		: '';

	const displayTitle = title.length > 65 ? title.slice(0, 62) + '…' : title;
	const titleSize = title.length > 48 ? 52 : title.length > 34 ? 62 : 72;

	// Site palette
	const bg        = '#F5EDE0';
	const bgSurface = '#EADECB';
	const ink       = '#1C1008';
	const muted     = '#5C4838';
	const faint     = '#9A7E64';
	const red       = '#991A11';
	const gold      = '#B88528';
	const border    = '#C8B498';

	const svg = await satori(
		h(
			'div',
			{
				style: {
					width: '1200px',
					height: '630px',
					backgroundColor: bg,
					display: 'flex',
					flexDirection: 'column',
				},
			},
			// Gold top stripe
			h('div', {
				style: { width: '1200px', height: '5px', backgroundColor: gold },
			}),
			// Main content
			h(
				'div',
				{
					style: {
						display: 'flex',
						flexDirection: 'column',
						flex: 1,
						padding: '48px 80px 44px',
					},
				},
				// Top row: site name | date
				h(
					'div',
					{
						style: {
							display: 'flex',
							justifyContent: 'space-between',
							alignItems: 'center',
							marginBottom: '24px',
						},
					},
					h(
						'div',
						{
							style: {
								fontFamily: '"Lato"',
								fontSize: 11,
								color: faint,
								letterSpacing: '0.22em',
								textTransform: 'uppercase',
							},
						},
						SITE_TITLE
					),
					h(
						'div',
						{
							style: {
								fontFamily: '"Lato"',
								fontSize: 11,
								color: faint,
								letterSpacing: '0.1em',
								textTransform: 'uppercase',
							},
						},
						dateStr
					)
				),
				// Gold horizontal rule
				h('div', {
					style: { width: '1040px', height: '1px', backgroundColor: gold, marginBottom: '40px', opacity: 0.5 },
				}),
				// Title
				h(
					'div',
					{
						style: {
							fontFamily: '"Playfair Display"',
							fontSize: titleSize,
							fontWeight: 700,
							color: ink,
							lineHeight: 1.15,
							letterSpacing: '-0.02em',
							marginBottom: description ? '20px' : '0',
						},
					},
					displayTitle
				),
				// Description
				description
					? h(
							'div',
							{
								style: {
									fontFamily: '"Lato"',
									fontSize: 19,
									color: muted,
									lineHeight: 1.55,
								},
							},
							description
						)
					: null,
				// Spacer
				h('div', { style: { flex: 1 } }),
				// Bottom rule + domain
				h(
					'div',
					{
						style: {
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'space-between',
							paddingTop: '20px',
							borderTop: `1px solid ${border}`,
						},
					},
					h('div', {
						style: { width: '32px', height: '3px', backgroundColor: red },
					}),
					h(
						'div',
						{
							style: {
								fontFamily: '"Lato"',
								fontSize: 13,
								color: faint,
								letterSpacing: '0.12em',
							},
						},
						'untradi.com'
					)
				)
			),
			// Carmesí bottom stripe
			h('div', {
				style: { width: '1200px', height: '4px', backgroundColor: red },
			})
		),
		{
			width: 1200,
			height: 630,
			fonts,
		}
	);

	const resvg = new Resvg(svg, { fitTo: { mode: 'width', value: 1200 } });
	const png = resvg.render().asPng();

	return new Response(png, {
		headers: {
			'Content-Type': 'image/png',
			'Cache-Control': 'public, max-age=31536000, immutable',
		},
	});
};
