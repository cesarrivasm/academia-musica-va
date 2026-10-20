# Academia de Música · Ministerio de Alabanza

Curso en línea de teoría musical del **Ministerio de Alabanza · Iglesia Vida Abundante**. Son siete unidades interactivas (con teclado, guitarra, metrónomo, círculo de quintas y ejercicios) basadas en el material impreso del alumno.

## Unidades

| # | Unidad | Archivo |
|---|---|---|
| 01 | Teoría musical | `academy/unidad-01-teoria-musical.html` |
| 02 | Notas musicales | `academy/unidad-02-notas-musicales.html` |
| 03 | Rítmica y métrica | `academy/unidad-03-ritmica-y-metrica.html` |
| 04 | Tonos y semitonos | `academy/unidad-04-tonos-y-semitonos.html` |
| 05 | Escalas | `academy/unidad-05-escalas.html` |
| 06 | Acordes e inversiones | `academy/unidad-06-acordes.html` |
| 07 | Transposiciones | `academy/unidad-07-transposiciones.html` |

Cada tema lleva un distintivo de nivel (Básico, Intermedio o Avanzado). El progreso del alumno se guarda en su propio dispositivo (`localStorage`); no hay servidor ni cuentas.

## Cómo verlo

Es un sitio estático, sin compilación ni servidor: abre `academy/index.html` con doble clic. Las fuentes vienen de Google Fonts (sin internet se usa una fuente del sistema) y el progreso se guarda en el navegador.

Para probarlo como sitio web, desde la carpeta del proyecto:

```bash
cd academy && python3 -m http.server 8000
```

Abre <http://localhost:8000>.

## Estructura

```
academy/
  index.html      índice del curso y progreso
  curso.js        lista de unidades y progreso compartido
  unidad.css      estilos compartidos de todas las unidades
  unidad.js       audio, teclado SVG, prácticas, carrusel, menú y navegación
  unidad-NN-*.html  cada unidad (contenido + su lógica interactiva)
  logo.png
Material-Alumno.pdf   material impreso original
```

## Atribución

Material de la Academia de Música · Ministerio de Alabanza, Iglesia Vida Abundante.
