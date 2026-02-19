# Convenciones de Código

## Nombres de directorios

Directorios de componentes y páginas en **kebab-case**, NO PascalCase:
- ✅ `src/components/product-card/`
- ❌ `src/components/ProductCard/`

## Colocation + barrel exports

Cada componente vive en su propio directorio con sus archivos relacionados:

```
src/components/product-card/
├── ProductCard.tsx    # Componente (PascalCase)
├── ProductCard.css    # Estilos
└── index.ts           # Barrel export: export { ProductCard } from './ProductCard'
```

Import limpio: `import { ProductCard } from 'components/product-card'`

## Imports absolutos

Preferir imports absolutos desde `src` sobre relativos con `../`:

```typescript
// ✅ Correcto
import { clickCategory } from 'test/helpers'
import { ProductCard } from 'components/product-card'
import type { Product } from 'types'

// ❌ Evitar
import { clickCategory } from '../../../test/helpers'
```

El proyecto tiene configurado el path alias para que `src` sea la raíz.

## React Router

- **SIEMPRE importar de `react-router-dom`**, nunca de `react-router`
- Patrón: `import { Link, useParams, BrowserRouter, Outlet } from 'react-router-dom'`

## CSS: clases dinámicas

Usar librería `classnames`, nunca template literals:

```typescript
// ✅ Correcto
className={classNames('product-card', {
  'product-card--card': viewMode === 'card',
  'product-card--list': viewMode === 'list',
})}

// ❌ Incorrecto
className={`product-card product-card--${viewMode}`}
```

## CSS: z-index

Usar variables CSS semánticas, nunca valores hardcoded:

```css
/* globals.css */
--z-index-overlay: 100;
--z-index-modal: 200;
```

## Clean code

- Comentarios solo cuando la lógica NO sea obvia — el código debe ser auto-documentado
- Los tests bien escritos no necesitan comentarios
- DRY: extraer componentes/hooks cuando haya duplicación real (no anticipada)

## Estructura de archivos esperada

```
src/
├── components/        # layout/, navigation/, toggle/, product-card/, product-detail/, nutri-score/
├── pages/             # home/, category-detail/, not-found/  (cada una con __tests__/)
├── hooks/             # useCategories.ts, useProducts.ts, useViewMode.ts
├── context/           # ViewModeContext.tsx
├── test/              # helpers.ts, mothers/
├── mocks/             # browser.ts, handlers.ts, server.ts
└── types/             # index.ts
```