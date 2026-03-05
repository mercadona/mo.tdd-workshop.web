# Estrategia de Ramas

## Ramas del proyecto

| Rama | Propósito | Visible para asistentes |
|------|-----------|------------------------|
| `master` | Punto de partida del workshop — código limpio sin instrucciones | Sí |
| `instructor` | Rama de trabajo: contiene `CLAUDE.md`, `.claude/`, `INSTRUCTOR.md`, `.aiplan/` | No |
| `iteration-X-solution` | Soluciones de referencia acumulativas | Solo si el instructor lo muestra |

**⚠️ Trabajar siempre desde `instructor`**, no desde `master`. Las instrucciones para Claude solo existen en esta rama.

## Flujo de trabajo (CRÍTICO)

1. **SIEMPRE** trabajar en la rama `instructor` al interactuar con Claude
2. Los cambios de código base van en `master` y se propagan por cascade
3. Los cambios a `INSTRUCTOR.md`, `.aiplan/` o `.claude/` van solo en `instructor`
4. `master` solo recibe cambios de código — nunca archivos de instrucciones

## Nomenclatura de ramas solución

```
iteration-1-solution
iteration-2-solution
iteration-3-solution
iteration-4-solution
iteration-5-solution
```

## Cascade merge (propagar cambios de master)

Cuando se hacen cambios en master, propagar en orden lineal:
`master → instructor → iter-1-solution → iter-2-solution → iter-3-solution → iter-4-solution → iter-5-solution`

**Antes de empezar:** crear backup tags:
```bash
for branch in instructor iteration-{1..5}-solution; do
  git tag backup/$branch $branch
done
```

**En cada paso:**
```bash
git checkout <rama-destino>
git merge <rama-origen>
# resolver conflictos según lo esperado
npm test -- --run  # verificar antes de commitear
git add <archivos-resueltos> && git commit
```

**Regla al resolver conflictos en cascade:**
- `NutriScore.tsx`: siempre tomar versión de master (aria-label, sin showLabel)
- `ProductCard.tsx` en iter-2+: versión dinámica pero SIN NutriScore en card view
- `Home.test.tsx`: mantener tests reales de la iteración + it.todo de iteraciones futuras
- `CategoryDetail.test.tsx`: mantener tests reales + it.todo de iter-5 hasta iter-3-solution

**Verificar tras el cascade completo:**
```bash
for branch in master iteration-{1..5}-solution; do
  git checkout $branch -q
  npm test -- --run 2>&1 | grep "Tests"
done
```