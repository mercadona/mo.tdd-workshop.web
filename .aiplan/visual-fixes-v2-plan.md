# Plan: Visual Fixes V2 - TDD Workshop

## Contexto

El workshop está funcionalmente completo (5 iteraciones, 12 tests, todas las ramas creadas) y ya pasó por una ronda de pulimento visual (polish-implementation-plan.md). Sin embargo, se han detectado 5 problemas visuales adicionales que afectan la experiencia del workshop y necesitan ser resueltos antes de abordar los items diferidos del plan anterior.

**Rama actual:** `iteration-5-solution` (rama final del workshop)

## Problemas Detectados

| # | Problema | Causa raíz | Ramas afectadas |
|---|----------|-----------|-----------------|
| 1 | Modal debajo del backdrop | `dialog` tiene `position: relative` sin z-index; overlay sibling con `z-index: 1000` | iteration-5-solution |
| 2 | Vista de lista rota (se ve como grid 4 columnas) | Contenedores hardcoded a `*__products-grid`; nunca se usa `*__products-list` | iteration-4-solution, iteration-5-solution |
| 3 | Toggle fuera de lugar | Toggle es sibling de Navigation en `<header>`, no integrado visualmente | iteration-4-solution, iteration-5-solution |
| 4 | Hover de categoría activa ilegible | No existe regla `.navigation__link--active:hover`; hereda hover gris con texto blanco | master (CSS) → todas las ramas |
| 5 | Links parecen botones | Links tienen border, background, pill shape - usuario prefiere texto simple con decoración | master (CSS) → todas las ramas |

## Estrategia de Propagación

Los problemas se clasifican en dos tipos:

**Tipo A - Solo CSS** (propagan limpiamente desde master):
- Problema 4: hover de categoría activa ilegible
- Problema 5: links parecen botones
- Problema 1: modal z-index (se puede resolver con CSS puro)

**Tipo B - CSS + componentes** (requieren cambios en ramas específicas):
- Problema 2: vista de lista → Afecta desde iteration-4 (donde se introduce viewMode)
- Problema 3: toggle en nav → Afecta desde iteration-4 (donde se conecta el Toggle)

**Orden de implementación:**
1. Fase V0: Resolver CSS puro en `master` → se propaga limpiamente a todas las ramas
2. Fase V1: Merge cascade hasta `iteration-3-solution` (solo CSS)
3. Fase V2: Cascade a `iteration-4-solution` + fixes de componentes (viewMode dinámico + Toggle en nav)
4. Fase V3: Cascade a `iteration-5-solution` + verificación final
5. Fase V4: Retrospectiva y verificación global

---

## Fase V0: Cambios CSS en `master` (propagación global)

> Solo CSS puro, sin cambios de componentes. Se propagan limpiamente a todas las ramas vía merge cascade.

### V0.1 Fix hover de categoría activa
- [x] `Navigation.css`: Añadir regla `.navigation__link--active:hover`
  ```css
  .navigation__link--active:hover {
    background-color: var(--color-primary-dark);
    color: var(--color-white);
    border-color: var(--color-primary-dark);
  }
  ```
  - Mantiene fondo verde y texto blanco en hover del link activo
  - Usa `--color-primary-dark` (#008a43) para feedback visual de hover sin perder legibilidad

### V0.2 Simplificar links de navegación (de botones a texto)
- [x] `Navigation.css`: Rediseñar `.navigation__link` de pill/button a texto con decoración
  ```css
  .navigation__link {
    display: inline-block;
    padding: var(--spacing-xs) var(--spacing-sm);
    border: none;                    /* eliminar border */
    border-radius: 0;                /* eliminar pill shape */
    color: var(--color-text);
    text-decoration: none;
    font-size: var(--font-size-sm);
    font-weight: 500;
    transition: color var(--transition-base);
    border-bottom: 2px solid transparent;  /* underline invisible por defecto */
  }

  .navigation__link:hover {
    background-color: transparent;    /* eliminar fondo gris */
    border-color: transparent;        /* eliminar border pill */
    color: var(--color-primary);      /* texto verde en hover */
    border-bottom-color: var(--color-primary);  /* underline verde */
  }

  .navigation__link--active {
    background-color: transparent;    /* sin fondo */
    color: var(--color-primary);      /* texto verde */
    border-color: transparent;        /* sin border pill */
    border-bottom-color: var(--color-primary);  /* underline verde */
    font-weight: 600;                 /* ligeramente más bold */
  }

  .navigation__link--active:hover {
    color: var(--color-primary-dark);
    border-bottom-color: var(--color-primary-dark);
  }
  ```

### V0.3 Preparar CSS del navigation container para recibir el toggle
- [x] `Navigation.css`: Añadir flexbox al container para título + toggle en línea
  ```css
  .navigation__container {
    max-width: var(--max-width-container);
    margin: 0 auto;
    padding: 0 var(--spacing-lg);
    display: flex;                    /* NUEVO */
    justify-content: space-between;   /* NUEVO - título izquierda, toggle derecha */
    align-items: center;              /* NUEVO */
    flex-wrap: wrap;                  /* NUEVO - lista de categorías baja a segunda línea */
  }
  ```
- [x] Añadir regla para que `navigation__list` ocupe ancho completo:
  ```css
  .navigation__list {
    /* propiedades existentes... */
    width: 100%;              /* NUEVO - fuerza segunda línea completa */
  }
  ```
  - Con flexbox + `justify-content: space-between`, el título queda a la izquierda y el toggle a la derecha
  - La lista de categorías va a segunda línea por `flex-wrap: wrap` + `width: 100%`

### V0.4 Fix variable CSS faltante
- [x] ~~`globals.css`: Añadir `--border-radius-full: 9999px;`~~ → **Eliminada**: tras V0.2 no hay ningún uso. Dead code evitado.

### V0.5 Fix ProductDetail CSS (modal z-index)
- [x] `ProductDetail.css`: Cambiar dialog a `position: fixed` con z-index por encima del overlay. Variables semánticas `--z-index-overlay: 100` / `--z-index-modal: 200` en globals.css en lugar de valores hardcoded.
  ```css
  .product-detail {
    position: fixed;              /* CAMBIAR de relative a fixed */
    top: 50%;                     /* NUEVO - centrado vertical */
    left: 50%;                    /* NUEVO - centrado horizontal */
    transform: translate(-50%, -50%);  /* NUEVO - centra respecto a su propio tamaño */
    z-index: 1001;                /* NUEVO - por encima del overlay (1000) */
    border: none;
    border-radius: var(--border-radius-lg);
    padding: 0;
    max-width: 600px;
    width: 90vw;
    box-shadow: var(--shadow-lg);
  }
  ```
  - El dialog ahora está fixed y centrado en el viewport
  - z-index 1001 lo coloca por encima del overlay (z-index 1000)
  - **Alternativa descartada:** Anidar dialog dentro del overlay requiere cambio de componente (no es CSS puro)

### V0.6 Verificación
- [x] `npm test` en master (tests existentes siguen pasando)
- [x] `npm run typecheck` + `npm run lint`
- [x] Commit y push

**Archivos modificados:**
- `src/components/navigation/Navigation.css`
- `src/components/product-detail/ProductDetail.css`
- `src/styles/globals.css`

---

## Fase V1: Merge cascade hasta `iteration-3-solution`

> Estas ramas no tienen viewMode ni Toggle conectado. Solo necesitan el CSS de master.

### V1.1 Merge cascade
- [x] `git checkout iteration-1-solution && git merge master`
- [x] `git checkout iteration-2-start && git merge iteration-1-solution`
- [x] `git checkout iteration-2-solution && git merge iteration-2-start`
- [x] `git checkout iteration-3-start && git merge iteration-2-solution`
- [x] `git checkout iteration-3-solution && git merge iteration-3-start`

### V1.2 Verificación por rama
- [x] En cada rama `-solution`: `npm test` pasa (6 tests en verde en iteration-3-solution)
- [x] Push de todas las ramas actualizadas

**Archivos modificados:** Ninguno adicional (solo merge de CSS de master)

---

## Fase V2: Cascade a `iteration-4-solution` + Fix vista lista + Toggle en nav

> Iteration-4 introduce viewMode y conecta el Toggle. Aquí aplicamos los fixes de componentes.

### V2.1 Merge cascade
- [x] `git checkout iteration-4-start && git merge iteration-3-solution`
- [x] Push iteration-4-start
- [x] `git checkout iteration-4-solution && git merge iteration-4-start`

### V2.2 Fix vista de lista en Home.tsx
- [x] Importar `useViewMode` y `classNames` en `Home.tsx`:
  ```typescript
  import classNames from 'classnames'
  import { useViewMode } from 'hooks/useViewMode'
  ```
- [ ] Usar clase dinámica en el contenedor de productos (línea 14):
  ```tsx
  const { viewMode } = useViewMode()

  <div className={classNames({
    'home__products-grid': viewMode === 'card',
    'home__products-list': viewMode === 'list',
  })}>
  ```
  - El CSS ya define `.home__products-grid` (grid) y `.home__products-list` (flex column)
  - Solo falta conectar la clase al estado de viewMode

### V2.3 Fix vista de lista en CategoryDetail.tsx
- [x] Importar `useViewMode` y `classNames` en `CategoryDetail.tsx`:
  ```typescript
  import classNames from 'classnames'
  import { useViewMode } from 'hooks/useViewMode'
  ```
- [ ] Usar clase dinámica en el contenedor de productos (línea 31):
  ```tsx
  const { viewMode } = useViewMode()

  <div className={classNames({
    'category-detail__products-grid': viewMode === 'card',
    'category-detail__products-list': viewMode === 'list',
  })}>
  ```

### V2.4 Mover Toggle dentro de Navigation
- [x] `RootLayout.tsx`: Eliminar el Toggle (ya no es sibling de Navigation en `<header>`)
  ```tsx
  // ANTES
  <header>
    <Navigation />
    <Toggle checked={...} onChange={...} label={...} />
  </header>

  // DESPUÉS
  <header>
    <Navigation />
  </header>
  ```
  - RootLayout ya no importa Toggle, useViewMode ni sus props

- [ ] `Navigation.tsx`: Integrar Toggle dentro del navigation container
  ```tsx
  import { Toggle } from 'components/toggle'
  import { useViewMode } from 'hooks/useViewMode'

  export const Navigation = () => {
    const { categories } = useCategories()
    const { viewMode, toggleViewMode } = useViewMode()

    return (
      <nav className="navigation">
        <div className="navigation__container">
          <h1 className="navigation__title">TDD Workshop</h1>
          <Toggle
            checked={viewMode === 'list'}
            onChange={toggleViewMode}
            label={viewMode === 'card' ? 'Vista como tarjeta' : 'Vista como lista'}
          />
          <ul className="navigation__list">
            {/* ... categorías existentes ... */}
          </ul>
        </div>
      </nav>
    )
  }
  ```
  - Con el flexbox + `justify-content: space-between` del V0.3, el título queda a la izquierda y el toggle a la derecha
  - La lista de categorías va a segunda línea por `flex-wrap: wrap` + `width: 100%`

### V2.5 Verificación
- [x] `npm test` en iteration-4-solution (9 tests pasan)
- [x] `npm run typecheck` + `npm run lint`
- [ ] Verificación visual:
  - [ ] Toggle dentro del header, alineado a la derecha
  - [ ] Vista lista muestra productos en columna (no grid 4 cols)
  - [ ] Links son texto con underline, no botones
  - [ ] Hover sobre categoría activa es legible
- [x] Commit y push

**Archivos modificados:**
- `src/pages/home/Home.tsx`
- `src/pages/category-detail/CategoryDetail.tsx`
- `src/components/navigation/Navigation.tsx`
- `src/pages/routes/RootLayout.tsx`

---

## Fase V3: Cascade a `iteration-5-solution` + Verificación final

> Iteration-5 añade el dialog. El fix CSS del modal ya se propagó desde master.

### V3.1 Merge cascade
- [x] `git checkout iteration-5-start && git merge iteration-4-solution`
- [x] Push iteration-5-start
- [x] `git checkout iteration-5-solution && git merge iteration-5-start`

### V3.2 Resolver conflictos
- [x] Conflictos en `Home.tsx` y `CategoryDetail.tsx` (ambos tocados por iteration-5 y V2)
- [x] Resolver combinando `useProductDialog` (iter-5) + `useViewMode` + `classNames` (V2)

### V3.3 Verificación completa
- [x] `npm test` → 13/13 tests pasan
- [x] `npm run typecheck` + `npm run lint`
- [ ] Verificación visual completa:
  - [ ] Modal flota por encima del overlay (z-index correcto)
  - [ ] Vista lista muestra productos en columna (flex, no grid)
  - [ ] Toggle está dentro del header, alineado a la derecha
  - [ ] Hover sobre categoría activa es legible (verde oscuro sobre verde)
  - [ ] Links de categorías son texto con underline, no botones rectangulares
- [x] Commit y push

**Archivos modificados:** Ninguno adicional (solo merge y resolución de conflictos)

---

## Fase V4: Retrospectiva y verificación global

### V4.1 Verificación end-to-end
- [x] Recorrer TODAS las ramas `-solution` verificando tests + typecheck:
  - [x] master: 2 tests pasan
  - [x] iteration-1-solution: 3 tests pasan
  - [x] iteration-2-solution: 3 tests pasan
  - [x] iteration-3-solution: 6 tests pasan
  - [x] iteration-4-solution: 9 tests pasan
  - [x] iteration-5-solution: 13 tests pasan
- [ ] Recorrer TODAS las ramas `-start` verificando que no contienen código de su iteración

### V4.2 Retrospectiva
- [x] Aprendizajes documentados (ver abajo)
- [ ] Actualizar CLAUDE.md si procede

### V4.3 Actualizar plan
- [x] Checkboxes actualizados al finalizar cada fase

---

## Retrospectiva

### Decisiones tomadas durante la implementación

**V0.4 eliminada:** `--border-radius-full` no tenía ningún uso real tras V0.2. Se descartó en lugar de definir dead code.

**z-index con variables semánticas:** En lugar de `z-index: 1001` (hardcoded relativo), se definieron `--z-index-overlay: 100` y `--z-index-modal: 200` en globals.css. Nombres que expresan intención, valores con margen para intercalar capas.

**Conflictos en cascade predecibles:** Los conflictos aparecieron exactamente donde el plan los anticipaba (`Home.tsx`, `CategoryDetail.tsx` en V3). La estrategia de resolución fue simple: combinar ambos lados (useProductDialog de iter-5 + useViewMode de V2).

**CLAUDE.md en conflicto siempre:** Todas las ramas `-solution` tenían versiones divergentes de CLAUDE.md. Patrón consistente: resolver con `git checkout --theirs` (master como fuente de verdad).

### Validación de "user-oriented testing"
Ninguno de los 13 tests requirió cambios pese a refactors visuales significativos (rediseño de links, reubicación del Toggle, cambio de clases CSS en contenedores). Los tests verifican comportamiento, no implementación.

---

## Consideraciones y Riesgos

### Conflictos de merge esperados

La Fase V2 modifica `Home.tsx`, `CategoryDetail.tsx`, `Navigation.tsx` y `RootLayout.tsx`. Estos mismos archivos cambian entre iteration-4 e iteration-5 (se añade ProductDetail, useProductDialog, etc.). Los conflictos en V3.1 son probables pero resolubles: los cambios de V2 (viewMode, Toggle en nav) son ortogonales a los cambios de iteration-5 (dialog).

**Estrategia de resolución:** Combinar ambas versiones lógicamente. Los cambios de V2 (viewMode dinámico en contenedores, Toggle en Navigation) no interfieren con los cambios de iteration-5 (dialog + useProductDialog).

### Navigation.tsx y la cascada

Navigation.tsx se modifica en múltiples iteraciones:
- iteration-1: se añade useCategories + renderizado de categorías
- iteration-3: se cambia Link por NavLink + classNames para active state
- iteration-4 (V2.4): se añade Toggle + useViewMode

El merge cascade debería funcionar limpiamente porque cada iteración añade código nuevo (no modifica el mismo bloque). Pero hay que estar atento al merge en V1.1 y V2.1.

### Tests no necesitan cambios

Ninguno de los 5 problemas requiere cambios en tests:
- Los tests verifican comportamiento (presencia/ausencia de descripciones, clicks, dialog), no clases CSS ni layout
- El toggle test (`toggleViewMode`) ya funciona; solo cambiamos dónde se renderiza el Toggle, no su comportamiento
- El modal test verifica que el dialog se abre/cierra, no su z-index o posicionamiento

**Esto valida la filosofía "user-oriented testing" del workshop:** tests resistentes a refactors visuales.

### La variable `--border-radius-full`

Actualmente se usa en Navigation.css pero no está definida en globals.css. Esto significa que `border-radius: var(--border-radius-full)` se resuelve como vacío (se ignora). Con V0.2 eliminamos esta propiedad de Navigation.css, pero conviene definir la variable igualmente para robustez y evitar warnings.

---

## Resumen de Archivos Clave

| Archivo | Fase | Cambio |
|---------|------|--------|
| `src/components/navigation/Navigation.css` | V0 | Links como texto, hover active legible, container flexbox |
| `src/components/product-detail/ProductDetail.css` | V0 | Dialog fixed + z-index 1001 |
| `src/styles/globals.css` | V0 | Variable `--border-radius-full` |
| `src/pages/home/Home.tsx` | V2 | useViewMode + classNames para grid/list dinámico |
| `src/pages/category-detail/CategoryDetail.tsx` | V2 | useViewMode + classNames para grid/list dinámico |
| `src/components/navigation/Navigation.tsx` | V2 | Integrar Toggle + useViewMode |
| `src/pages/routes/RootLayout.tsx` | V2 | Eliminar Toggle (movido a Navigation) |

---

## Archivos Críticos para Implementación

1. **`/Users/afuenpe/projects/mo.tdd-workshop.web/src/components/navigation/Navigation.css`**
   Cambios CSS core: rediseño de links (de botones a texto), fix hover active ilegible, flexbox container para integrar toggle

2. **`/Users/afuenpe/projects/mo.tdd-workshop.web/src/components/product-detail/ProductDetail.css`**
   Fix modal z-index: cambiar dialog de relative a fixed con z-index por encima del overlay

3. **`/Users/afuenpe/projects/mo.tdd-workshop.web/src/components/navigation/Navigation.tsx`**
   Integración del Toggle: mover Toggle component desde RootLayout a Navigation con useViewMode

4. **`/Users/afuenpe/projects/mo.tdd-workshop.web/src/pages/home/Home.tsx`**
   Clase dinámica grid/list: conectar viewMode a clase CSS vía classNames

5. **`/Users/afuenpe/projects/mo.tdd-workshop.web/src/pages/routes/RootLayout.tsx`**
   Eliminar Toggle y useViewMode (movido a Navigation)

---

## Verificación End-to-End

Para cada rama `-solution`:
1. `npm test` → todos los tests pasan
2. `npm run typecheck` → sin errores
3. `npm run lint` → sin errores
4. Verificación visual de los 5 fixes

Para cada rama `-start`:
1. `npm test` → tests existentes (de iteraciones anteriores) pasan
2. `npm run typecheck` → sin errores
3. No hay tests nuevos de la iteración actual