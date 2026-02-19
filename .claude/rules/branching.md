# Estrategia de Ramas

## Flujo de trabajo (CRÍTICO)

1. **SIEMPRE** crear la rama `-solution` ANTES de escribir código:
   ```bash
   git checkout -b iteration-X-solution
   ```
2. **TODO** el trabajo TDD va en la rama `-solution`
3. **NUNCA** modificar master después de la Fase 0
4. Master se mantiene limpio como punto de partida para los asistentes
5. Cada rama `-start` es un snapshot limpio (hereda de la solution anterior)

## Nomenclatura

```
iteration-1-start / iteration-1-solution
iteration-2-start / iteration-2-solution
iteration-3-start / iteration-3-solution
iteration-4-start / iteration-4-solution
iteration-5-start / iteration-5-solution
```

## Cascade merge (propagar cambios de master a todas las ramas)

Cuando se hacen cambios en master, propagar en orden lineal:
`master → iter-1-start → iter-1-solution → iter-2-start → ... → iter-5-solution`

**Antes de empezar:** crear backup tags:
```bash
for branch in iteration-{1..5}-{start,solution}; do
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
for branch in master iteration-{1..5}-{start,solution}; do
  git checkout $branch -q
  npm test -- --run 2>&1 | grep "Tests"
done
```