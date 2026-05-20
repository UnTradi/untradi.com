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

	const bg = '#2C2E32';
	const textMuted = '#9A9AA4';
	const border = '#3C3C42';
	const red = '#D44035';

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
			// Red top stripe
			h('div', {
				style: { width: '1200px', height: '8px', backgroundColor: red },
			}),
			// Main content
			h(
				'div',
				{
					style: {
						display: 'flex',
						flexDirection: 'column',
						flex: 1,
						padding: '52px 80px 48px',
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
							marginBottom: '28px',
						},
					},
					h(
						'div',
						{
							style: {
								fontFamily: '"Lato"',
								fontSize: 12,
								color: textMuted,
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
								fontSize: 12,
								color: textMuted,
								letterSpacing: '0.1em',
								textTransform: 'uppercase',
							},
						},
						dateStr
					)
				),
				// Horizontal rule
				h('div', {
					style: { width: '1040px', height: '1px', backgroundColor: border, marginBottom: '44px' },
				}),
				// Title
				h(
					'div',
					{
						style: {
							fontFamily: '"Playfair Display"',
							fontSize: titleSize,
							fontWeight: 700,
							color: '#E8E4DC',
							lineHeight: 1.15,
							letterSpacing: '-0.02em',
							marginBottom: description ? '22px' : '0',
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
									color: textMuted,
									lineHeight: 1.55,
								},
							},
							description.length > 115 ? description.slice(0, 112) + '…' : description
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
					// Left red accent bar
					h('div', {
						style: { width: '32px', height: '3px', backgroundColor: red },
					}),
					h(
						'div',
						{
							style: {
								fontFamily: '"Lato"',
								fontSize: 13,
								color: textMuted,
								letterSpacing: '0.12em',
							},
						},
						'untradi.com'
					)
				)
			)
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
