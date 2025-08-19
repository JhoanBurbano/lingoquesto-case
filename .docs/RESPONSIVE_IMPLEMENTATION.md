# Responsive Design Implementation

## Overview

Se ha implementado un sistema completo de responsive design para LingoQuesto que incluye:

- **Sidebar responsive** con toggle funcional y menú hamburguesa en mobile
- **Composable useResponsive** para manejo consistente de breakpoints
- **Estilos CSS responsive** con utilidades Tailwind personalizadas
- **Layout adaptativo** que se ajusta a todos los tamaños de pantalla

## Features Implemented

### 1. Sidebar Responsive

- **Desktop**: Sidebar fijo con toggle para colapsar/expandir
- **Mobile**: Sidebar deslizable con overlay y menú hamburguesa
- **Transiciones suaves** entre estados
- **Navegación automática** que cierra el sidebar en mobile

### 2. Composable useResponsive

```typescript
import { useResponsive } from '@/composables/useResponsive'

const { isMobile, isTablet, isDesktop, currentBreakpoint, width, height } = useResponsive()
```

**Breakpoints disponibles:**

- `xs`: 475px
- `sm`: 640px
- `md`: 768px
- `lg`: 1024px
- `xl`: 1280px
- `2xl`: 1536px

### 3. Estilos CSS Responsive

**Clases utilitarias disponibles:**

- `.container-responsive` - Contenedor base responsive
- `.grid-responsive` - Grid que se adapta a breakpoints
- `.text-responsive` - Texto que cambia de tamaño
- `.p-responsive` - Padding adaptativo
- `.sidebar-mobile` - Sidebar para mobile
- `.overlay-mobile` - Overlay para sidebar mobile

### 4. Layout Adaptativo

- **Mobile-first approach** con breakpoints progresivos
- **Flexbox responsive** que cambia de columna a fila
- **Grid adaptativo** que ajusta columnas según pantalla
- **Espaciado responsive** que se adapta al tamaño

## Usage Examples

### Sidebar Toggle

```vue
<template>
  <Button @click="handleToggle">
    <Menu v-if="!isMobileSidebarOpen" />
    <X v-else />
  </Button>
</template>

<script setup>
const { isMobile } = useResponsive()
const isMobileSidebarOpen = ref(false)

function handleToggle() {
  if (isMobile.value) {
    isMobileSidebarOpen.value = !isMobileSidebarOpen.value
  } else {
    isCollapsed.value = !isCollapsed.value
  }
}
</script>
```

### Grid Responsive

```vue
<template>
  <div class="grid-responsive grid-responsive-sm grid-responsive-md grid-responsive-lg gap-4">
    <div class="card-mobile card-desktop">Card 1</div>
    <div class="card-mobile card-desktop">Card 2</div>
    <div class="card-mobile card-desktop">Card 3</div>
    <div class="card-mobile card-desktop">Card 4</div>
  </div>
</template>
```

### Texto Responsive

```vue
<template>
  <h1 class="text-2xl sm:text-3xl lg:text-4xl font-bold">Título Responsive</h1>
  <p class="text-sm sm:text-base lg:text-lg">Párrafo que se adapta</p>
</template>
```

## Testing

### Vista de Prueba

Se ha creado una vista de prueba en `/responsive-test` que demuestra:

- Grid responsive con diferentes breakpoints
- Tipografía que cambia de tamaño
- Layouts que se adaptan
- Botones con texto condicional
- Indicador de breakpoint actual

### Comandos de Prueba

```bash
# Ejecutar en modo desarrollo
npm run dev

# Navegar a /responsive-test
# Redimensionar ventana para ver cambios
# Usar DevTools para simular dispositivos
```

## Breakpoints y Comportamiento

| Breakpoint | Ancho  | Comportamiento |
| ---------- | ------ | -------------- |
| xs         | 475px  | Mobile pequeño |
| sm         | 640px  | Mobile grande  |
| md         | 768px  | Tablet         |
| lg         | 1024px | Desktop        |
| xl         | 1280px | Desktop grande |
| 2xl        | 1536px | Desktop extra  |

## Sidebar States

### Desktop

- **Expandido**: 320px (w-80)
- **Colapsado**: 80px (w-20)
- **Toggle**: Botón con chevron

### Mobile

- **Cerrado**: Oculto (-translate-x-full)
- **Abierto**: Visible (translate-x-0)
- **Toggle**: Menú hamburguesa en header
- **Overlay**: Fondo oscuro al abrir

## Archivos Modificados

1. **`src/components/layouts/AppLayout.vue`** - Layout principal responsive
2. **`src/components/LingoSidebar.vue`** - Sidebar con toggle funcional
3. **`src/composables/useResponsive.ts`** - Composable para responsive
4. **`src/styles/responsive.css`** - Estilos CSS responsive
5. **`src/styles/globals.css`** - Importación de estilos
6. **`tailwind.config.js`** - Configuración de breakpoints
7. **`src/views/ResponsiveTest.vue`** - Vista de prueba
8. **`src/router/index.ts`** - Ruta de prueba

## Próximos Pasos

1. **Aplicar responsive design** a todas las vistas existentes
2. **Optimizar componentes** para mobile
3. **Implementar lazy loading** para mejorar performance
4. **Agregar tests** para responsive behavior
5. **Documentar** patrones de uso comunes

## Troubleshooting

### Sidebar no se abre en mobile

- Verificar que `isMobile` esté funcionando
- Comprobar z-index y posicionamiento
- Revisar eventos de click

### Estilos no se aplican

- Verificar importación de `responsive.css`
- Comprobar que Tailwind esté configurado
- Revisar clases CSS personalizadas

### Breakpoints no funcionan

- Verificar configuración de Tailwind
- Comprobar que `useResponsive` esté importado
- Revisar console para errores
