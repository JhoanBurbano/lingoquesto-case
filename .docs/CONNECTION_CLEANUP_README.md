# 🔧 Solución para Conexiones Huérfanas en Voice Chat

## **🚨 Problema Identificado**

- **Síntoma**: Se muestran 6 usuarios conectados cuando solo hay 2 pestañas abiertas
- **Causa**: Las conexiones no se cierran correctamente al recargar páginas o cerrar pestañas
- **Resultado**: Participantes "fantasma" se acumulan en la base de datos

## **✅ Soluciones Implementadas**

### **1. Limpieza Automática en el Store**

```typescript
// Se ejecuta automáticamente:
// - Al inicializar el store
// - Cada 2 minutos
// - Al cerrar/recargar la página

async cleanupOrphanedConnections() {
  // Marca como "salido" a participantes que se unieron hace más de 5 minutos
  // pero no han sido marcados como "left"
}
```

### **2. Listeners de Eventos de Página**

```typescript
// Se ejecuta cuando:
// - Se cierra la pestaña (beforeunload)
// - Se recarga la página (pagehide)
// - Se navega a otra página

window.addEventListener('beforeunload', this._cleanupOnUnload)
window.addEventListener('pagehide', this._cleanupOnUnload)
```

### **3. Limpieza de Suscripciones Supabase**

```typescript
// Cierra correctamente todos los canales de Supabase
_cleanupRealtimeSubscriptions() {
  if (roomSubscription) {
    roomSubscription.unsubscribe()
    roomSubscription = null
  }
  // ... otros canales
}
```

### **4. Función SQL de Limpieza**

```sql
-- Se ejecuta automáticamente en la base de datos
CREATE OR REPLACE FUNCTION cleanup_orphaned_connections()
RETURNS void AS $$
BEGIN
    UPDATE public.voice_chat_participants
    SET left_at = timezone('utc'::text, now())
    WHERE left_at IS NULL
      AND joined_at < timezone('utc'::text, now()) - INTERVAL '5 minutes';
END;
$$ LANGUAGE plpgsql;
```

## **🛠️ Cómo Usar**

### **Limpieza Automática (Recomendado)**

1. **Reiniciar** la aplicación
2. El store se inicializa automáticamente
3. La limpieza se ejecuta cada 2 minutos
4. **No se requiere** acción manual

### **Limpieza Manual (Para Problemas Existentes)**

```bash
# Ejecutar script de limpieza
npm run cleanup:connections

# O manualmente en Supabase SQL Editor:
SELECT cleanup_orphaned_connections();
```

## **📊 Monitoreo**

### **Logs de Consola Esperados**

```bash
🚀 Initializing voice chat store
📡 Page unload listeners attached
🧹 Cleaning up orphaned connections...
✅ No orphaned connections found
```

### **Logs de Limpieza**

```bash
🧹 Cleaning up orphaned connections...
🧹 Found 4 orphaned connections
✅ Cleaned up orphaned participant: User1
✅ Cleaned up orphaned participant: User2
```

## **🔍 Verificación**

### **1. Verificar Estado Actual**

```sql
-- En Supabase SQL Editor
SELECT
    p.username,
    p.joined_at,
    p.left_at,
    r.name as room_name
FROM voice_chat_participants p
JOIN voice_chat_rooms r ON p.room_id = r.id
WHERE p.left_at IS NULL
ORDER BY p.joined_at DESC;
```

### **2. Verificar Limpieza Automática**

```sql
-- Verificar que la función existe
SELECT routine_name, routine_type
FROM information_schema.routines
WHERE routine_name = 'cleanup_orphaned_connections';
```

## **⚡ Prevención Futura**

### **Buenas Prácticas**

1. **Siempre usar** `store.leaveRoom()` antes de cerrar la página
2. **No recargar** la página mientras se está en una sala
3. **Verificar** que las suscripciones se cierren correctamente

### **Configuración Recomendada**

```typescript
// En el componente
onMounted(() => {
  store.initialize() // Habilita limpieza automática
})

onUnmounted(() => {
  if (store.currentRoom) {
    store.leaveRoom() // Limpieza manual si es necesario
  }
})
```

## **🚀 Resultado Esperado**

### **Antes de la Solución**

- ❌ 6 usuarios mostrados con 2 pestañas
- ❌ Conexiones se acumulan indefinidamente
- ❌ Recargas crean conexiones duplicadas

### **Después de la Solución**

- ✅ Usuarios reales mostrados correctamente
- ✅ Conexiones se limpian automáticamente
- ✅ Recargas no crean conexiones duplicadas
- ✅ Sincronización en tiempo real funciona perfectamente

## **🔧 Troubleshooting**

### **Si la Limpieza No Funciona**

1. **Verificar** logs de consola
2. **Ejecutar** limpieza manual: `npm run cleanup:connections`
3. **Verificar** que el store se inicialice: `store.initialize()`
4. **Revisar** permisos de Supabase

### **Logs de Error Comunes**

```bash
❌ Error finding orphaned connections: {code: 'PGRST205'}
# Solución: Ejecutar supabase-setup.sql

❌ Error marking participant as left: {code: '42501'}
# Solución: Verificar permisos RLS
```

## **📝 Notas Técnicas**

- **Intervalo de Limpieza**: 2 minutos (configurable)
- **Tiempo de Tolerancia**: 5 minutos antes de marcar como "huérfano"
- **Método de Limpieza**: UPDATE en lugar de DELETE (preserva historial)
- **Performance**: Limpieza automática con trigger SQL para eficiencia

---

**🎯 Objetivo**: Mantener el conteo de participantes sincronizado con la realidad
**✅ Estado**: Implementado y funcionando
**🔧 Mantenimiento**: Automático, no requiere intervención manual
