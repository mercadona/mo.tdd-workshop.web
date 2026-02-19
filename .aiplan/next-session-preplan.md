# Pre-plan: Tests esqueleto en master + Guión del instructor

## Contexto

Workshop funcionalmente completo y visualmente pulido. Este pre-plan recoge dos iniciativas
pendientes que preparar antes del workshop.

---

## Iniciativa 1: Tests esqueleto en master

### Idea

En `master` (punto de partida de los asistentes), todos los test files estarán creados con
los `it` escritos pero vacíos (`it.todo`), agrupados por `describe` por iteración. Así los
asistentes tienen desde el primer momento una guía clara de qué deben construir en cada fase.

### Motivación

- Los asistentes no arrancan de cero sin saber qué testear
- Elimina el tiempo de "¿qué test escribo primero?"
- Los `describe` por iteración dan estructura y orientación progresiva
- Los `it.todo` aparecen en el runner como pendientes (feedback visual inmediato)

### Estructura propuesta

**`src/pages/home/__tests__/Home.test.tsx`**
```
describe('Iteración 1 - Listado de categorías', () => {
  it.todo('should render the list of categories in the navigation')
})

describe('Iteración 2 - Listado de productos', () => {
  it.todo('should display the products with their prices correctly formatted')
})

describe('Iteración 4 - Toggle card/list view', () => {
  it.todo('should not display product descriptions and nutriscore in card view')
  it.todo('should display product descriptions and nutriscore when switching to list view')
  it.todo('should hide product descriptions and nutriscore when switching back to card view')
})

describe('Iteración 5 - Modal de producto', () => {
  it.todo('should open a dialog with product details when clicking a product')
  it.todo('should close the dialog when clicking close button')
})
```

**`src/pages/category-detail/__tests__/CategoryDetail.test.tsx`**
```
describe('Iteración 3 - Navegación y routing', () => {
  it.todo('should navigate to the category page and display the category title')
  it.todo('should display a not found message when the category does not exist')
  it.todo('should highlight the active category in the navigation')
  it.todo('should navigate to home when clicking the logo')
})
```

**`src/pages/not-found/__tests__/NotFound.test.tsx`** — pendiente de decidir si tiene
sentido incluirlo aquí o si se crea en la iteración 3 en vivo.

### Preguntas a resolver en sesión de planificación

- ¿Los `it.todo` o simplemente `it('descripción')` sin callback? (Vitest muestra ambos como
  pending, pero `it.todo` es más explícito)
- ¿Se mantiene el test de Home que ya existe en master
  (`should render the list of categories in the navigation` real, no todo)?
  O se convierte también en todo y el asistente lo implementa en iteración 1
- ¿Los helpers (`clickCategory`, `toggleViewMode`, `clickProduct`) también en master
  como esqueleto vacío, o se añaden en cada iteración?
- ¿Los imports necesarios para los tests (App, screen, render...) ya incluidos en el esqueleto,
  o se deja el archivo completamente vacío salvo los describes?
- ¿Cómo afecta esto a las ramas `-start`? Deberían heredar de master limpiamente.
  Las ramas `-solution` ya tienen los tests reales implementados.

### Impacto en ramas

- Solo afecta a `master` (y por cascade a todas las ramas `-start`)
- Las ramas `-solution` no se tocan: ya tienen los tests completos
- Hay que verificar que los `it.todo` no rompan ninguna configuración de CI

---

## Iniciativa 2: Guión del instructor

### Idea

Documento markdown que sirve de guión para conducir el workshop. No es un tutorial para
asistentes sino una referencia para quien lo imparte.

### Estructura propuesta

```
# Guión del instructor - TDD Workshop

## Antes de empezar
- Setup del entorno (requisitos, clone, npm install, npm start)
- Cómo mostrar las ramas solución

## Iteración 1 — Listado de categorías (~20 min)
### Qué van a construir
### Ciclo TDD esperado
### Puntos clave a remarcar
### Solución de referencia (rama: iteration-1-solution)
### Errores frecuentes

## Iteración 2 — Productos y formateo (~25 min)
...

## Iteración 3 — Navegación y routing (~25 min)
...

## Iteración 4 — Toggle card/list view (~20 min)
...

## Iteración 5 — Modal con dialog nativo (~20 min)
...

## Cierre
- Retrospectiva con asistentes
- Recursos y siguientes pasos
```

### Preguntas a resolver en sesión de planificación

- ¿Dónde vive el documento? ¿`.aiplan/instructor-guide.md` o en raíz como `INSTRUCTOR.md`?
- ¿Nivel de detalle: solo puntos clave o con el código de solución inline?
- ¿Incluye timings orientativos?
- ¿Se escribe en español o inglés?

---

## Orden sugerido de implementación

1. Tests esqueleto en master (impacta código, requiere cascade)
2. Guión del instructor (solo documentación, independiente)