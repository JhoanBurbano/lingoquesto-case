# 🚀 Configuración de Supabase para Voice Chat

Guía paso a paso para configurar las tablas necesarias en Supabase.

## 📋 Prerrequisitos

- ✅ Proyecto Supabase creado
- ✅ Variables de entorno configuradas en `.env.local`
- ✅ Acceso al Dashboard de Supabase

## 🔧 Paso 1: Acceder al SQL Editor

1. **Abrir** [Supabase Dashboard](https://supabase.com/dashboard)
2. **Seleccionar** tu proyecto
3. **Ir** a **SQL Editor** en el menú lateral izquierdo
4. **Hacer clic** en **"New query"**

## 📝 Paso 2: Ejecutar el Script SQL

1. **Copiar** todo el contenido del archivo `supabase-setup.sql`
2. **Pegar** en el editor SQL de Supabase
3. **Hacer clic** en **"Run"** (botón azul)

## ✅ Paso 3: Verificar la Configuración

Después de ejecutar el script, deberías ver:

### **Tablas Creadas**

```sql
-- Verificar que las tablas existen
SELECT table_name, table_type
FROM information_schema.tables
WHERE table_schema = 'public'
    AND table_name IN ('voice_chat_rooms', 'voice_chat_participants', 'voice_messages');
```

### **Realtime Habilitado**

```sql
-- Verificar que Realtime está habilitado
SELECT schemaname, tablename, pubname
FROM pg_publication_tables
WHERE pubname = 'supabase_realtime'
    AND tablename IN ('voice_chat_rooms', 'voice_chat_participants', 'voice_messages');
```

## 🗄️ Estructura de las Tablas

### **1. voice_chat_rooms**

```sql
- id: UUID (Primary Key)
- name: VARCHAR(100) - Nombre de la sala
- created_at: TIMESTAMP - Fecha de creación
- updated_at: TIMESTAMP - Fecha de última actualización
- max_participants: INTEGER - Máximo de participantes
- is_active: BOOLEAN - Si la sala está activa
```

### **2. voice_chat_participants**

```sql
- id: UUID (Primary Key)
- room_id: UUID - Referencia a la sala
- user_id: VARCHAR(100) - ID del usuario
- username: VARCHAR(100) - Nombre del usuario
- joined_at: TIMESTAMP - Fecha de unión
- left_at: TIMESTAMP - Fecha de salida (NULL si está activo)
- is_speaking: BOOLEAN - Si está hablando
- audio_level: DECIMAL - Nivel de audio (0.00 - 1.00)
```

### **3. voice_messages**

```sql
- id: UUID (Primary Key)
- room_id: UUID - Referencia a la sala
- user_id: VARCHAR(100) - ID del usuario
- username: VARCHAR(100) - Nombre del usuario
- text: TEXT - Texto del mensaje (opcional)
- audio_url: TEXT - URL del audio (opcional)
- timestamp: TIMESTAMP - Fecha del mensaje
- reactions: JSONB - Reacciones al mensaje
```

## 🔒 Políticas de Seguridad (RLS)

### **Permisos Configurados**

- ✅ **Lectura pública** para todas las tablas
- ✅ **Inserción** permitida para usuarios autenticados
- ✅ **Actualización** permitida para propietarios
- ✅ **Eliminación** permitida para participantes

### **Seguridad Implementada**

- 🔐 **Row Level Security** habilitado
- 🚫 **Acceso restringido** por políticas
- 👥 **Participación controlada** por sala

## 📡 Configuración de Realtime

### **Habilitado Para**

- ✅ `voice_chat_rooms` - Actualizaciones de salas
- ✅ `voice_chat_participants` - Cambios de participantes
- ✅ `voice_messages` - Nuevos mensajes

### **Eventos Soportados**

- 🔄 **INSERT** - Nuevos registros
- 📝 **UPDATE** - Cambios en registros
- 🗑️ **DELETE** - Eliminación de registros

## 🧪 Datos de Prueba

El script incluye **3 salas de ejemplo**:

1. **Conversación Básica** - 10 participantes máx
2. **Práctica Avanzada** - 15 participantes máx
3. **Chat Grupal** - 20 participantes máx

## 🔍 Verificación de Funcionamiento

### **1. Verificar Conexión**

```bash
# En la consola del navegador deberías ver:
🔧 Supabase configuration loaded
🌐 Supabase URL configured: Yes
🔑 Supabase Anon Key configured: Yes
✅ Supabase connection test successful
```

### **2. Verificar Tablas**

```bash
# Al hacer clic en "Unirse a Sala" deberías ver:
🔍 Fetching available rooms...
✅ Found 3 available rooms
```

### **3. Verificar Creación de Salas**

```bash
# Al crear una sala deberías ver:
🏗️ Creating new room: Nombre Sala with max participants: 10
✅ Room created successfully: room-uuid
```

## 🚨 Solución de Problemas

### **Error: "Could not find the table"**

- ✅ **Verificar** que el script SQL se ejecutó correctamente
- ✅ **Verificar** que las tablas existen en Database → Tables
- ✅ **Verificar** que Realtime está habilitado en Database → Replication

### **Error: "Permission denied"**

- ✅ **Verificar** que las políticas RLS están configuradas
- ✅ **Verificar** que los permisos están otorgados
- ✅ **Verificar** que la clave anónima es correcta

### **Error: "Realtime not working"**

- ✅ **Verificar** que las tablas están en la publicación `supabase_realtime`
- ✅ **Verificar** que Realtime está habilitado en el proyecto
- ✅ **Verificar** que no hay errores en la consola

## 📱 Próximos Pasos

1. **Ejecutar** el script SQL en Supabase
2. **Verificar** que las tablas se crearon correctamente
3. **Probar** la funcionalidad en la aplicación
4. **Verificar** que los logs muestran éxito

## 🎯 Resultado Esperado

Después de la configuración:

- ✅ **3 salas de ejemplo** disponibles
- ✅ **Funcionalidad completa** de chat de voz
- ✅ **Sincronización en tiempo real** entre pestañas y navegadores
- ✅ **Persistencia de datos** en Supabase
- ✅ **Logs de validación** funcionando correctamente

---

**¡Configuración completada!** 🎉 El voice chat ahora debería funcionar perfectamente con sincronización en tiempo real.
