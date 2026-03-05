# Pre-plan: Mejoras UI - Logo, Nutriscore y Navegación

## Contexto

El workshop está completo y pulido (5 iteraciones, 13 tests, visual-fixes-v2 aplicado).
Este pre-plan describe las tres mejoras pendientes para la siguiente sesión de trabajo.
Requiere planificación antes de implementar porque afectan a ramas distintas y hay que
decidir exactamente en qué iteración va el test nuevo.

---

## Mejoras detectadas

### 1. Logo en la cabecera

**Situación actual:** El título "TDD Workshop" es un `<h1>` de texto plano.

**Objetivo:** Reemplazarlo por un logo real (imagen o SVG).

**Preguntas a resolver en el plan:**
- ¿Recurso a usar? (SVG inline, `<img>`, icono tipográfico...)
- ¿Dónde vive el asset? (`src/assets/`, `public/`...)
- **Ramas afectadas:** master → cascade completa (todas las ramas)

---

### 2. Logo clicable → navega a home sin categoría

**Situación actual:** El título/logo no es interactivo.

**Objetivo:** Envolver el logo en un `<Link to="/">` para que siempre lleve a la home,
independientemente de la categoría activa.

**Preguntas a resolver en el plan:**
- ¿En qué iteración añadir el test? Candidatas:
  - **Iteración 1** (Home + categorías): es donde se introduce la navegación básica
  - **Iteración 3** (NavLink + routing activo): es donde se trabaja la navegación con estado activo
  - Probablemente **iteración 3** tiene más sentido: el test de "click en logo → va a home"
    encaja con los tests de navegación de esa iteración
- El test debe verificar comportamiento observable: desde una categoría, click en logo,
  aparece la home sin productos de categoría filtrados
- **Ramas afectadas:** master + cascade; test en iteration-3-solution (y iteration-3-start
  si se considera punto de partida para ese ejercicio)

---

### 3. Componente `<NutriScore />` dedicado

**Situación actual:** La lógica de nutriscore (badge con letra + color) está duplicada o
embebida en `ProductCard` y `ProductDetail`.

**Objetivo:** Extraer un componente reutilizable `<NutriScore score="A" />` que encapsule:
- El badge visual con la letra
- Los colores por letra (A→verde, B→amarillo-verde, C→amarillo, D→naranja, E→rojo)
- Potencialmente una escala visual completa (A B C D E con la letra activa resaltada)

**Preguntas a resolver en el plan:**
- ¿Solo badge con la letra activa o escala completa?
- ¿Dónde vive el componente? (`src/components/nutri-score/`)
- **Ramas afectadas:** iteration-2-solution (donde aparece `ProductCard`) e
  iteration-5-solution (donde aparece `ProductDetail`). Requiere cascade desde iter-2.

---

## Orden de implementación sugerido

1. **Logo + clicable juntos** (son la misma área del código, mejor atacarlos a la vez)
   - Fase A: asset del logo en master
   - Fase B: `<Link to="/">` en Navigation.tsx en master → cascade
   - Fase C: test en iteration-3-solution (y propagar hacia iter-4 e iter-5)

2. **Componente NutriScore** (refactor, más independiente)
   - Fase A: crear componente en iteration-2-solution
   - Fase B: cascade + integración en ProductDetail (iteration-5)

---

## Antes de empezar

- Revisar el asset del logo con el usuario (¿tenemos un SVG? ¿usamos texto estilizado?)
- Decidir el alcance de NutriScore (badge simple vs escala completa)
- Confirmar en qué iteración se enseña el test del logo clicable