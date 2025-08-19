# 🔧 Configuración de Entorno - LingoQuesto Voice Chat

Guía completa para configurar las variables de entorno del chat de voz.

## 📋 Requisitos Previos

- [Node.js](https://nodejs.org/) 20.19.0 o superior
- [Supabase](https://supabase.com/) cuenta y proyecto creado
- Acceso al dashboard de Supabase

## 🚀 Configuración Rápida

### 1. Usar Script Automático (Recomendado)

```bash
# Ejecutar script de configuración
npm run setup:env

# El script te guiará paso a paso para configurar:
# - Supabase URL y clave anónima
# - Configuración de chat de voz
# - Ajustes de desarrollo
```

### 2. Configuración Manual

#### Crear archivo `.env.local`

```bash
# En la raíz del proyecto
touch .env.local
```

#### Agregar variables requeridas

```bash
# Supabase Configuration (REQUERIDO)
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu-clave-anonima-aqui

# Voice Chat Settings
VITE_VOICE_CHAT_MAX_PARTICIPANTS=20
VITE_VOICE_CHAT_DEFAULT_LANGUAGE=en
VITE_VOICE_CHAT_AUDIO_QUALITY=high

# Development Settings
VITE_DEV_MODE=true
VITE_ENABLE_LOGGING=true
```

## 🔑 Obtener Credenciales de Supabase

### 1. Acceder al Dashboard

1. Ve a [supabase.com](https://supabase.com)
2. Inicia sesión en tu cuenta
3. Selecciona tu proyecto

### 2. Obtener URL del Proyecto

1. Ve a **Settings** → **API**
2. Copia la **Project URL**
3. Formato: `https://abcdefghijklmnop.supabase.co`

### 3. Obtener Clave Anónima

1. En la misma página **Settings** → **API**
2. Copia la **anon public** key
3. Formato: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

## 📁 Archivos de Configuración

### Estructura de Archivos

```
lingoquesto-pt/
├── env.example              # Template para desarrollo
├── env.local.example        # Template para local
├── env.production.example   # Template para producción
├── env.test.example         # Template para testing
├── env.ci.example          # Template para CI/CD
└── .env.local              # Tu configuración local (no commitear)
```

### Variables Disponibles

| Variable                           | Requerida | Descripción                   | Valor por Defecto |
| ---------------------------------- | --------- | ----------------------------- | ----------------- |
| `VITE_SUPABASE_URL`                | ✅        | URL del proyecto Supabase     | -                 |
| `VITE_SUPABASE_ANON_KEY`           | ✅        | Clave anónima de Supabase     | -                 |
| `VITE_VOICE_CHAT_MAX_PARTICIPANTS` | ❌        | Máximo participantes por sala | 20                |
| `VITE_VOICE_CHAT_DEFAULT_LANGUAGE` | ❌        | Idioma por defecto            | en                |
| `VITE_VOICE_CHAT_AUDIO_QUALITY`    | ❌        | Calidad de audio              | high              |
| `VITE_DEV_MODE`                    | ❌        | Modo desarrollo               | false             |
| `VITE_ENABLE_LOGGING`              | ❌        | Habilitar logging             | false             |

## 🌍 Entornos de Configuración

### Desarrollo Local (`.env.local`)

```bash
VITE_DEV_MODE=true
VITE_ENABLE_LOGGING=true
VITE_VOICE_CHAT_MAX_PARTICIPANTS=20
```

### Producción (`.env.production`)

```bash
VITE_DEV_MODE=false
VITE_ENABLE_LOGGING=false
VITE_VOICE_CHAT_MAX_PARTICIPANTS=50
```

### Testing (`.env.test`)

```bash
VITE_DEV_MODE=true
VITE_ENABLE_LOGGING=true
VITE_VOICE_CHAT_MAX_PARTICIPANTS=10
VITE_VOICE_CHAT_AUDIO_QUALITY=low
```

### CI/CD

```bash
VITE_SUPABASE_URL=${SUPABASE_URL}
VITE_SUPABASE_ANON_KEY=${SUPABASE_ANON_KEY}
VITE_DEV_MODE=false
```

## 🔒 Seguridad

### Variables Sensibles

- **NUNCA** commitees archivos `.env.local` o `.env.production`
- **SÍ** commitees archivos de ejemplo (`env.*.example`)
- Usa **secrets** en CI/CD para credenciales

### Validación

El sistema valida automáticamente las variables requeridas:

```typescript
// src/config/env.config.ts
function validateEnvVars(): void {
  const requiredVars = ['VITE_SUPABASE_URL', 'VITE_SUPABASE_ANON_KEY']

  const missingVars = requiredVars.filter((varName) => !import.meta.env[varName])

  if (missingVars.length > 0) {
    throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`)
  }
}
```

## 🧪 Testing

### Configuración de Tests

```bash
# Crear archivo .env.test
cp env.test.example .env.test

# Ejecutar tests con configuración específica
NODE_ENV=test npm run test:unit
```

### Variables de Test

```bash
# Configuración mínima para tests
VITE_SUPABASE_URL=https://test-project.supabase.co
VITE_SUPABASE_ANON_KEY=test-key
VITE_DEV_MODE=true
VITE_ENABLE_LOGGING=true
```

## 🚀 Deployment

### Vercel

1. Agregar variables en **Settings** → **Environment Variables**
2. Configurar para **Production** y **Preview**

```bash
VITE_SUPABASE_URL=https://prod-project.supabase.co
VITE_SUPABASE_ANON_KEY=prod-key
VITE_DEV_MODE=false
```

### Netlify

1. Ir a **Site settings** → **Environment variables**
2. Agregar variables para **Production** y **Deploy previews**

### Docker

```dockerfile
# Dockerfile
ENV VITE_SUPABASE_URL=${SUPABASE_URL}
ENV VITE_SUPABASE_ANON_KEY=${SUPABASE_ANON_KEY}
```

## 🔍 Troubleshooting

### Error: "Missing required environment variables"

**Causa**: Variables de entorno no configuradas

**Solución**:

```bash
# Verificar archivo .env.local existe
ls -la .env.local

# Verificar variables están definidas
cat .env.local | grep VITE_SUPABASE
```

### Error: "Invalid Supabase URL"

**Causa**: URL de Supabase mal formateada

**Solución**:

```bash
# Formato correcto
VITE_SUPABASE_URL=https://abcdefghijklmnop.supabase.co

# NO usar
VITE_SUPABASE_URL=https://supabase.com/project/123
```

### Error: "Invalid Supabase key"

**Causa**: Clave anónima incorrecta

**Solución**:

1. Verificar en Supabase Dashboard → Settings → API
2. Usar **anon public** key, NO **service_role** key
3. Verificar que la clave no tenga espacios extra

### Variables no se cargan

**Causa**: Archivo de entorno en ubicación incorrecta

**Solución**:

```bash
# Archivo debe estar en la raíz del proyecto
# NO en src/ o subdirectorios

# Estructura correcta
lingoquesto-pt/
├── .env.local          # ✅ Correcto
├── src/
│   └── .env.local     # ❌ Incorrecto
```

## 📚 Referencias

- [Vite Environment Variables](https://vitejs.dev/guide/env-and-mode.html)
- [Supabase Documentation](https://supabase.com/docs)
- [Environment Variables Best Practices](https://12factor.net/config)

## 🆘 Soporte

Si tienes problemas con la configuración:

1. **Verificar archivos de ejemplo** en el proyecto
2. **Revisar logs** del navegador para errores
3. **Confirmar credenciales** en Supabase Dashboard
4. **Crear issue** en GitHub con detalles del error

---

**Configuración completada** ✅ Tu chat de voz está listo para funcionar con Supabase!
