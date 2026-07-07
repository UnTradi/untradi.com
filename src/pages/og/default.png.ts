import type { APIRoute } from 'astro';
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
		name: 'Cormorant Garamond',
		data: readFileSync(
			resolve(
				'./node_modules/@fontsource/cormorant-garamond/files/cormorant-garamond-latin-700-normal.woff'
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

export const GET: APIRoute = async () => {
	// Site palette
	const bg     = '#FBF6EB';
	const ink    = '#1B1209';
	const faint  = '#8A7050';
	const red    = '#9E2B25';
	const gold   = '#B08A2E';
	const border = '#D9C9AB';

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
			// Centered content
			h(
				'div',
				{
					style: {
						display: 'flex',
						flexDirection: 'column',
						alignItems: 'center',
						justifyContent: 'center',
						flex: 1,
						padding: '0 80px',
					},
				},
				// Gold top ornament bar
				h('div', {
					style: {
						width: '64px',
						height: '2px',
						backgroundColor: gold,
						marginBottom: '48px',
					},
				}),
				// Site title
				h(
					'div',
					{
						style: {
							fontFamily: '"Cormorant Garamond"',
							fontSize: 58,
							fontWeight: 700,
							color: ink,
							letterSpacing: '-0.02em',
							textAlign: 'center',
							lineHeight: 1.2,
							marginBottom: '36px',
						},
					},
					SITE_TITLE
				),
				// Gold bottom ornament bar
				h('div', {
					style: {
						width: '64px',
						height: '2px',
						backgroundColor: gold,
						marginBottom: '28px',
					},
				}),
				// Tagline
				h(
					'div',
					{
						style: {
							fontFamily: '"Lato"',
							fontSize: 13,
							color: faint,
							letterSpacing: '0.22em',
							textTransform: 'uppercase',
						},
					},
					'Tradición · Liturgia · Fe'
				)
			),
			// Bottom bar
			h(
				'div',
				{
					style: {
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'space-between',
						padding: '0 80px',
						height: '52px',
						borderTop: `1px solid ${border}`,
					},
				},
				h('div', {
					style: { width: '28px', height: '3px', backgroundColor: red },
				}),
				h(
					'div',
					{
						style: {
							fontFamily: '"Lato"',
							fontSize: 12,
							color: faint,
							letterSpacing: '0.12em',
							textTransform: 'uppercase',
						},
					},
					'untradi.com'
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
