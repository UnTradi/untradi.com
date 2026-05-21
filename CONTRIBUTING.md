# Guía de contribución

Gracias por tu interés en contribuir a **Un Tradi en el Novus Ordo**. Esta guía explica cómo puedes participar de forma útil y ordenada.

---

## Tipos de contribución bienvenidos

| Tipo | Descripción |
|---|---|
| 🐛 **Bug report** | Algo en el sitio no funciona como debería |
| 💡 **Sugerencia** | Mejoras de diseño, accesibilidad o rendimiento |
| 🔧 **Pull request** | Correcciones de código, CSS o configuración |
| ✍️ **Corrección editorial** | Errores tipográficos o de formato en los artículos |

> **Nota:** Los nuevos artículos y la línea editorial son decisión exclusiva del autor del sitio. Los PR con contenido nuevo no serán aceptados salvo invitación expresa.

---

## Reportar un bug

1. Busca primero en los [issues existentes](../../issues) para evitar duplicados.
2. Abre un nuevo issue con:
   - **Título claro:** qué falla y dónde (`Header: el logo no carga en Safari`)
   - **Pasos para reproducirlo**
   - **Comportamiento esperado vs. comportamiento actual**
   - **Entorno:** navegador, sistema operativo, tamaño de pantalla si aplica
   - **Captura de pantalla** si el bug es visual

---

## Proponer una mejora

Abre un issue con el prefijo `[Sugerencia]` en el título y describe:

- Qué quieres mejorar y por qué
- Cómo se vería o funcionaría
- Si ya tienes una solución en mente, menciónala

---

## Hacer un Pull Request

### 1. Fork y rama

```bash
# Clona tu fork
git clone https://github.com/TU_USUARIO/untradi.com.git
cd untradi.com

# Crea una rama descriptiva
git checkout -b fix/header-mobile-overflow
# o
git checkout -b mejora/animacion-featured-card
```

### 2. Instala las dependencias y arranca el servidor

```bash
npm install
npm run dev
```

### 3. Haz tus cambios

- Comprueba que el sitio construye sin errores: `npm run build`
- Verifica tu cambio visualmente en el navegador
- No introduzcas dependencias nuevas sin discutirlo antes en un issue

### 4. Commit y push

Usa mensajes de commit descriptivos en español o inglés:

```bash
git commit -m "fix: corrige desbordamiento del header en pantallas de 375px"
git push origin fix/header-mobile-overflow
```

### 5. Abre el PR

- Describe qué cambió y por qué
- Enlaza el issue relacionado si existe (`Closes #12`)
- Incluye una captura antes/después si el cambio es visual

---

## Convenciones de código

- **CSS:** variables del sistema (`--red`, `--gold`, etc.) en lugar de valores hexadecimales directos
- **Animaciones:** preferir CSS puro; usar JS solo cuando sea necesario para interactividad
- **Scripts:** envolver toda la lógica en `astro:page-load` para compatibilidad con View Transitions
- **Accesibilidad:** mantener `aria-label` en elementos interactivos y `aria-hidden` en decorativos
- **Sin comentarios redundantes:** el código debe ser autoexplicativo; comentar solo el "por qué", nunca el "qué"

---

## Estilo editorial (para correcciones en artículos)

- Ortografía: español estándar (no se usa el voseo)
- Las citas litúrgicas en latín van en cursiva
- Los nombres propios de documentos eclesiásticos van con mayúscula inicial
- No alterar el argumento ni el tono del artículo; solo corregir erratas evidentes

---

## Código de conducta

Este es un proyecto de un blog católico. Se espera respeto, buena fe y caridad en todas las interacciones. Los comentarios irrespetuosos, el spam o las discusiones fuera de lugar serán cerrados sin respuesta.

---

*Deo gratias.*
