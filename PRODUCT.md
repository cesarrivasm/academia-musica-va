# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack
Sitio estático: HTML, CSS y JavaScript sin dependencias ni paso de compilación, en `academy/`. Se prueba con `python3 -m http.server`.

## Users
Músicos del Ministerio de Alabanza de la Iglesia Vida Abundante y principiantes sin teoría musical. Estudian por su cuenta, en teléfono o computador, y usan el curso para entender lo que ya tocan o cantan.

## Product Purpose
Curso de teoría musical en español, aplicado a la alabanza. Cada lección enseña un concepto y lo hace sonar y practicar de inmediato (piano y guitarra, cuestionarios, ejercicios). El éxito es que el músico entienda y use la teoría en su ministerio, y que retome el curso donde lo dejó.

## Positioning
Teoría hecha por y para el ministerio: en español, con ejemplos de alabanza, sonido en cada widget y práctica interactiva en lugar de solo texto. Un curso general de teoría no puede copiar esa procedencia.

## Operating Context
- Siete unidades publicadas (teoría musical, notas, ritmo y métrica, tonos y semitonos, escalas, acordes, transposiciones), cada una con lecciones, práctica y cuestionario final.
- El avance se guarda solo en el dispositivo (`localStorage`); no hay cuentas ni servidor.
- El catálogo ya reserva cursos futuros por instrumento (guitarra, piano) marcados como "Próximamente".

## Capabilities and Constraints
- Todo el texto visible en español; separador « – » (« / » para enarmónicos); sin « · ». Atribución solo al Ministerio de Alabanza · Iglesia Vida Abundante; sin nombres de personas.
- El nivel (Básico, Intermedio, Avanzado) se muestra por unidad, no por tema.
- Todo widget con piano ofrece también guitarra. El sonido usa un único botón estándar.
- Notación con la ortografía correcta de la escala (E♭, no D♯, en E♭ mayor).
- Sin restricciones adicionales declaradas más allá de las que ya fija `.claude/CLAUDE.md`.

## Brand Commitments
- Nombre: Academia de Música VA. Logo en `academy/logo.png`; portada del curso de Teoría en `academy/portada-teoria.jpg`.
- Voz: clara y directa, en español, tuteo.

## Evidence on Hand
Contenido real de las siete unidades en `academy/`. No hay testimonios, cifras de uso ni métricas: no inventarlos.

## Product Principles
1. La teoría se entiende al oírla y practicarla: cada concepto lleva sonido y ejercicio.
2. Un músico debe poder retomar el curso en segundos donde lo dejó.
3. Funciona en el teléfono del músico, sin cuenta ni instalación.
4. Español correcto y notación correcta antes que atajos.
5. Pocas piezas, bien repetidas: una sola forma de hacer sonar, practicar y avanzar.

## Accessibility & Inclusion
Objetivos táctiles de 44 px, navegación completa por teclado, `aria-label` en botones de ícono y respeto de `prefers-reduced-motion` (ya exigidos en `.claude/CLAUDE.md`). Contraste AA como mínimo.
