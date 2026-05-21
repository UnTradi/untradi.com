# Un Tradi en el Novus Ordo

[![Deploy to GitHub Pages](https://github.com/christianecg/untradi.com/actions/workflows/deploy.yml/badge.svg)](https://github.com/christianecg/untradi.com/actions/workflows/deploy.yml)

Sitio web y blog de **[untradi.com](https://untradi.com)** — reflexiones sobre el tradicionalismo católico y la liturgia desde dentro del Novus Ordo.

Construido con [Astro 6](https://astro.build) y desplegado en [GitHub Pages](https://pages.github.com).

---

## Tecnología

| Capa | Herramienta |
|---|---|
| Framework | [Astro 6](https://astro.build) — sitio 100 % estático |
| Contenido | Markdown / MDX |
| Tipografía | Playfair Display · Source Serif 4 · Lato (Google Fonts) |
| OG Images | [Satori](https://github.com/vercel/satori) + sharp |
| Deploy | GitHub Actions → GitHub Pages |
| Dominio | `untradi.com` vía registro externo + CNAME |

---

## Desarrollo local

Requiere **Node.js ≥ 22**.

```bash
# Instalar dependencias
npm install

# Servidor de desarrollo con hot-reload
npm run dev

# Build de producción
npm run build

# Vista previa del build
npm run preview
```

El servidor de desarrollo arranca en `http://localhost:4321` por defecto.

---

## Estructura del proyecto

```
untradi.com/
├── .github/
│   └── workflows/
│       └── deploy.yml          # CI/CD → GitHub Pages
├── public/
│   ├── CNAME                   # Dominio personalizado para GitHub Pages
│   ├── favicon.svg
│   └── robots.txt
├── src/
│   ├── assets/                 # Imágenes y fuentes locales
│   ├── components/
│   │   ├── BaseHead.astro      # <head> con SEO y View Transitions
│   │   ├── Header.astro
│   │   ├── Footer.astro
│   │   ├── FormattedDate.astro
│   │   └── SocialLinks.astro
│   ├── content/
│   │   └── blog/               # Artículos en Markdown
│   ├── layouts/
│   │   ├── BlogPost.astro      # Layout para artículos
│   │   └── Redirect.astro      # Páginas de redirección con diseño propio
│   ├── pages/
│   │   ├── index.astro         # Portada
│   │   ├── blog/               # Listado y rutas dinámicas
│   │   ├── categoria/          # Páginas por categoría
│   │   ├── 404.astro
│   │   ├── faq.astro
│   │   ├── contacto-roma.astro
│   │   ├── og/                 # Generador de imágenes Open Graph
│   │   ├── rss.xml.js
│   │   └── [instagram, youtube, spotify, …].astro   # Redirecciones
│   ├── styles/
│   │   └── global.css          # Variables de color, tipografía y animaciones
│   └── consts.ts               # Constantes: título, categorías, redes sociales
└── astro.config.mjs
```

---

## Escribir un artículo nuevo

1. Crear un archivo `.md` en `src/content/blog/`:

```
src/content/blog/mi-nuevo-articulo.md
```

2. Completar el frontmatter:

```yaml
---
title: 'Título del artículo'
description: 'Resumen breve que aparece en listados y en redes sociales.'
pubDate: '2025-01-15'
category: 'liturgia'          # ver categorías disponibles en src/consts.ts
featured: false               # true = aparece como artículo destacado en portada
# updatedDate: '2025-02-01'   # opcional
---
```

3. Escribir el contenido en Markdown. El primer párrafo recibirá automáticamente una capitular decorativa.

**Categorías disponibles:** `liturgia` · `misa-tradicional` · `fe` · `oracion` · `apologetica` · `historia`

---

## Redirecciones

Las redirecciones (redes sociales, podcast, recursos) se gestionan como páginas `.astro` individuales en `src/pages/`, usando el layout `src/layouts/Redirect.astro`. Para añadir una nueva:

```astro
---
// src/pages/mi-enlace.astro
import Redirect from '../layouts/Redirect.astro';
---
<Redirect
  destination="https://destino.com"
  label="Nombre visible"
  category="Categoría"
/>
```

Esto genera una página en `/mi-enlace/` que redirige instantáneamente vía JS y tiene un fallback visual con el diseño del sitio. Añadir la ruta a la lista `REDIRECT_PATHS` en `astro.config.mjs` para excluirla del sitemap.

---

## Despliegue

El despliegue es automático. Cualquier push a la rama `main` dispara el workflow de GitHub Actions (`.github/workflows/deploy.yml`), que:

1. Instala las dependencias con `npm ci`
2. Ejecuta `npm run build`
3. Sube el directorio `dist/` a GitHub Pages

---

## Licencia

El código fuente de este sitio está bajo la [licencia MIT](LICENSE.md).  
El contenido editorial (artículos, textos, imágenes) es propiedad de sus autores — todos los derechos reservados.
