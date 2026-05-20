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

export const GET: APIRoute = async () => {
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
			// Centered content area
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
				// Top horizontal rule (red)
				h('div', {
					style: {
						width: '80px',
						height: '2px',
						backgroundColor: red,
						marginBottom: '40px',
					},
				}),
				// Site title
				h(
					'div',
					{
						style: {
							fontFamily: '"Playfair Display"',
							fontSize: 58,
							fontWeight: 700,
							color: '#E8E4DC',
							letterSpacing: '-0.02em',
							textAlign: 'center',
							lineHeight: 1.2,
							marginBottom: '40px',
						},
					},
					SITE_TITLE
				),
				// Bottom horizontal rule (red)
				h('div', {
					style: {
						width: '80px',
						height: '2px',
						backgroundColor: red,
						marginBottom: '28px',
					},
				}),
				// Domain
				h(
					'div',
					{
						style: {
							fontFamily: '"Lato"',
							fontSize: 13,
							color: textMuted,
							letterSpacing: '0.22em',
							textTransform: 'uppercase',
						},
					},
					'untradi.com'
				)
			),
			// Bottom bar
			h(
				'div',
				{
					style: {
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'flex-end',
						padding: '0 80px',
						height: '56px',
						borderTop: `1px solid ${border}`,
					},
				},
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
					'Tradición · Liturgia · Fe'
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
