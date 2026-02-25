# Claude Instructions - TDD Workshop Project

## Contexto del Proyecto

Este repositorio es la base para un workshop práctico de TDD con React. **NO es un proyecto de desarrollo convencional** — es un ejercicio educativo con una estructura especial de ramas para enseñar TDD de forma progresiva.

**⚠️ IMPORTANTE: Este archivo NO debe estar visible para los asistentes del workshop. Está en `.gitignore`.**

## Flujo de Trabajo Preferido

- **Proponer antes de modificar:** esperar confirmación solo antes de escritura/modificación
- **Libertad para leer:** NO pedir confirmación para Read, Glob, Grep, git status, ejecutar tests
- **Commits frecuentes:** un commit por unidad de trabajo completada
- **Plan y código juntos:** actualizar el plan en el MISMO commit que el código
- **Retrospectiva al finalizar cada fase:** identificar aprendizajes e incorporar a CLAUDE.md

## Selección de Modelo

**Opus:** planificación, diseño arquitectónico, retrospectivas, decisiones estratégicas

**Sonnet:** implementación siguiendo planes, ciclo TDD, refactoring con objetivos claros

## Stack Técnico

- **React** 19.x + TypeScript, **Vite**
- **Vitest** + React Testing Library, **MSW** (Mock Service Worker)
- **React Router** (importar siempre de `react-router-dom`)
- **Context API** para estado global (sin Redux ni Zustand)
- **APIs nativas:** `Intl.NumberFormat`, `<dialog>`
- **CSS:** metodología BEM, librería `classnames` para clases dinámicas

## Estructura del Workshop

5 iteraciones progresivas (Rojo-Verde-Refactor):

1. Listado de categorías (fetch + custom hook)
2. Listado de productos + `Intl.NumberFormat` + Object Mother
3. Navegación y routing + helpers DSL
4. Estado global con Context API (Toggle Card/List view)
5. Modal con `<dialog>` nativo

Ver @docs/rules/iterations.md para el detalle completo de cada iteración.

## Estrategia de Ramas

`master` es el punto de partida para los asistentes. Las ramas de soluciones siguen el patrón `iteration-X-solution`.

Ver @.claude/rules/branching.md para el flujo completo y el proceso de cascade merge.

## Plan de Implementación

Documentado en `.aiplan/`. Consultar al inicio de cada sesión y actualizar checkboxes conforme se avanza.

## Comandos Útiles

```bash
npm start          # Desarrollo
npm test           # Tests en watch mode
npm run typecheck  # Type checking
npm run lint       # Linting
npm run build      # Build
```

## Reglas y Convenciones

Antes de trabajar, leer los archivos relevantes según la tarea:

- **Estrategia de ramas y cascade merge:** @.claude/rules/branching.md *(cargado automáticamente)*
- **Ciclo TDD e incrementalidad:** @.claude/rules/tdd-workflow.md *(cargado automáticamente)*
- **Escribir o revisar tests:** @docs/rules/testing.md
- **Crear o modificar componentes:** @docs/rules/component-patterns.md
- **Estructura, imports, CSS, naming:** @docs/rules/conventions.md
- **Implementar una iteración específica:** @docs/rules/iterations.md

## Referencias

- `package.json` → scripts disponibles
- `src/mocks/` → configuración de MSW