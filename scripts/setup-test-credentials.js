#!/usr/bin/env node

/**
 * Script para configurar credenciales de prueba en LingoQuesto
 * Ejecutar: node scripts/setup-test-credentials.js
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const envLocalPath = path.join(__dirname, '..', '.env.local')
const envExamplePath = path.join(__dirname, '..', 'env.example')

console.log('🧪 Configurando Credenciales de Prueba para LingoQuesto')
console.log('='.repeat(60))

// Verificar si .env.local existe
if (fs.existsSync(envLocalPath)) {
  console.log('✅ Archivo .env.local encontrado')

  // Leer contenido actual
  const currentEnv = fs.readFileSync(envLocalPath, 'utf8')

  // Verificar si ya tiene credenciales de prueba
  if (currentEnv.includes('VITE_TEST_EMAIL')) {
    console.log('⚠️  Las credenciales de prueba ya están configuradas')
    console.log('📝 Puedes editarlas manualmente en .env.local')
    process.exit(0)
  }

  // Agregar credenciales de prueba
  const testCredentials = `
# Test Credentials (for development only)
VITE_TEST_EMAIL=test@lingoquesto.com
VITE_TEST_PASSWORD=test123456
VITE_TEST_USER_NAME=Usuario de Prueba
`

  fs.appendFileSync(envLocalPath, testCredentials)
  console.log('✅ Credenciales de prueba agregadas a .env.local')
} else {
  console.log('❌ Archivo .env.local no encontrado')
  console.log('📝 Creando archivo .env.local con credenciales de prueba...')

  // Leer env.example
  const envExample = fs.readFileSync(envExamplePath, 'utf8')

  // Crear .env.local con credenciales de prueba
  const envLocalContent =
    envExample +
    `
# Test Credentials (for development only)
VITE_TEST_EMAIL=test@lingoquesto.com
VITE_TEST_PASSWORD=test123456
VITE_TEST_USER_NAME=Usuario de Prueba
`

  fs.writeFileSync(envLocalPath, envLocalContent)
  console.log('✅ Archivo .env.local creado con credenciales de prueba')
}

console.log('\n🎯 Credenciales de Prueba Configuradas:')
console.log('📧 Email: test@lingoquesto.com')
console.log('🔑 Contraseña: test123456')
console.log('👤 Nombre: Usuario de Prueba')
console.log('\n💡 Ahora puedes usar el botón "🧪 Usar Credenciales de Prueba" en el login')
console.log('⚠️  Recuerda: Estas credenciales solo son para desarrollo')

// Verificar que Supabase esté configurado
const envContent = fs.readFileSync(envLocalPath, 'utf8')
if (!envContent.includes('VITE_SUPABASE_URL') || !envContent.includes('VITE_SUPABASE_ANON_KEY')) {
  console.log('\n⚠️  ADVERTENCIA: Supabase no está configurado')
  console.log('📝 Asegúrate de configurar VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY')
  console.log('🔗 Puedes usar: npm run setup:env')
}

console.log('\n✨ Configuración completada exitosamente!')
