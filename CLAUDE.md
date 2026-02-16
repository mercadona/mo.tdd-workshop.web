# Claude Instructions - TDD Workshop Project

## Contexto del Proyecto

Este repositorio es la base para un workshop práctico de TDD (Test-Driven Development) con React. **NO es un proyecto de desarrollo convencional**. Es un ejercicio educativo con una estructura especial de ramas para enseñar TDD de forma progresiva.

**⚠️ IMPORTANTE: Este archivo NO debe estar visible para los asistentes del workshop. Está en `.gitignore`.**

## Flujo de Trabajo Preferido

**Metodología de trabajo incremental:**
- **Proponer antes de modificar**: Esperar confirmación SOLO antes de operaciones de escritura/modificación (crear/editar archivos, instalar dependencias, commits, etc.)
- **Libertad para leer**: NO pedir confirmación para operaciones de lectura (Read, Glob, Grep, git status, git diff, ejecutar tests, etc.)
- **Commits frecuentes**: Crear un commit por cada unidad de trabajo completada
- **Plan y código juntos**: Actualizar el plan (.aiplan/workshop-plan.md) en el MISMO commit que el código implementado, no en commits separados. El plan refleja el estado real del código.
- **Pasos pequeños**: Proponer modificaciones concretas, no múltiples cambios a la vez
- **Retrospectiva al finalizar cada fase**: Después de completar cada fase (Fase 0, Fase 1, etc.), hacer retrospectiva para identificar aprendizajes, fricciones o mejoras a incorporar en CLAUDE.md

Este flujo garantiza control total del usuario sobre el proceso y permite revisión en cada etapa.

## Selección de Modelo

Para optimizar coste y velocidad según el tipo de tarea:

**Usar Opus (`/model opus`):**
- Planificación de iteraciones y fases del workshop
- Diseño arquitectónico y decisiones estructurales
- Análisis complejo de patrones de testing
- Retrospectivas y auditorías de convenciones
- Cuando necesites razonamiento profundo o decisiones estratégicas

**Usar Sonnet (`/model sonnet`):**
- Implementación de código siguiendo planes establecidos
- Ejecución del ciclo TDD (Rojo-Verde-Refactor)
- Refactorización directa con objetivos claros
- Iteraciones rápidas y ajustes

**Nota:** Esta es una guía, no una regla estricta. Si durante la implementación surgen insights que requieren replanificación, es válido usar Opus en cualquier momento.

## Plan de Implementación

Este proyecto sigue un plan detallado de implementación documentado en `.aiplan/workshop-plan.md`.

**IMPORTANTE:**
- Consultar el plan al inicio de cada sesión
- Usar las checkboxes del plan para hacer seguimiento del progreso
- Seguir el orden de las fases y tareas según están definidas
- Actualizar las checkboxes conforme se completan las tareas

El plan define:
- Fase 0: Preparación de la rama `master` (punto de partida)
- Fases 1-5: Creación de las ramas `iteration-X-start` e `iteration-X-solution`
- Verificaciones y tests para cada fase

## Estructura del Workshop

El workshop está diseñado en **5 iteraciones progresivas** siguiendo el ciclo Rojo-Verde-Refactor:

1. **Iteración 1:** Listado de categorías (fetch + custom hook)
2. **Iteración 2:** Listado de productos + formateo nativo (Intl) + Object Mother
3. **Iteración 3:** Navegación y routing + helpers de testing (DSL)
4. **Iteración 4:** Estado global con Context API (Toggle Card/List view)
5. **Iteración 5:** Modal con `<dialog>` nativo

Ver `CONTEXT.md` para el detalle completo de cada iteración.

## Stack Técnico

- **React** 19.x con TypeScript
- **Vite** como bundler
- **Vitest** + React Testing Library para tests
- **MSW** (Mock Service Worker) para mocking de APIs
- **React Router** para navegación
- **Context API** para estado global (sin Redux ni Zustand)
- **APIs Nativas:** `Intl.NumberFormat`, `<dialog>`, etc.

## Estrategia de Ramas

### Rama `master`
- Punto de partida "cocinado" para los asistentes
- Incluye:
  - MSW configurado y levantado
  - Componentes base: `<Navigation />`, `<Toggle />` y `<Layout />` (solo UI, sin lógica)
  - Routing esquelético configurado
  - Todos los estilos CSS (BEM) listos para ambos modos: Card y List
  - Algunos handlers de MSW proporcionados
  - HTML base necesario
  - Campo `description` en los datos de productos del MSW mock
- **NO incluye** el código de las iteraciones

### Ramas de Soluciones
Para cada iteración necesitamos **2 ramas**:

- `iteration-1-start` → Estado inicial para comenzar la iteración 1
- `iteration-1-solution` → Solución completa de la iteración 1

- `iteration-2-start` → Estado inicial (= iteration-1-solution)
- `iteration-2-solution` → Solución completa de la iteración 2

Y así sucesivamente hasta la iteración 5.

**Nomenclatura:**
```
iteration-1-start
iteration-1-solution
iteration-2-start
iteration-2-solution
iteration-3-start
iteration-3-solution
iteration-4-start
iteration-4-solution
iteration-5-start
iteration-5-solution
```

**Flujo de trabajo de ramas (CRÍTICO):**
1. Los asistentes parten de `master`
2. En el workshop mostramos las soluciones desde las ramas `iteration-X-solution`
3. No escribimos código en vivo (no hay tiempo físico)
4. Explicamos la solución ya implementada en cada rama

**Flujo de trabajo para implementación (desarrollo de soluciones):**
1. **SIEMPRE** crear la rama `-solution` ANTES de empezar a escribir código
   ```bash
   git checkout -b iteration-X-solution  # Desde iteration-X-start o desde la solution anterior
   ```
2. **TODO** el trabajo TDD (tests + implementación + refactor) se hace EN la rama `-solution`
3. **NUNCA** modificar master después de completar la Fase 0
4. Master se mantiene limpio como punto de partida para los asistentes
5. Cada rama `-start` es un snapshot limpio (sin código nuevo, solo hereda de soluciones anteriores)

## Prácticas de Código

### Data Fetching
- **Usar async/await** en lugar de Promise.then()
- **No usar try/catch** si no vamos a manejar el error (código más limpio)
- Ejemplo preferido:
  ```typescript
  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch('/api/data')
      const data = await response.json()
      setData(data)
    }
    fetchData()
  }, [])
  ```

### Testing
- **Renderizar siempre `<App />` completo** (no aislar componentes)
- **No usar `data-testid`** → usar roles semánticos y queries accesibles
- **Verificar ejemplos representativos, no todos los datos:**
  - Verificar la cantidad total (ej: `expect(items).toHaveLength(3)`)
  - Verificar 1-2 ejemplos representativos para confirmar el contenido
  - NO verificar todos los items individualmente (no escala, frágil, acoplado a fixtures)
  - Ejemplo:
    ```typescript
    expect(categories).toHaveLength(3)
    expect(screen.getByText('Fruta y verdura')).toBeVisible() // Solo 1 ejemplo
    ```
- **Crear helpers de testing (DSL)** para mejorar legibilidad: `clickCategory()`, `toggleVAT()`, `clickProduct()`
- **Usar patrón Object Mother** para fixtures de datos

### Testing Semántico y Accesibilidad
- **Usar atributos ARIA para vincular elementos relacionados:**
  - Usar `aria-labelledby` en componentes tipo card/article para vincular con su heading
  - Esto mejora tanto la accesibilidad real como la testabilidad
  - Ejemplo:
    ```typescript
    const headingId = `product-heading-${id}`
    <article aria-labelledby={headingId}>
      <h3 id={headingId}>{displayName}</h3>
    </article>
    ```
- **Buscar elementos por su nombre accesible:**
  - Usar `getByRole('article', { name: 'Nombre del producto' })` en lugar de `.closest('article')`
  - NO acoplarse a la estructura HTML con selectores como `.closest()`
  - Ejemplo:
    ```typescript
    const productCard = await screen.findByRole('article', {
      name: 'Aceitunas verdes rellenas de anchoa Hacendado',
    })
    ```
- **Usar `within` para verificar contenido en contexto específico:**
  - Cuando hay múltiples elementos con el mismo texto, usar `within` para especificar contexto
  - NO usar `getAllByText()[0]` como workaround
  - Ejemplo:
    ```typescript
    const productCard = await screen.findByRole('article', { name: 'Producto X' })
    expect(within(productCard).getByText('3,00 €')).toBeVisible()
    ```
- **Evitar non-null assertions en tests:**
  - NO usar `productCard!` - es difícil de leer
  - Buscar elementos por queries semánticas que no requieran assertions

### Clean Code
- **DRY (Don't Repeat Yourself)**: Evitar duplicación de código. Extraer componentes/CSS comunes cuando se detecte repetición (ej: Layout component para estilos de página)
- **Extraer custom hooks** para lógica reutilizable
- **Componentes pequeños y enfocados**
- **No crear helpers prematuros** (esperar al refactor)
- **Preferir APIs nativas** sobre librerías cuando sea posible
- **Comentarios solo cuando sean estrictamente necesarios:**
  - El código debe ser auto-documentado
  - Solo añadir comentarios cuando la lógica NO sea obvia
  - Los tests bien escritos no necesitan comentarios
  - Evitar comentarios que solo repiten lo que el código ya dice

### Refactoring
- El refactor es una fase explícita del ciclo (Rojo-Verde-**Refactor**)
- Solo refactorizar cuando los tests están en verde
- Tests deben seguir pasando después del refactor

## Estructura de Archivos Esperada

```
src/
├── components/
│   ├── Layout/
│   ├── Navigation/
│   ├── Toggle/
│   ├── ProductCard/
│   └── ProductDetail/
├── pages/
│   ├── Home/
│   ├── CategoryDetail/
│   └── NotFound/
├── hooks/
│   ├── useCategories.ts
│   ├── useProducts.ts
│   └── useViewMode.ts
├── context/
│   └── ViewModeContext.tsx
├── test/
│   ├── helpers.ts
│   └── mothers/
│       ├── ProductMother.ts
│       └── CategoryMother.ts
├── mocks/
│   ├── browser.ts
│   ├── handlers.ts
│   └── server.ts
└── types/
    └── index.ts
```

## Handlers de MSW Proporcionados

Los asistentes reciben pre-cocinados (en `master`):
- `GET /categories` → Lista de categorías

Los asistentes deben crear ellos:
- `GET /products` → Lista de productos (Iteración 2)
- `GET /categories/:slug` → Detalle de categoría (Iteración 3)
- `GET /products/:id` → Detalle de producto (Iteración 5)

## Testing User-Oriented vs Implementation Details

### Iteración 4: El ejemplo de Card/List View

Esta iteración enseña una lección importante: **testear lo que el usuario ve, no cómo está implementado**.

#### ❌ MAL - Testing de implementación (detalles internos):
```typescript
it('should toggle view mode', async () => {
  render(<App />);
  const toggle = screen.getByRole('switch');

  // ❌ Testeamos el estado interno del toggle
  expect(toggle).toHaveAttribute('aria-checked', 'false');

  await user.click(toggle);

  // ❌ Testeamos el estado interno nuevamente
  expect(toggle).toHaveAttribute('aria-checked', 'true');

  // ❌ Testeamos las clases CSS
  const productCard = screen.getByTestId('product-card');
  expect(productCard).toHaveClass('product--list');
});
```

**Problemas:**
- Si cambiamos de `<Toggle>` a `<button>`, el test se rompe
- Si cambiamos las clases CSS de `.product--list` a `.product-list-view`, el test se rompe
- Si cambiamos de `aria-checked` a otra forma de indicar estado, el test se rompe
- **Al usuario no le importa nada de esto**, solo le importa lo que ve

#### ✅ BIEN - Testing orientado al usuario (comportamiento visible):
```typescript
it('should display product descriptions when switching to list view', async () => {
  render(<App />);

  // ✅ Verificamos que inicialmente NO hay descripciones visibles
  expect(screen.queryByText(/descripción del producto/i)).not.toBeInTheDocument();

  // ✅ Verificamos el indicador visual del modo actual
  expect(screen.getByText(/vista como tarjeta/i)).toBeVisible();
  // O si usamos icono: expect(screen.getByAltText(/vista como tarjeta/i))

  await toggleViewMode(user);

  // ✅ Ahora SÍ hay descripciones visibles
  expect(screen.getByText(/descripción del producto/i)).toBeVisible();

  // ✅ El indicador cambió
  expect(screen.getByText(/vista como lista/i)).toBeVisible();
});
```

**Ventajas:**
- Podemos refactorizar toda la implementación sin romper el test
- El test documenta lo que el usuario experimenta
- Es más resistente a cambios
- Sigue los principios de Testing Library: "The more your tests resemble the way your users interact with your software, the more confidence they can give you"

## APIs Nativas a Enseñar

### Intl.NumberFormat (Iteración 2)
```typescript
new Intl.NumberFormat('es-ES', {
  style: 'currency',
  currency: 'EUR'
}).format(price)
```

### Dialog nativo (Iteración 5)
```tsx
<dialog ref={dialogRef}>
  {/* contenido */}
</dialog>

// Métodos:
dialogRef.current?.showModal()
dialogRef.current?.close()
```

## Comandos Útiles

```bash
# Desarrollo
npm start

# Tests (watch mode)
npm test

# Tests con coverage
npm test:coverage

# Linting
npm run lint
npm run lint-fix

# Type checking
npm run typecheck

# Build
npm run build
```

## Consideraciones para Implementación

### Al crear las ramas de soluciones:

1. **Iteración 1:**
   - Fetch de categorías en componente
   - Refactor a `useCategories()` hook
   - Test: `should render the list of categories on initial load`

2. **Iteración 2:**
   - Handler MSW para `/products`
   - `<ProductCard />` component
   - Formateo con `Intl.NumberFormat`
   - ProductMother en tests
   - Test: `should display the products with their prices correctly formatted`

3. **Iteración 3:**
   - Handler MSW para `/categories/:slug`
   - Links con React Router
   - Helper `clickCategory()` en tests
   - Test: `should navigate to the category page and display the category title`

4. **Iteración 4:**
   - `ViewModeContext` con Provider
   - Hook `useViewMode()`
   - Integración del `<Toggle />`
   - Campo `description` en los datos de productos
   - Renderizado condicional: modo Card (sin descripción) vs modo List (con descripción)
   - Indicador visual/textual del modo actual en el toggle
   - Helper `toggleViewMode()` en tests
   - Tests: `should display product descriptions when switching to list view` y `should hide product descriptions when switching to card view`
   - **Testing user-oriented:** Verificar presencia/ausencia de descripciones y texto/icono del toggle, NO verificar `aria-checked` o `className`

5. **Iteración 5:**
   - Componente `<ProductDetail />`
   - Elemento `<dialog>` nativo
   - Gestión de apertura/cierre
   - Helper `clickProduct()` en tests
   - Tests: apertura y cierre del dialog

## Notas Importantes

- **No hacer over-engineering:** Solo implementar lo que pide cada test
- **No saltar fases:** Respetar el ciclo Rojo-Verde-Refactor
- **Accesibilidad primero:** Queries por roles, no por `data-testid`
- **Código limpio:** Pero solo después de que funcione (green phase)
- **Tests como documentación:** Los tests deben ser legibles como especificaciones
- **Testing user-oriented (Iteración 4):** Verificar comportamiento visible al usuario (presencia/ausencia de textos, descripciones), NO verificar detalles de implementación (`aria-checked`, `className`, estado interno del toggle)

## Referencias

- CONTEXT.md → Detalle completo de cada iteración y el patrón Object Mother
- package.json → Scripts disponibles
- src/mocks/ → Configuración de MSW
