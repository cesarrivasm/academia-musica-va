# Academia de Música VA

Curso de teoría musical en español para el Ministerio de Alabanza · Iglesia Vida Abundante. Sitio estático (HTML/CSS/JS sin dependencias ni paso de compilación) en `academy/`. El contenido sale de `Material-Alumno.pdf`.

## Estructura
- `academy/index.html`: índice. `academy/curso.js` es la única fuente de la lista de unidades (`ready:true` publica una unidad) y del progreso (`localStorage`, clave `av-curso-done`).
- `academy/unidad.css` y `academy/unidad.js`: compartidos por las siete unidades (también la 06). Cualquier cambio de estilo o comportamiento común va ahí, no en cada HTML.
- Cada `unidad-NN-*.html` contiene su contenido y su script. No hay generador: se edita el HTML directamente.

## Convenciones
- Todo el texto visible en español. Atribución solo al Ministerio de Alabanza · Iglesia Vida Abundante; no poner nombres de personas.
- Cada tema (`.sec-head`) lleva un distintivo de nivel: `lvl lvl-1` Básico, `lvl-2` Intermedio, `lvl-3` Avanzado. Si se agrega un tema, asignarle nivel y ponerlo también en la barra lateral.
- Sonido: un solo botón estándar, `.ibtn.solid` con ícono de bocina. `unidad.js` muestra el estado de reproducción (violeta + pausa) y detiene al volver a pulsar. El audio debe pasar por `note()`/`playSet()` o llamar a `U.hold()`/`U.reg()`. Usar `data-toggle` (metrónomo) o `data-restart` solo si hace falta.
- Alineación: texto justificado, títulos a la izquierda, widgets centrados, una columna de 920 px por sección.
- Carruseles: `data-carousel="Etiqueta"` en un contenedor cuyos hijos son las diapositivas, o `U.carousel(el, etiqueta)` si se arman por JS.
- Accesibilidad: objetivos táctiles de 44 px, `aria-label` en botones de ícono, respetar `prefers-reduced-motion`.
- Notación: las notas se escriben con la ortografía correcta de la escala (sin repetir letras; E♭ y no D♯ en E♭ mayor).

## Correcciones al PDF (ya aplicadas)
Fórmula de la escala mayor (T T ½ T T T ½), IV de F mayor = B♭ y V = C, y escalas con raíz D♯/G♯/A♯ escritas con E♭/A♭/B♭.

## Agregar o cambiar una unidad
1. Copiar la estructura de una unidad existente (encabezado con migas y menú ⋮, barra lateral, `#pager`) y enlazar `unidad.css`, `curso.js` y `unidad.js`.
2. Llamar `U.course(N)` al final del script.
3. Marcar `ready:true` en `curso.js`.

## Probar
```bash
cd academy && python3 -m http.server 8000
```
Revisar la consola sin errores, probar en ancho de teléfono (375 px) y de escritorio, y recorrer las prácticas.
