# 🎯 LingoQuesto - Plataforma Educativa de Idiomas

> **Sistema integral de gestión educativa para profesores de idiomas con gamificación, chat de voz y seguimiento de progreso**

## 🚀 Características Principales

### 📊 **Dashboard del Profesor**

- **Métricas en tiempo real**: Estudiantes activos, sesiones completadas, progreso general
- **Filtros avanzados**: Búsqueda por nombre, email, nivel, estado de atención
- **Vistas múltiples**: Tabla, tarjetas y vista detallada de estudiantes
- **Ordenamiento inteligente**: Por puntos, nivel, fecha de registro, etc.

### 🎖️ **Sistema de Logros e Insignias**

- **4 niveles de rareza**: Común, Raro, Épico, Legendario
- **Insignias personalizadas**:
  - 🎤 Primera Conversación (Común)
  - 🔊 Dominio de Audio (Épico)
  - 🔥 Racha Activa (Raro)
  - 📈 Progreso Constante (Raro)
  - 📚 Contenido de Lectura (Común)
  - 👑 Rey del Aprendizaje (Legendario)
  - 📅 Asistencia Perfecta (Raro)
  - ⭐ Estrella del Mes (Legendario)
- **Podium de ranking** con posiciones #1, #2, #3
- **Asignación manual** de insignias por parte del profesor

### 🗣️ **Práctica Oral con Chat de Voz**

- **Grabación de audio** en tiempo real
- **Reproducción con controles** de velocidad (1x, 1.5x, 2x)
- **Reacciones con emojis** personalizados (celebración, cool, excitado, divertido, triste)
- **Sincronización cross-tab** para múltiples ventanas
- **Historial de mensajes** con timestamps

### 👥 **Gestión de Estudiantes**

- **Perfiles completos**: Nombre, email, nivel, puntos, insignias
- **Seguimiento de progreso** con métricas visuales
- **Vista de tarjetas** con información resumida
- **Vista detallada** con historial completo
- **Filtros por nivel**: A1, A2, B1, B2

### 📚 **Contenido Educativo**

- **Slides interactivos** para diferentes temas
- **Sistema de actividades** con progreso visual
- **Contenido personalizable** por nivel de estudiante

### 🎨 **Interfaz y UX**

- **Diseño responsivo** para móvil y desktop
- **Tema personalizado** con gradientes de marca
- **Componentes atómicos** reutilizables
- **Navegación intuitiva** con sidebar colapsible
- **Fuente Satoshi** para mejor legibilidad

## 🛠️ **Stack Tecnológico**

### **Frontend**

- **Vue 3** con Composition API
- **TypeScript** para tipado estricto
- **Vite** como bundler y dev server
- **Tailwind CSS v4** para estilos
- **Pinia** para gestión de estado

### **Componentes**

- **Atomic Design**: Atoms, Molecules, Layouts, Views
- **Radix Vue** para primitivos de UI
- **Lucide Vue Next** para iconografía
- **Vue Sonner** para notificaciones

### **Testing**

- **Vitest** para tests unitarios
- **Playwright** para tests E2E
- **Vue Testing Library** para tests de componentes

### **Herramientas de Desarrollo**

- **ESLint** + **Oxlint** para linting
- **Prettier** para formateo de código
- **TypeScript strict mode** habilitado

## 📁 **Estructura del Proyecto**

```
lingoquesto-pt/
├── src/
│   ├── components/
│   │   ├── atoms/          # Componentes básicos (Button, Badge, Input)
│   │   ├── molecules/      # Componentes compuestos (Card, Dialog, Tabs)
│   │   ├── layouts/        # Layouts de aplicación
│   │   └── ...            # Componentes específicos
│   ├── views/              # Páginas principales
│   ├── stores/             # Estado global con Pinia
│   ├── composables/        # Lógica reutilizable
│   ├── types/              # Definiciones de TypeScript
│   ├── utils/              # Funciones utilitarias
│   └── styles/             # Estilos globales y Tailwind
├── public/                 # Assets estáticos
├── e2e/                   # Tests end-to-end
└── docs/                  # Documentación del proyecto
```

## 🚀 **Instalación y Uso**

### **Prerrequisitos**

- Node.js 18+
- Yarn o npm

### **Instalación**

```bash
# Clonar repositorio
git clone <repository-url>
cd lingoquesto-pt

# Instalar dependencias
yarn install

# Configurar variables de entorno
cp .env.example .env
```

### **Scripts Disponibles**

```bash
# Desarrollo
yarn dev              # Servidor de desarrollo
yarn build            # Build de producción
yarn preview          # Preview del build

# Testing
yarn test:unit        # Tests unitarios
yarn test:e2e         # Tests end-to-end
yarn test:coverage    # Cobertura de tests

# Calidad de código
yarn lint             # Linting con ESLint
yarn type-check       # Verificación de tipos
yarn format           # Formateo con Prettier
```

## 🎯 **Funcionalidades Implementadas**

### **1. Sistema de Autenticación y Usuarios**

- Login con nickname personalizado
- Gestión de sesiones de chat
- Perfiles de usuario con avatares

### **2. Dashboard del Profesor**

- Métricas en tiempo real
- Filtros avanzados de estudiantes
- Vistas múltiples (tabla, tarjetas, detalle)
- Sistema de búsqueda inteligente

### **3. Gestión de Estudiantes**

- CRUD completo de perfiles
- Seguimiento de progreso
- Asignación de insignias
- Historial de actividades

### **4. Sistema de Gamificación**

- Insignias por logros
- Sistema de puntos
- Ranking de estudiantes
- Podium de posiciones

### **5. Chat de Voz**

- Grabación de audio
- Reproducción con controles
- Reacciones con emojis
- Sincronización multi-tab

### **6. Contenido Educativo**

- Slides interactivos
- Actividades por nivel
- Progreso visual
- Contenido personalizable

## 🔧 **Configuración Avanzada**

### **Variables de Entorno**

```env
# Configuración de desarrollo
VITE_APP_TITLE=LingoQuesto
VITE_APP_VERSION=1.0.0

# Configuración de API (futuro)
VITE_API_URL=http://localhost:3000
VITE_WS_URL=ws://localhost:3000
```

### **Tailwind CSS**

- Configuración personalizada con colores de marca
- Sistema de gradientes para insignias
- Componentes responsivos
- Utilidades personalizadas

### **TypeScript**

- Configuración estricta habilitada
- Tipos personalizados para el dominio
- Interfaces para componentes
- Generics para utilidades

## 📊 **Métricas de Calidad**

### **Cobertura de Tests**

- **Objetivo**: ≥80% de cobertura
- **Tests unitarios**: Componentes principales
- **Tests E2E**: Flujos críticos de usuario

### **Performance**

- **Bundle inicial**: ≤200KB gzip
- **Chunk principal**: ≤150KB gzip
- **Tiempo de bloqueo**: <250ms

### **Linting y Tipos**

- **ESLint**: 0 errores
- **TypeScript**: 0 errores de tipos
- **Prettier**: Formateo consistente

## 🚧 **Roadmap y Mejoras Futuras**

### **Fase 1 (Completada)**

- ✅ Sistema base de componentes
- ✅ Dashboard del profesor
- ✅ Gestión de estudiantes
- ✅ Sistema de insignias
- ✅ Chat de voz básico

### **Fase 2 (En desarrollo)**

- 🔄 API backend para persistencia
- 🔄 Sistema de autenticación real
- 🔄 Base de datos de estudiantes
- 🔄 Notificaciones en tiempo real

### **Fase 3 (Planificada)**

- 📋 Sistema de lecciones
- 📋 Ejercicios interactivos
- 📋 Reportes avanzados
- 📋 Integración con LMS externos

## 🤝 **Contribución**

### **Estándares de Código**

- **Conventional Commits** para mensajes
- **Branch naming**: `feature/`, `fix/`, `docs/`
- **Code review** obligatorio
- **Tests** para nuevas funcionalidades

### **Proceso de Desarrollo**

1. Fork del repositorio
2. Crear branch para feature
3. Implementar cambios con tests
4. Crear Pull Request
5. Code review y merge

## 📝 **Changelog**

### **v1.0.0** - Lanzamiento Inicial

- 🎉 Sistema completo de gestión educativa
- 🎖️ Sistema de insignias y gamificación
- 🗣️ Chat de voz con reacciones
- 📊 Dashboard del profesor
- 👥 Gestión completa de estudiantes
- 🎨 Interfaz moderna y responsiva

## 📄 **Licencia**

Este proyecto está bajo la licencia MIT. Ver [LICENSE](LICENSE) para más detalles.

## 👨‍💻 **Equipo**

- **Desarrollo**: Equipo de Product Engineering
- **Diseño**: UX/UI Team
- **Testing**: QA Team

## 📞 **Soporte**

- **Documentación**: [docs/](docs/)
- **Issues**: [GitHub Issues](https://github.com/org/lingoquesto-pt/issues)
- **Discusiones**: [GitHub Discussions](https://github.com/org/lingoquesto-pt/discussions)

---

**LingoQuesto** - Transformando la educación de idiomas con tecnología moderna 🚀
