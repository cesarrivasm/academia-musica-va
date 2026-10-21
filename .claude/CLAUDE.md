# Academia de Música VA

Curso de teoría musical en español para el Ministerio de Alabanza · Iglesia Vida Abundante. Sitio estático (HTML/CSS/JS sin dependencias ni paso de compilación) en `academy/`.

## Estructura
- `academy/index.html`: inicio (continuar + catálogo de cursos; `?v=lista` muestra la variante de lista). `academy/progreso.html`: Mi progreso (solo datos locales).
- `academy/curso.js`: única fuente de los cursos (`COURSES`), las unidades (`ready:true` publica una unidad) y sus lecciones (`lessons`, deben coincidir con los `.sec-head` de cada HTML). Guarda el progreso en `localStorage` (`av-curso-done`, `av-lecciones-vistas`, `av-ultima-leccion`). También inyecta el header compacto (`CURSO.header`) y el panel deslizable (`CURSO.drawer`).
- `academy/unidad.css` y `academy/unidad.js`: compartidos por las siete unidades (también la 06). Cualquier cambio de estilo o comportamiento común va ahí, no en cada HTML.
- Cada `unidad-NN-*.html` contiene su contenido y su script. No hay generador: se edita el HTML directamente. `<body class="lesson">` activa el temario fijo y el modo enfoque (≤1023 px: una lección a la vez con pestañas Ver/Leer/Practicar/Recursos, barra superior e inferior).

## Convenciones
- Todo el texto visible en español. Separador visible « – » (« / » para enarmónicos); sin « · ». Atribución solo al Ministerio de Alabanza · Iglesia Vida Abundante; no poner nombres de personas.
- El nivel (`lvl lvl-1` Básico, `lvl-2` Intermedio, `lvl-3` Avanzado) se muestra por unidad, no por tema. Cada lección tiene su `lvl` en `lessons` de `curso.js` y la unidad hereda el que más se repite (en empate, el más alto). Si se agrega un tema, asignarle `lvl` y ponerlo en `lessons`.
- Sonido: un solo botón estándar, `.ibtn.solid` con ícono de bocina. `unidad.js` muestra el estado de reproducción (violeta + pausa) y detiene al volver a pulsar. El audio debe pasar por `note()`/`playSet()` o llamar a `U.hold()`/`U.reg()`. Usar `data-toggle` (metrónomo) o `data-restart` solo si hace falta.
- Instrumentos: todo widget con piano lleva un toggle Piano/Guitarra (`.tabs` con `data-inst`). La guitarra usa `U.fretboard()` (diapasón de 12 trastes; `marks`, `setPcs`, `setPicked`, modo `blank` para prácticas) y `U.keyQuiz` ya incluye el toggle.
- Alineación: texto justificado, títulos a la izquierda, widgets centrados, una columna de 920 px por sección.
- Carruseles: `data-carousel="Etiqueta"` en un contenedor cuyos hijos son las diapositivas, o `U.carousel(el, etiqueta)` si se arman por JS.
- Accesibilidad: objetivos táctiles de 44 px, `aria-label` en botones de ícono, respetar `prefers-reduced-motion`.
- Notación: las notas se escriben con la ortografía correcta de la escala (sin repetir letras; E♭ y no D♯ en E♭ mayor).

## Agregar o cambiar una unidad
1. Copiar la estructura de una unidad existente (`<header class="top" id="top">` vacío, `#syl`, `.unit-intro` con migas, secciones con `.sec-head`) y enlazar `unidad.css`, `curso.js` y `unidad.js`.
2. Llamar `U.course(N)` al final del script.
3. Agregar la unidad y sus `lessons` en `curso.js` y marcar `ready:true`.
4. Las pestañas se asignan solas por tipo de hijo de la sección; para forzar una, poner `data-tab="ver|leer|practicar|recursos"`.

## Probar
```bash
cd academy && python3 -m http.server 8000
```
Revisar la consola sin errores, probar en ancho de teléfono (375 px) y de escritorio, y recorrer las prácticas.
