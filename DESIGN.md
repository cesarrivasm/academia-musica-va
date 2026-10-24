---
name: Academia de Música VA
description: Curso de teoría musical en español para el Ministerio de Alabanza, sereno y táctil, con el sonido como protagonista.
colors:
  navy: "#1e3a73"
  navy-hover: "#142a57"
  navy-soft: "#eef1f8"
  violet: "#6f4a9b"
  violet-soft: "#f1ebf7"
  violet-ring: "#ece3f5"
  paper: "#ffffff"
  page: "#f3f4f8"
  tint: "#f6f7fb"
  ink: "#1a2340"
  body: "#2c3552"
  muted: "#5b6480"
  faint: "#626a85"
  line: "#e3e6ee"
  line-strong: "#cfd5e4"
  ok: "#1f7a50"
  ok-soft: "#e5f4ec"
  err: "#a83434"
  err-soft: "#fbeaea"
  key-black: "#1d2033"
typography:
  display:
    fontFamily: "Schibsted Grotesk, Avenir Next, Segoe UI, sans-serif"
    fontSize: "clamp(30px, 4.4vw, 40px)"
    fontWeight: 800
    lineHeight: 1.1
    letterSpacing: "-0.02em"
  headline:
    fontFamily: "Schibsted Grotesk, Avenir Next, Segoe UI, sans-serif"
    fontSize: "22px"
    fontWeight: 700
    lineHeight: 1.12
  body:
    fontFamily: "Instrument Sans, Segoe UI, system-ui, sans-serif"
    fontSize: "17px"
    fontWeight: 400
    lineHeight: 1.6
  label:
    fontFamily: "Instrument Sans, Segoe UI, system-ui, sans-serif"
    fontSize: "14px"
    fontWeight: 700
    lineHeight: 1.2
rounded:
  sm: "10px"
  md: "12px"
  lg: "18px"
  pill: "999px"
spacing:
  xs: "6px"
  sm: "12px"
  md: "20px"
  lg: "24px"
  section: "80px"
components:
  button-primary:
    backgroundColor: "{colors.navy}"
    textColor: "{colors.paper}"
    rounded: "{rounded.pill}"
    padding: "8px 20px"
    height: "44px"
  button-primary-hover:
    backgroundColor: "{colors.navy-hover}"
  button-secondary:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.navy}"
    rounded: "{rounded.pill}"
    padding: "0 16px 0 12px"
    height: "44px"
  sound-button:
    backgroundColor: "{colors.navy}"
    textColor: "{colors.paper}"
    rounded: "{rounded.pill}"
    size: "44px"
  sound-button-playing:
    backgroundColor: "{colors.violet}"
  panel:
    backgroundColor: "{colors.paper}"
    rounded: "{rounded.lg}"
    padding: "22px 24px"
  option:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
    padding: "12px 16px"
    height: "48px"
---

# Design System: Academia de Música VA

## Overview

**Creative North Star: "El cuaderno del ensayo"**

Un cuaderno de estudio abierto en la sala de ensayo: papel limpio sobre un fondo gris suave, tinta azul marino para estructurar y navegar, y un solo acento violeta que aparece únicamente cuando algo suena, se selecciona o avanza. Es un sistema sereno y ordenado, hecho para leer una lección, oír el ejemplo y practicarlo sin distracciones.

La densidad es media: una columna de 920 px por sección, mucho aire entre secciones (80 px) y widgets centrados. Los títulos van a la izquierda y el texto corrido justificado. Todo lo que se toca es grande (44 px) porque se usa con el pulgar, en el teléfono, a veces con poca luz.

**Key Characteristics:**
- Marino sobrio como voz principal; violeta reservado para sonido, selección y progreso.
- Superficies planas con borde fino; sombra difusa solo en paneles grandes.
- Botones en píldora, claros y táctiles; esquinas generosas en paneles.
- Un solo botón de sonido, siempre igual.
- Tema Sistema/Claro/Oscuro y fuente de lectura elegible, sin cambiar el sistema.

## Colors

Marino y violeta sobre papel blanco y un gris azulado muy claro. Los neutros llevan un matiz azul, nunca gris puro.

### Primary
- **Marino de tinta** (#1e3a73): botones principales, enlaces, títulos de unidad, íconos de acción. Su hover es **Marino profundo** (#142a57). El fondo suave **Marino niebla** (#eef1f8) sirve de hover y de selección tenue.

### Secondary
- **Violeta de sonido** (#6f4a9b): estado de reproducción, elemento seleccionado, lección actual y anillo de foco. Contrasta 6,7:1 sobre blanco. Su par suave **Violeta niebla** (#f1ebf7) rellena las celdas activas.

### Neutral
- **Papel** (#ffffff): tarjetas, paneles y widgets.
- **Página** (#f3f4f8): fondo general; **Tinte** (#f6f7fb) para bandas internas.
- **Tinta** (#1a2340) para títulos, **Cuerpo** (#2c3552) para texto corrido, **Atenuado** (#5b6480) para metadatos y **Tenue** (#626a85) para etiquetas pequeñas (≥4,5:1 sobre blanco).
- **Línea** (#e3e6ee) y **Línea firme** (#cfd5e4) para bordes y divisores.
- Estados: **Acierto** (#1f7a50) con fondo #e5f4ec; **Error** (#a83434) con fondo #fbeaea. Nunca solo color: llevan texto o ícono.

### Cursos
Cada curso del catálogo tiene su matiz propio (azul, ámbar, malva, rojo, verde azulado, oliva) con tres valores: color, fondo suave y texto. Se usan solo en portadas, píldoras y viñetas del catálogo.

### Named Rules
**The Sound Violet Rule.** El violeta significa «esto suena o está activo». No se usa como decoración ni en títulos de sección; su escasez es lo que lo hace legible.

**The Tinted Neutral Rule.** Todo neutro lleva un matiz azul hacia el marino. Nada de gris puro ni negro puro; la tecla negra del piano es #1d2033.

### Modo oscuro
Los mismos tokens se redefinen: página #0e1220, papel #161b2e, marino #9db3ef, violeta #b394e0, texto sobre ellos oscuro. Sigue al sistema salvo que se elija Claro u Oscuro en el perfil (`html[data-theme]`). Solo cambian los tokens, no las reglas.

## Typography

**Display Font:** Schibsted Grotesk (con Avenir Next y Segoe UI de respaldo)
**Body Font:** Instrument Sans (con Segoe UI y system-ui de respaldo)
**Reading Font (opcional):** Charter, Source Serif 4 o Newsreader, elegible en el perfil y aplicada solo al texto corrido.

**Character:** un grotesco geométrico con peso para los títulos y un humanista legible para el cuerpo; juntos suenan didácticos, no corporativos. Todas las fuentes se alojan localmente en `academy/fonts/`.

### Hierarchy
- **Display** (800, clamp(30px, 4.4vw, 40px), 1.1, -0.02em): título de la unidad y saludo del inicio.
- **Headline** (700, 22px, 1.12): títulos de sección y de lección.
- **Title** (700, 17–19px): nombre de curso en tarjetas, encabezados de panel.
- **Body** (400, 17px, 1.6): texto de lección, columna de 920 px con texto justificado; `text-wrap: balance` en títulos.
- **Label** (700, 14px; 12–13px para metadatos): botones, pestañas, píldoras. Cifras con `tabular-nums` en notas, pulsos y tablas.

### Named Rules
**The Two Voices Rule.** Los títulos usan siempre el grotesco; el texto y los controles, siempre Instrument Sans. La fuente de lectura solo reemplaza el texto corrido, nunca widgets, etiquetas ni títulos.

## Layout

Una columna de 920 px centrada por sección, dentro de un contenedor de 1200 px con márgenes de 20 px (16 px en teléfono). Las secciones se separan por 80 px; dentro de ellas el ritmo es de 12 a 24 px. En escritorio el temario queda fijo a un lado; en ≤1023 px pasa al modo enfoque: una lección a la vez con pestañas Ver, Leer, Practicar y Recursos, barra superior e inferior. Los laboratorios (`.lab`) pasan a dos columnas desde 1100 px. Alineación: títulos a la izquierda, texto justificado, widgets centrados. Los objetivos táctiles miden 44 px como mínimo (48 px en opciones y entradas).

## Elevation & Depth

Híbrido y contenido: las superficies descansan planas con borde de 1 px (#e3e6ee) sobre la página; solo los paneles grandes (laboratorios, cuestionarios, tarjetas del catálogo) llevan una sombra difusa. Los botones no tienen sombra; el estado se comunica con el relleno.

### Shadow Vocabulary
- **Panel** (`box-shadow: 0 1px 2px rgba(22,26,51,.04), 0 8px 28px rgba(36,66,122,.08)`): laboratorios, cuestionarios, tarjetas.
- **Lift** (`box-shadow: 0 1px 2px rgba(22,26,51,.06), 0 2px 8px rgba(36,66,122,.08)`): segmento seleccionado y chips activos.
- **Panel lateral** (`box-shadow: -12px 0 40px rgba(20,42,87,.18)`): cajón de navegación sobre un velo azul translúcido.

### Named Rules
**The Quiet Shadow Rule.** La sombra separa un panel del fondo; nunca decora un botón ni un texto. En oscuro se vuelve negra y más profunda.

## Shapes

Esquinas generosas y consistentes: 10 px en celdas y entradas, 12 px en opciones y botones de bloque, 18 px en paneles y laboratorios, y píldora completa (999 px) en botones, chips y pestañas. Los íconos de sonido, avance y cierre son círculos de 44 px. Los bordes son siempre de 1 px; el foco usa un trazo de 3 px violeta con 2 px de separación.

## Components

### Buttons
- **Shape:** píldora (999 px), 44 px de alto mínimo.
- **Primary:** marino de tinta con texto claro, 15px/700, padding 8×20 px (`.btn`, `.cta`, «Siguiente»).
- **Secondary (`.pbtn`):** fondo blanco, borde y texto marino, ícono de 18 px a la izquierda.
- **Hover / Focus:** el primario oscurece a marino profundo; el secundario se rellena con marino niebla. Foco: anillo de 3 px violeta.
- **Disabled:** 35–40 % de opacidad, sin cursor de acción.

### Sound button (componente firma)
- Círculo de 44 px, marino con bocina clara (`.ibtn.solid`). Al reproducir se vuelve violeta con un pulso suave (se reemplaza por un halo fijo con movimiento reducido) y un segundo toque lo detiene. Es el único botón de sonido de todo el curso.

### Chips y segmentos
- **Chips:** píldora blanca con borde firme, cifras tabulares y 44 px de alto; el seleccionado se rellena de marino.
- **Segmento (`.seg`):** píldora gris azulada con 3 px de relleno; el elegido es blanco con texto marino en negrita y sombra lift.

### Cards / Containers
- **Panel / Lab:** blanco, borde de 1 px, radio 18 px, sombra panel, relleno de 22×24 px. Los laboratorios se componen de controles, lectura, visualización y explicación.
- **Tarjeta de curso:** portada con imagen o rayas del matiz del curso, píldora de estado, nombre en 19px/700 y metadatos.

### Inputs / Fields
- **Style:** borde firme de 1 px, radio 10 px, 48 px de alto, 16–18 px de texto; selectores en píldora con flecha propia.
- **Focus:** anillo violeta de 3 px. Correcto y error usan color más ícono o texto.

### Navigation
- **Header compacto:** logo y marca a la izquierda, enlaces Inicio, Cursos y Mi progreso, y menú de perfil con tema y fuente de lectura. En teléfono se reemplaza por un botón de menú que abre el cajón.
- **Temario:** lista numerada con el punto de lección actual en violeta y las vistas en marino; en el modo enfoque, barras superior e inferior con «Anterior» y «Siguiente».

### Widgets de música (piano, diapasón, círculo de quintas)
- Todo widget con piano lleva un toggle Piano/Guitarra. Teclas blancas #ffffff con borde #c9cddd y negras #1d2033; el diapasón muestra 12 trastes con marcas violeta. El foco se dibuja con un anillo de doble trazo (oscuro y blanco) visible en cualquier fondo.

## Do's and Don'ts

### Do:
- **Do** usar el marino para estructurar y el violeta solo para sonido, selección y avance.
- **Do** mantener 44 px de objetivo táctil como mínimo y mostrar siempre el foco con el anillo violeta de 3 px.
- **Do** definir cualquier color nuevo como token con su versión oscura.
- **Do** escribir las notas con la ortografía correcta de la escala (E♭, no D♯, en E♭ mayor) y el separador « – ».
- **Do** conservar una columna de 920 px, títulos a la izquierda, texto justificado y widgets centrados.
- **Do** respetar `prefers-reduced-motion`: sustituir el movimiento por un cambio de estado estático, no suprimir el estado.

### Don't:
- **Don't** añadir un segundo botón de sonido ni íconos de bocina distintos.
- **Don't** usar violeta o sombras como decoración, ni sombras en botones.
- **Don't** usar gris ni negro puro: los neutros siempre llevan el matiz azul.
- **Don't** meter la fuente de lectura en títulos, etiquetas o widgets.
- **Don't** mostrar el nivel por tema (solo por unidad) ni poner nombres de personas; la atribución es al Ministerio de Alabanza · Iglesia Vida Abundante.
- **Don't** transmitir acierto o error solo con color.
