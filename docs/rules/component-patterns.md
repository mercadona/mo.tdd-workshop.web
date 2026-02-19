# Patrones de Componentes

## Componentes controlados

Los componentes deben ser controlados por el padre mediante estado/props, evitando refs y métodos imperativos.

**❌ Evitar refs y métodos imperativos:**
```typescript
const dialogRef = useRef<HTMLDialogElement>(null)
dialogRef.current?.showModal()
dialogRef.current?.close()
```

**✅ Estado declarativo controlado por el padre:**
```typescript
// Hijo simple y controlado
export const ProductDetail = ({ product, onClose }: Props) => (
  <dialog open>
    <button onClick={onClose}>Cerrar</button>
  </dialog>
)

// Padre controla visibilidad con renderizado condicional
const Parent = () => {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  return (
    <>
      {selectedProduct && (
        <ProductDetail
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </>
  )
}
```

**Excepción:** refs solo para APIs nativas no controlables declarativamente (`focus()`, `scrollIntoView()`).

## Modales y dialogs

1. El padre controla el estado de visibilidad (`useState` para el dato seleccionado)
2. El padre renderiza condicionalmente con `&&` — no pasar prop `open`/`isOpen`
3. El componente hijo recibe solo datos y callbacks
4. Usar `<dialog open>` sin refs (el atributo `open` es estático, el renderizado es condicional)

```typescript
// ❌ NO hacer esto
<ProductDetail product={product} isOpen={isOpen} onClose={...} />

// ✅ Hacer esto
{selectedProduct && <ProductDetail product={selectedProduct} onClose={...} />}
```

**Beneficios:** no requiere mocks en tests (no hay `showModal()` ni `close()`), el dialog no está en el DOM cuando no se usa.

## Data fetching

```typescript
// ✅ async/await sin try/catch (más limpio)
useEffect(() => {
  const fetchData = async () => {
    const response = await fetch('/api/data')
    const data = await response.json()
    setData(data)
  }
  fetchData()
}, [])
```

- Usar **async/await**, nunca `.then()`
- No usar try/catch si no se va a manejar el error

## Verificaciones defensivas

Ser consistente al verificar campos en renderizado condicional:

```typescript
// ✅ Correcto — ambos verificados consistentemente
{isListView && description && <p>{description}</p>}
{isListView && nutriscore && <NutriScore score={nutriscore} />}

// ❌ Inconsistente
{isListView && description && <p>{description}</p>}
{isListView && <NutriScore score={nutriscore} />}
```

## Refactoring

- Solo refactorizar cuando los tests están en verde
- NO preoptimizar: refactorizar solo cuando hay duplicación REAL
- **Regla de tres:** considera extraer cuando la misma lógica aparece 2-3 veces, no antes