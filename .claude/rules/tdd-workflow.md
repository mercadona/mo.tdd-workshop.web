# TDD Estricto

## Principio fundamental: NO anticipar código que no pide ningún test

- **Incrementalidad:** Implementar solo lo que el test actual requiere
- **Orden correcto:**
  1. Test del caso feliz → implementación mínima
  2. Test del caso de error → añadir manejo del error
- **Regla de oro:** Si no hay un test rojo que lo requiera, no lo implementes todavía

## Ejemplo de incrementalidad extrema

**❌ Incorrecto** — implementar todo de una vez:
```typescript
export const ProductDetail = ({ product, onClose }: Props) => {
  const dialogRef = useRef<HTMLDialogElement>(null)
  useEffect(() => { if (product) dialogRef.current?.showModal() }, [product])
  // ...
}
```

**✅ Correcto** — ciclo por ciclo:

Ciclo 1 - Test: "should show product details"
```typescript
export const ProductDetail = ({ product }: Props) => (
  <dialog open>
    <h2>{product.displayName}</h2>
    <p>{product.price}</p>
  </dialog>
)
```

Ciclo 2 - Test: "should close dialog when clicking button"
```typescript
export const ProductDetail = ({ product, onClose }: Props) => (
  <dialog open>
    <button onClick={onClose}>Cerrar</button>
    <h2>{product.displayName}</h2>
    <p>{product.price}</p>
  </dialog>
)
```

**NO añadir props, callbacks o lógica que "vas a necesitar luego". Espera a que un test lo requiera.**

## Notas importantes

- No hacer over-engineering: solo implementar lo que pide cada test
- No saltar fases: respetar el ciclo Rojo-Verde-Refactor
- Código limpio solo después de que funcione (green phase)
- Los tests son la especificación — deben ser legibles como documentación