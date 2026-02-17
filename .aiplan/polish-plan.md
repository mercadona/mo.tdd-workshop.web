# Plan de Pulimento - TDD Workshop

## Contexto General

El workshop está **funcionalmente completo** con las 5 iteraciones implementadas y todos los tests pasando (12/12). Sin embargo, necesita una fase de pulimento para:

1. **Mejorar la experiencia visual** (CSS y UX)
2. **Facilitar el seguimiento del workshop** (estructura y guías)
3. **Documentar el flujo para el instructor** (guión)

---

## Estado Actual

### ✅ Completado
- 5 iteraciones funcionales (iteration-1 a iteration-5)
- 12 tests pasando
- TDD estricto seguido y documentado
- Ramas creadas: `iteration-X-start` e `iteration-X-solution`
- Retrospectivas aplicadas al CLAUDE.md
- Custom hook `useProductDialog` extraído (DRY)

### 🚧 Pendiente de Pulimento
- CSS y diseño visual
- Navegación y estados (active/current)
- Estructura del workshop (¿tests escritos como guía?)
- Documentación para instructor

---

## Tareas Pendientes (Categorizadas)

### 🎨 CSS - Alta Prioridad

#### 1. Grid de productos (vista Card)
- **Problema:** Los productos se ven gigantes, no hay grid real con columnas
- **Solución deseada:** Grid CSS con múltiples columnas y filas
- **Impacto:** Alto (afecta la experiencia visual principal)
- **Estrategia:** Modificar desde master → propagar a todas las ramas

#### 2. Nutriscore
- **Problema:** El texto "Nutriscore:" impide leer bien la letra (A, B, C, D, E)
- **Solución deseada:** Mostrar solo la letra con estilo visual claro, o formato más legible
- **Impacto:** Medio (usabilidad)
- **Estrategia:** Modificar desde master → propagar a todas las ramas

#### 3. Modal de producto (dialog)
- **Problema:** No flota sobre la página, falta overlay oscuro
- **Solución deseada:**
  - Dialog centrado y flotante
  - Overlay (backdrop) oscuro semitransparente
  - Estilo de modal moderno
- **Impacto:** Alto (experiencia UX crítica)
- **Estrategia:** Modificar desde iteration-5-solution → propagar hacia adelante

#### 4. Cabecera
- **Problema:** Fondo verde sólido, muy feo
- **Solución deseada:**
  - Fondo blanco
  - Sombra ligera inferior o border-bottom gris claro
  - Estilo limpio y profesional
- **Impacto:** Alto (primera impresión)
- **Estrategia:** Modificar desde master → propagar a todas las ramas

---

### 🧭 Navegación y UX

#### 5. Estado active/current de categoría
- **Problema:**
  - No hay indicación visual de qué categoría está activa
  - Existe un atributo `data-discover` (desconocido, investigar)
  - Falta testing para el estado activo
  - Falta estilo visual para categoría activa
- **Solución deseada:**
  - Testing: verificar que la categoría activa tiene clase/estilo especial
  - Visual: highlight o subrayado de categoría activa
- **Impacto:** Medio (orientación del usuario)
- **Estrategia:**
  - Testing: añadir en iteration-3-solution (navegación)
  - CSS: modificar desde iteration-3-solution → propagar

#### 6. Logo Mercadona y navegación a Home
- **Problema:** Texto "TDD Workshop" poco atractivo
- **Solución deseada:**
  - Reemplazar por logo de Mercadona
  - Logo clickeable que navega a Home (/)
  - Testing: verificar navegación al hacer click en logo
- **Impacto:** Medio (branding y UX)
- **Estrategia:**
  - Modificar desde master → propagar a todas las ramas
  - Añadir test en Home o Navigation

---

### 📚 Estructura del Workshop

#### 7. Tests como guía para asistentes
- **Duda:** ¿Los asistentes se perderán con la estructura actual?
- **Consideración:** Crear archivos de tests con los `it` escritos pero vacíos, como guía
- **Beneficios potenciales:**
  - Los asistentes ven qué deben implementar
  - Menos fricción para empezar
  - Guía clara de progreso
- **Contras potenciales:**
  - Menos "descubrimiento" en el ciclo TDD
  - Puede reducir el aprendizaje de "cómo escribir tests"
- **Decisión:** Pendiente de evaluar en próxima sesión

---

### 📖 Documentación

#### 8. Guión para el instructor
- **Necesidad:** Mantener todo el flujo en la cabeza es difícil
- **Contenido del guión:**
  - Introducción a cada iteración (contexto, objetivo)
  - Conceptos clave a explicar (TDD, custom hooks, Context API, etc.)
  - Tiempo estimado por iteración
  - Puntos críticos donde los asistentes suelen atascarse
  - Ejemplos de código a mostrar
  - Preguntas frecuentes
- **Formato:** Markdown estructurado, fácil de seguir durante el workshop
- **Ubicación:** `docs/instructor-guide.md` o similar
- **Prioridad:** Alta (sin esto, el instructor puede perder el hilo)

---

## Estrategia de Implementación

### Cambios que van desde `master`

Estos cambios afectan a todas las ramas y deben aplicarse desde el inicio:

- Grid de productos (CSS)
- Nutriscore (CSS y posiblemente HTML)
- Cabecera (CSS)
- Logo Mercadona (HTML + CSS + test)
- Cualquier cambio en componentes base (`<Navigation />`, `<Layout />`, `<Toggle />`)

**Proceso:**
1. Hacer cambio en master
2. Merge master → iteration-1-start
3. Merge iteration-1-start → iteration-1-solution
4. Repetir para todas las ramas

### Cambios que van desde ramas específicas

Estos cambios solo afectan desde cierta iteración en adelante:

- Modal de producto (desde iteration-5)
- Estado active de categoría (desde iteration-3)

**Proceso:**
1. Hacer cambio en iteration-X-solution
2. Merge hacia iteration-X+1-start, etc.

---

## Decisiones Pendientes (para próxima sesión)

### A decidir:
1. **¿Tests escritos como guía o completamente vacíos?**
   - Evaluar pros/contras
   - Probar con 1 iteración y ver resultado

2. **¿Orden de prioridad de las tareas de CSS?**
   - ¿Empezamos por lo más impactante (grid + cabecera)?
   - ¿O por lo más rápido (nutriscore)?

3. **¿Logo de Mercadona: SVG inline o imagen?**
   - Verificar si hay logo disponible en recursos del proyecto

4. **¿Overlay del modal: CSS puro o librería?**
   - Preferir CSS nativo si es posible (menos dependencias)

5. **¿Estructura del guión del instructor?**
   - Formato: lineal vs por secciones
   - Nivel de detalle

---

## Notas Técnicas

### Sobre `data-discover`
- Aparece en el código de navegación de categorías
- Investigar: ¿Es un atributo custom? ¿Para qué se usa?
- Verificar si es necesario o se puede eliminar

### Sobre el merge de ramas
- Algunas ramas ya tienen commits, cuidado con conflictos
- Considerar estrategia de cherry-pick para cambios específicos
- Documentar bien cada cambio para que sea reproducible

---

## Próximos Pasos Sugeridos

1. **Planificación detallada:**
   - Crear plan específico para fase de pulimento
   - Estimar esfuerzo por tarea
   - Definir orden de implementación

2. **Quick wins:**
   - Empezar por cambios CSS simples (nutriscore, cabecera)
   - Dar sensación de progreso rápido

3. **Cambios complejos:**
   - Grid de productos (requiere prueba y ajuste)
   - Modal con overlay (requiere CSS + posiblemente test updates)
   - Estado active de categorías (requiere tests nuevos)

4. **Documentación:**
   - Guión del instructor (puede hacerse en paralelo)

---

## Checklist General (para tracking)

### CSS
- [ ] Grid de productos con columnas/filas
- [ ] Nutriscore más legible
- [ ] Modal flotante con overlay
- [ ] Cabecera con fondo blanco y sombra

### Navegación
- [ ] Estado active/current de categoría (testing)
- [ ] Estado active/current de categoría (visual)
- [ ] Logo Mercadona clickeable → Home
- [ ] Investigar/resolver `data-discover`

### Workshop Structure
- [ ] Decidir: tests escritos vs vacíos
- [ ] Implementar estructura decidida
- [ ] Probar con 1 iteración

### Documentación
- [ ] Guión del instructor (estructura)
- [ ] Guión del instructor (contenido completo)
- [ ] Revisar y validar con el equipo

---

## Contexto para la Próxima Sesión

**Cuando retomemos:**
1. Leer este archivo completo primero
2. Leer el `workshop-plan.md` actual para contexto de lo ya completado
3. Decidir prioridades de las tareas pendientes
4. Crear plan detallado de implementación (con checkboxes)
5. Ejecutar fase de pulimento siguiendo TDD cuando sea aplicable

**Pregunta clave a responder:**
¿Empezamos por CSS (impacto visual) o por estructura del workshop (experiencia del asistente)?