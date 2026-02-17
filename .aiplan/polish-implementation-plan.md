# Plan: Pulimento Visual - TDD Workshop

## Contexto

El workshop está funcionalmente completo (5 iteraciones, 12 tests, todas las ramas creadas). Sin embargo, la experiencia visual necesita pulimento: el header es un bloque verde sólido, los productos no se muestran en grid (class mismatch), el modal no flota (backdrop no funciona con `<dialog open>`), el nutriscore es difícil de leer, y no hay indicador de categoría activa.

Este plan aborda los **bugs de CSS/clases** y las **mejoras visuales** necesarias para que el workshop tenga un aspecto profesional.

---

## Problemas Detectados

| Problema | Causa raíz | Primera rama afectada |
|----------|-----------|----------------------|
| Header verde sólido | Navigation.css: `background-color: var(--color-primary)` | master |
| Links de nav sin estilo | `<ul>` sin className, CSS sin reglas | master (desde iter-1) |
| Productos sin grid (Home) | `className="products-grid"` pero CSS define `.home__products-grid`; Home.css no importado | iteration-2-solution |
| Productos sin grid (CategoryDetail) | `className="category-detail__products"` pero CSS define `.category-detail__products-grid` | iteration-3-solution |
| Sin indicador de categoría activa | No hay `aria-current` ni clase activa en nav links | iteration-3-solution |
| Nutriscore ilegible | Texto "Nutriscore: D" en badge de 28x28px | iteration-4-solution |
| Modal sin overlay | `<dialog open>` no activa `::backdrop` (solo `.showModal()` lo hace) | iteration-5-solution |
| ProductDetail.css no importado | Falta `import` en ProductDetail.tsx | iteration-5-solution |

---

## Estrategia de Propagación

```
master (CSS puro) → merge cascade lineal por todas las ramas
                     + fixes de componentes en cada rama afectada
```

1. Cambios CSS en master (se propagan limpios porque los `.css` no se modifican en ramas solution)
2. Merge master → iteration-1-solution + añadir classNames a Navigation.tsx
3. Cascade forward fijando código de componentes en cada rama donde aparece el bug

---

## Fase P0: Cambios CSS en `master`

> Solo CSS, sin cambios de componentes. Se propagan limpiamente a todas las ramas.

### P0.1 Header y Navigation CSS
- [x] `Navigation.css`: Cambiar fondo verde a blanco con sombra
  - `background-color: var(--color-white)` + `border-bottom: 1px solid var(--color-border)` + `box-shadow: var(--shadow-sm)`
  - Título: `color: var(--color-primary)` (verde Mercadona para branding)
- [x] `Navigation.css`: Añadir estilos para links de categoría
  - `.navigation__list` (flex row, gap, align-items)
  - `.navigation__list-item` (inline)
  - `.navigation__link` (pill style, border, hover, transition)
  - `.navigation__link--active` (fondo primario, texto blanco)

### P0.2 Nutriscore CSS
- [x] `ProductCard.css`: Cambiar `.product-card__nutriscore` de 28x28 square a pill auto-width
  - `width: auto; height: auto; padding: var(--spacing-xs) var(--spacing-sm);`
  - Así "Nutriscore: D" se lee bien sin cambiar tests

### P0.3 ProductDetail overlay CSS
- [x] `ProductDetail.css`: Reemplazar `::backdrop` (código muerto) con `.product-detail__overlay`
  - `.product-detail__overlay`: `position: fixed; inset: 0; background: rgba(0,0,0,0.6); backdrop-filter: blur(4px); display: flex; align-items: center; justify-content: center; z-index: 1000;`
  - `.product-detail`: `position: relative;` (centrado por overlay, sin fixed propio)

### P0.4 Verificación
- [x] `npm test` en master (tests existentes siguen pasando)
- [x] `npm run typecheck` + `npm run lint`
- [x] Commit y push

**Archivos modificados:**
- `src/components/navigation/Navigation.css`
- `src/components/product-card/ProductCard.css`
- `src/components/product-detail/ProductDetail.css`

---

## Fase P1: Merge a `iteration-1-solution` + Nav classNames

### P1.1 Merge
- [x] `git checkout iteration-1-solution && git merge master`
- [x] Resolver conflictos si los hay (CSS merge debería ser limpio)

### P1.2 Fix Navigation.tsx (classNames BEM)
- [x] Añadir classNames a la lista de categorías:
  ```tsx
  <ul className="navigation__list">
    <li className="navigation__list-item">
      <Link className="navigation__link" to={...}>{...}</Link>
    </li>
  </ul>
  ```

### P1.3 Verificación
- [x] `npm test` → tests pasan
- [x] Commit y push

**Archivos modificados:** `src/components/navigation/Navigation.tsx`

---

## Fase P2: Cascade a `iteration-2-solution` + Fix Home grid

### P2.1 Merge cascade
- [x] `git checkout iteration-2-start && git merge iteration-1-solution`
- [x] Push iteration-2-start
- [x] `git checkout iteration-2-solution && git merge iteration-2-start`

### P2.2 Fix Home.tsx
- [x] Añadir `import './Home.css'`
- [x] Cambiar `className="products-grid"` a `className="home__products-grid"`

### P2.3 Verificación
- [x] `npm test` → tests pasan
- [x] Commit y push

**Archivos modificados:** `src/pages/home/Home.tsx`

---

## Fase P3: Cascade a `iteration-3-solution` + Fix CategoryDetail + Active Nav

### P3.1 Merge cascade
- [x] `git checkout iteration-3-start && git merge iteration-2-solution`
- [x] Push iteration-3-start
- [x] `git checkout iteration-3-solution && git merge iteration-3-start`

### P3.2 Fix CategoryDetail grid
- [x] `CategoryDetail.tsx`: Cambiar `className="category-detail__products"` a `className="category-detail__products-grid"`

### P3.3 Active category indicator (TDD)
- [x] **Test (ROJO)** en `CategoryDetail.test.tsx`:
  ```typescript
  it('should highlight the active category in the navigation', async () => {
    const user = userEvent.setup()
    render(<App />)
    await clickCategory(user, 'Fruta y verdura')

    const activeLink = screen.getByRole('link', { name: 'Fruta y verdura', current: 'page' })
    expect(activeLink).toBeVisible()
  })
  ```
- [x] **Implementación (VERDE)** en `Navigation.tsx`:
  - Reemplazar `<Link>` por `<NavLink>` de react-router-dom
  - Usar función de className para aplicar `navigation__link--active`:
    ```tsx
    <NavLink
      to={`/categories/${category.slug}`}
      className={({ isActive }) =>
        classNames('navigation__link', { 'navigation__link--active': isActive })
      }
    >
    ```
  - `NavLink` añade `aria-current="page"` automáticamente cuando está activo

### P3.4 Verificación
- [x] `npm test` → todos los tests pasan (incluido el nuevo)
- [x] `npm run typecheck` + `npm run lint`
- [x] Commit y push

**Archivos modificados:**
- `src/pages/category-detail/CategoryDetail.tsx`
- `src/components/navigation/Navigation.tsx` (NavLink + classNames)
- `src/pages/category-detail/__tests__/CategoryDetail.test.tsx` (nuevo test)

---

## Fase P4: Cascade a `iteration-4-solution`

### P4.1 Merge cascade
- [x] `git checkout iteration-4-start && git merge iteration-3-solution`
- [x] Push iteration-4-start
- [x] `git checkout iteration-4-solution && git merge iteration-4-start`

### P4.2 Verificación
- [x] `npm test` → todos los tests pasan
- [x] Nutriscore debería verse correctamente con el CSS pill (propagado desde master)
- [x] Commit y push si hubo merge

**Nota:** No se requieren cambios de componentes en esta fase. El CSS del nutriscore ya se propagó desde master.

---

## Fase P5: Cascade a `iteration-5-solution` + Fix Modal/Dialog

### P5.1 Merge cascade
- [x] `git checkout iteration-5-start && git merge iteration-4-solution`
- [x] Push iteration-5-start
- [x] `git checkout iteration-5-solution && git merge iteration-5-start`

### P5.2 Fix ProductDetail: CSS import + overlay
- [x] Añadir import del CSS: `import './ProductDetail.css'`
- [x] Envolver dialog en overlay div:
  ```tsx
  <>
    <div className="product-detail__overlay" onClick={onClose} />
    <dialog open className="product-detail">
      <div className="product-detail__content">...</div>
    </dialog>
  </>
  ```
  Esto mantiene el patrón de `<dialog open>` sin refs, y el overlay proporciona el fondo oscuro + centrado.
- [x] Reorganizar estructura: mover ProductDetail.tsx e index.ts a product-detail/ (colocation)

### P5.3 Verificación final
- [x] `npm test` → 12/12 tests pasan (+ el nuevo de active = 13 total)
- [x] `npm run typecheck` + `npm run lint`
- [ ] `npm start` → verificación visual de TODAS las mejoras
- [x] Commit y push

**Archivos modificados:**
- `src/components/product-detail/ProductDetail.tsx` (movido y actualizado)
- `src/components/product-detail/index.ts` (movido)
- `src/pages/home/Home.tsx` (imports actualizados)
- `src/pages/category-detail/CategoryDetail.tsx` (imports actualizados)

---

## Fase P6: Retrospectiva y verificación global

### P6.1 Verificación end-to-end
- [ ] Recorrer TODAS las ramas `-solution` verificando tests + visual
- [ ] Recorrer TODAS las ramas `-start` verificando que NO contienen tests/código de su iteración

### P6.2 Retrospectiva
- [ ] Identificar aprendizajes de la sesión
- [ ] Actualizar CLAUDE.md si procede
- [ ] Actualizar polish-plan.md con checkboxes completados

---

## Fuera de alcance (diferido)

| Item | Motivo |
|------|--------|
| Logo Mercadona | Requiere asset (SVG/imagen); decisión pendiente |
| Guión del instructor | Tarea de documentación independiente |
| Tests como guía en ramas `-start` | Decisión pedagógica pendiente |
| `data-discover` attribute | Baja prioridad, probablemente atributo interno de React Router |

---

## Resumen de archivos clave

| Archivo | Fase | Cambio |
|---------|------|--------|
| `src/components/navigation/Navigation.css` | P0 | Header blanco, estilos nav links, active state |
| `src/components/product-card/ProductCard.css` | P0 | Nutriscore pill |
| `src/components/product-detail/ProductDetail.css` | P0 | Overlay + dialog positioning |
| `src/components/navigation/Navigation.tsx` | P1, P3 | BEM classNames (P1), NavLink + active (P3) |
| `src/pages/home/Home.tsx` | P2 | Import CSS + fix grid className |
| `src/pages/category-detail/CategoryDetail.tsx` | P3 | Fix grid className |
| `src/pages/category-detail/__tests__/CategoryDetail.test.tsx` | P3 | Test active category |
| `src/components/ProductDetail/ProductDetail.tsx` | P5 | Import CSS + overlay wrapper |
