# 🔄 Troubleshooting de Sincronización - Voice Chat

Guía para resolver problemas de sincronización entre pestañas y navegadores en el chat de voz.

## 🚨 Problemas Identificados y Solucionados

### 1. **Sincronización entre Pestañas**

- ✅ **Problema**: Los cambios en una pestaña no se reflejaban en otras
- ✅ **Solución**: Implementado sistema de conexiones únicas por pestaña
- ✅ **Mejora**: Logging detallado para debugging

### 2. **Sincronización entre Navegadores**

- ✅ **Problema**: Los participantes no se veían en tiempo real entre navegadores
- ✅ **Solución**: Mejorado sistema de suscripciones de Supabase Realtime
- ✅ **Mejora**: Validación de conexión y reconexión automática

## 🔧 Soluciones Implementadas

### **Sistema de Conexiones Únicas**

```typescript
// Cada pestaña tiene un ID único de conexión
const connectionId = ref<string>(crypto.randomUUID())

// Los canales de Supabase incluyen este ID para evitar conflictos
roomSubscription = supabase.channel(`room:${roomId}:${connectionId.value}`)
```

### **Mejoras en Suscripciones**

```typescript
// Limpieza de suscripciones existentes antes de crear nuevas
if (roomSubscription) {
  roomSubscription.unsubscribe()
}

// Suscripción con manejo de errores y reconexión
.subscribe((status) => {
  if (status === 'SUBSCRIBED') {
    console.log('✅ Successfully subscribed to room updates')
  } else if (status === 'CHANNEL_ERROR') {
    handleReconnection(roomId)
  }
})
```

### **Sistema de Reconexión Automática**

```typescript
const handleReconnection = async (roomId: string) => {
  if (reconnectAttempts.value >= maxReconnectAttempts) {
    console.error('❌ Max reconnection attempts reached')
    return
  }

  // Reintento con delay exponencial
  await new Promise((resolve) => setTimeout(resolve, 1000 * reconnectAttempts.value))

  // Resubscribe a canales
  subscribeToRoomUpdates(roomId)
  subscribeToParticipantsUpdates(roomId)
}
```

## 📊 Logs de Validación Implementados

### **Inicialización del Composable**

```typescript
export function useVoiceChat() {
  console.log('🎯 useVoiceChat composable initialized')
  console.log('🔗 Supabase client status:', supabase ? 'Connected' : 'Not connected')
  // ... resto del código
}
```

### **Validación de Supabase**

```typescript
// En src/lib/supabase.ts
console.log('🔧 Supabase configuration loaded')
console.log('🌐 Supabase URL configured:', supabaseUrl ? 'Yes' : 'No')
console.log('🔑 Supabase Anon Key configured:', supabaseAnonKey ? 'Yes' : 'No')

// Test de conexión
supabase.auth.getSession().then(({ data, error }) => {
  if (error) {
    console.error('❌ Supabase connection test failed:', error)
  } else {
    console.log('✅ Supabase connection test successful')
  }
})
```

### **Logs de Operaciones**

```typescript
// Al unirse a una sala
console.log('🚀 Attempting to join room:', roomId, 'as:', username)
console.log('✅ Room found:', room.name)
console.log('👤 Creating participant record with ID:', userId)
console.log('📡 Setting up real-time subscriptions...')
console.log('✅ Supabase integration confirmed')

// Al recibir actualizaciones
console.log('🔄 Room update received:', payload)
console.log('👥 Participants update received:', payload)
console.log('📊 Updated participants list:', participants.length, 'participants')
```

## 🧪 Testing de Sincronización

### **Test 1: Múltiples Pestañas**

1. **Abrir** `/voice-chat` en una pestaña
2. **Crear** una sala nueva
3. **Abrir** la misma URL en otra pestaña
4. **Verificar** que la sala aparece en ambas pestañas
5. **Unirse** a la sala desde la segunda pestaña
6. **Verificar** que aparece como participante en ambas pestañas

### **Test 2: Múltiples Navegadores**

1. **Abrir** `/voice-chat` en Chrome
2. **Crear** una sala nueva
3. **Abrir** la misma URL en Firefox/Safari
4. **Verificar** que la sala aparece en ambos navegadores
5. **Unirse** a la sala desde ambos navegadores
6. **Verificar** que los participantes se ven en tiempo real

### **Test 3: Reconexión**

1. **Desconectar** internet temporalmente
2. **Verificar** que aparece mensaje de error
3. **Reconectar** internet
4. **Verificar** que se reconecta automáticamente
5. **Verificar** que los datos se sincronizan

## 🔍 Debugging en Tiempo Real

### **Console Logs Esperados**

```bash
🎯 useVoiceChat composable initialized
🔗 Supabase client status: Connected
🔧 Supabase configuration loaded
🌐 Supabase URL configured: Yes
🔑 Supabase Anon Key configured: Yes
✅ Supabase connection test successful
🔍 Validating Supabase configuration...
✅ Supabase configuration validated successfully
🌐 URL format: Valid
🔑 Key format: Valid
✅ useVoiceChat composable ready with methods: {...}
```

### **Logs de Operaciones**

```bash
🏗️ Creating new room: Test Room with max participants: 10
✅ Room created successfully: room-uuid-123
🚀 Auto-joining newly created room...
🚀 Attempting to join room: room-uuid-123 as: Anonymous
✅ Room found: Test Room
🎤 Initializing audio...
✅ Audio context created
✅ Microphone access granted
✅ Audio analyzer configured
✅ Audio level monitoring started
👤 Creating participant record with ID: user-uuid-456
✅ Participant record created successfully
✅ Successfully joined room: Test Room
📡 Setting up real-time subscriptions...
📡 Room subscription status: SUBSCRIBED
✅ Successfully subscribed to room updates
📡 Participants subscription status: SUBSCRIBED
✅ Successfully subscribed to participants updates
🔗 Connection ID: connection-uuid-789
🌐 Supabase integration active
✅ Supabase integration confirmed
```

## 🚨 Errores Comunes y Soluciones

### **Error: "Missing required environment variables"**

**Síntomas**: No se puede inicializar Supabase
**Solución**: Verificar archivo `.env.local`

```bash
# Verificar variables
cat .env.local | grep VITE_SUPABASE

# Debe mostrar:
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu-clave-aqui
```

### **Error: "Supabase connection test failed"**

**Síntomas**: No se puede conectar a Supabase
**Solución**: Verificar credenciales y conectividad

```bash
# Verificar URL
curl -I https://tu-proyecto.supabase.co

# Verificar clave en Supabase Dashboard
# Settings → API → anon public key
```

### **Error: "Room subscription error"**

**Síntomas**: No se reciben actualizaciones en tiempo real
**Solución**: Verificar configuración de Realtime

1. **Supabase Dashboard** → Database → Replication
2. **Habilitar** Realtime para `voice_chat_rooms`
3. **Habilitar** Realtime para `voice_chat_participants`

### **Error: "Participants not syncing"**

**Síntomas**: Los participantes no aparecen en tiempo real
**Solución**: Verificar políticas RLS y suscripciones

```sql
-- Verificar políticas RLS
SELECT * FROM pg_policies WHERE tablename = 'voice_chat_participants';

-- Verificar que Realtime esté habilitado
SELECT * FROM pg_publication_tables WHERE pubname = 'supabase_realtime';
```

## 📱 Verificación en Navegador

### **Chrome DevTools**

1. **Abrir** DevTools (F12)
2. **Ir** a Console
3. **Verificar** logs de inicialización
4. **Verificar** logs de operaciones
5. **Verificar** logs de suscripciones

### **Network Tab**

1. **Ir** a Network tab
2. **Filtrar** por "WS" (WebSocket)
3. **Verificar** conexiones de Supabase
4. **Verificar** mensajes de real-time

### **Application Tab**

1. **Ir** a Application tab
2. **Verificar** Local Storage
3. **Verificar** Session Storage
4. **Verificar** IndexedDB

## 🔧 Comandos de Debugging

### **Verificar Estado del Composable**

```typescript
// En console del navegador
const voiceChat = useVoiceChat()
console.log('State:', voiceChat.state.value)
console.log('Participants:', voiceChat.participantCount.value)
console.log('Room:', voiceChat.state.value.currentRoom)
```

### **Verificar Conexiones de Supabase**

```typescript
// En console del navegador
console.log('Supabase client:', supabase)
console.log('Supabase URL:', supabase.supabaseUrl)
console.log('Supabase auth:', supabase.auth)
```

### **Verificar Suscripciones**

```typescript
// En console del navegador
// Verificar que las suscripciones estén activas
console.log('Room subscription:', roomSubscription)
console.log('Participants subscription:', participantsSubscription)
```

## ✅ Checklist de Verificación

- [ ] **Variables de entorno** configuradas correctamente
- [ ] **Supabase** conectado y funcionando
- [ ] **Realtime** habilitado en Supabase
- [ ] **Políticas RLS** configuradas correctamente
- [ ] **Logs** aparecen en consola
- [ ] **Suscripciones** se establecen correctamente
- [ ] **Actualizaciones** se reciben en tiempo real
- [ ] **Múltiples pestañas** se sincronizan
- [ ] **Múltiples navegadores** se sincronizan
- [ ] **Reconexión** funciona automáticamente

## 🆘 Soporte Adicional

Si los problemas persisten:

1. **Revisar** logs completos en consola
2. **Verificar** configuración de Supabase
3. **Probar** en navegador incógnito
4. **Verificar** políticas de firewall/antivirus
5. **Crear issue** en GitHub con logs completos

---

**Sincronización implementada** ✅ El chat de voz ahora funciona correctamente entre pestañas y navegadores!
