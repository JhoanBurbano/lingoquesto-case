<template>
  <div class="min-h-screen bg-gradient-to-br from-[#F9F6FF] to-[#E8F8F5] p-4">
    <div class="container mx-auto max-w-7xl">
      <!-- Header -->
      <div class="text-center mb-8">
        <h1 class="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
          Responsive Design Test
        </h1>
        <p class="text-gray-600 text-sm sm:text-base lg:text-lg">
          Current breakpoint:
          <span class="font-mono font-bold text-[#967AFE]">{{ currentBreakpoint }}</span>
        </p>
        <p class="text-gray-500 text-xs sm:text-sm">Screen: {{ width }}x{{ height }}</p>
      </div>

      <!-- Responsive Grid Test -->
      <div
        class="grid-responsive grid-responsive-sm grid-responsive-md grid-responsive-lg gap-4 mb-8"
      >
        <div class="bg-white rounded-xl p-4 sm:p-6 lg:p-8 shadow-lg border border-gray-100">
          <h3 class="text-lg font-semibold text-gray-900 mb-2">Card 1</h3>
          <p class="text-gray-600 text-sm sm:text-base">
            This card adapts to different screen sizes
          </p>
        </div>

        <div class="bg-white rounded-xl p-4 sm:p-6 lg:p-8 shadow-lg border border-gray-100">
          <h3 class="text-lg font-semibold text-gray-900 mb-2">Card 2</h3>
          <p class="text-gray-600 text-sm sm:text-base">Responsive padding and spacing</p>
        </div>

        <div class="bg-white rounded-xl p-4 sm:p-6 lg:p-8 shadow-lg border border-gray-100">
          <h3 class="text-lg font-semibold text-gray-900 mb-2">Card 3</h3>
          <p class="text-gray-600 text-sm sm:text-base">Grid columns change with breakpoints</p>
        </div>

        <div class="bg-white rounded-xl p-4 sm:p-6 lg:p-8 shadow-lg border border-gray-100">
          <h3 class="text-lg font-semibold text-gray-900 mb-2">Card 4</h3>
          <p class="text-gray-600 text-sm sm:text-base">Mobile-first responsive design</p>
        </div>
      </div>

      <!-- Responsive Text Test -->
      <div class="bg-white rounded-xl p-4 sm:p-6 lg:p-8 shadow-lg border border-gray-100 mb-8">
        <h2 class="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-4">
          Responsive Typography
        </h2>
        <p
          class="text-responsive text-responsive-sm text-responsive-lg text-responsive-xl text-gray-600 mb-4"
        >
          This text changes size based on the screen size. On mobile it's smaller, on desktop it's
          larger.
        </p>
        <div class="space-y-2">
          <p class="text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl text-gray-500">
            XS: 12px | SM: 14px | MD: 16px | LG: 18px | XL: 20px
          </p>
        </div>
      </div>

      <!-- Responsive Layout Test -->
      <div class="bg-white rounded-xl p-4 sm:p-6 lg:p-8 shadow-lg border border-gray-100 mb-8">
        <h2 class="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-4">
          Responsive Layout
        </h2>

        <!-- Mobile: Stacked, Desktop: Side by side -->
        <div class="flex-responsive flex-responsive-sm gap-4 sm:gap-6 lg:gap-8">
          <div class="flex-1 bg-gray-50 rounded-lg p-4">
            <h3 class="font-semibold text-gray-900 mb-2">Left Column</h3>
            <p class="text-sm text-gray-600">This stacks on mobile, sits side by side on desktop</p>
          </div>

          <div class="flex-1 bg-gray-50 rounded-lg p-4">
            <h3 class="font-semibold text-gray-900 mb-2">Right Column</h3>
            <p class="text-sm text-gray-600">Responsive flexbox layout</p>
          </div>
        </div>
      </div>

      <!-- Responsive Button Test -->
      <div class="bg-white rounded-xl p-4 sm:p-6 lg:p-8 shadow-lg border border-gray-100 mb-8">
        <h2 class="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-4">
          Responsive Buttons
        </h2>

        <div class="flex flex-wrap gap-4">
          <button
            class="btn-mobile btn-desktop bg-[#967AFE] text-white px-4 py-2 rounded-lg hover:bg-[#967AFE]/90 transition-colors"
          >
            <span class="hidden sm:inline">Full Button Text</span>
            <span class="sm:hidden">Short</span>
          </button>

          <button
            class="btn-mobile btn-desktop bg-[#48D19C] text-white px-4 py-2 rounded-lg hover:bg-[#48D19C]/90 transition-colors"
          >
            <span class="hidden sm:inline">Another Button</span>
            <span class="sm:hidden">Btn</span>
          </button>
        </div>
      </div>

      <!-- Sidebar Toggle Test -->
      <div class="bg-white rounded-xl p-4 sm:p-6 lg:p-8 shadow-lg border border-gray-100 mb-8">
        <h2 class="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-4">
          Sidebar Toggle Test
        </h2>

        <div class="space-y-4">
          <div class="p-4 bg-gray-50 rounded-lg">
            <h3 class="font-semibold text-gray-900 mb-2">Desktop Sidebar</h3>
            <p class="text-sm text-gray-600 mb-4">
              En desktop, el botón de toggle es flotante y está posicionado al borde derecho del
              sidebar, sobresaliendo la mitad hacia afuera.
            </p>
            <div class="flex items-center gap-4">
              <div
                class="relative w-80 h-32 bg-gradient-to-b from-[#F9F6FF] to-white border border-gray-200 rounded-lg"
              >
                <!-- Simulated sidebar -->
                <div class="absolute inset-0 flex items-center justify-center text-gray-500">
                  Sidebar Content
                </div>
                <!-- Simulated floating toggle button -->
                <div
                  class="absolute -right-4 top-8 w-8 h-8 bg-white border-2 border-gray-200 rounded-full shadow-lg flex items-center justify-center"
                >
                  <div class="w-4 h-4 bg-gray-400 rounded-full"></div>
                </div>
              </div>
              <div class="text-sm text-gray-500">
                ← Botón flotante<br />
                sobresale 16px
              </div>
            </div>
          </div>

          <div class="p-4 bg-gray-50 rounded-lg">
            <h3 class="font-semibold text-gray-900 mb-2">Mobile Sidebar</h3>
            <p class="text-sm text-gray-600 mb-4">
              En mobile, el botón de toggle está en el header y abre/cierra el sidebar deslizable.
            </p>
            <div class="flex items-center gap-4">
              <div
                class="w-full h-16 bg-white border border-gray-200 rounded-lg flex items-center justify-between px-4"
              >
                <div class="w-8 h-8 bg-gray-300 rounded"></div>
                <div class="text-sm text-gray-600">Mobile Header</div>
                <div class="w-8 h-8 bg-[#967AFE] rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Layout Test -->
      <div class="bg-white rounded-xl p-4 sm:p-6 lg:p-8 shadow-lg border border-gray-100 mb-8">
        <h2 class="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-4">
          Layout Test - Mobile Sidebar Space Issue
        </h2>

        <div class="space-y-4">
          <div class="p-4 bg-green-50 rounded-lg border border-green-200">
            <h3 class="font-semibold text-green-900 mb-2">✅ Problema Solucionado</h3>
            <p class="text-sm text-green-700 mb-4">
              El espacio que ocupaba el sidebar en mobile ha sido eliminado. Ahora el main content
              ocupa todo el ancho disponible.
            </p>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div class="p-3 bg-white rounded border">
                <h4 class="font-medium text-gray-900 mb-2">Antes (Problema)</h4>
                <div class="text-xs text-gray-600 space-y-1">
                  <p>• Sidebar oculto pero ocupaba espacio</p>
                  <p>• Main content no ocupaba todo el ancho</p>
                  <p>• Layout roto en mobile</p>
                </div>
              </div>
              <div class="p-3 bg-white rounded border">
                <h4 class="font-medium text-gray-900 mb-2">Después (Solución)</h4>
                <div class="text-xs text-green-600 space-y-1">
                  <p>• Sidebar completamente fuera del flujo</p>
                  <p>• Main content ocupa 100% del ancho</p>
                  <p>• Layout perfecto en mobile</p>
                </div>
              </div>
            </div>
          </div>

          <div class="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h3 class="font-semibold text-blue-900 mb-2">🔧 Solución Implementada</h3>
            <p class="text-sm text-blue-700 mb-4">
              Se separó completamente el sidebar mobile del layout principal usando position: fixed
              y z-index.
            </p>
            <div class="bg-white p-3 rounded border text-xs font-mono text-gray-700">
              <p>
                <span class="text-blue-600">// Mobile sidebar - completamente fuera del flujo</span>
              </p>
              <p><span class="text-green-600">.sidebar-mobile-overlay</span> {</p>
              <p>&nbsp;&nbsp;position: fixed;</p>
              <p>&nbsp;&nbsp;z-index: 50;</p>
              <p>
                &nbsp;&nbsp;transform: translate-x-full;
                <span class="text-gray-500">// oculto por defecto</span>
              </p>
              <p>}</p>
            </div>
          </div>

          <div class="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
            <h3 class="font-semibold text-yellow-900 mb-2">📱 Cómo Probar</h3>
            <p class="text-sm text-yellow-700 mb-4">
              Para verificar que el problema está solucionado:
            </p>
            <ol class="text-sm text-yellow-700 list-decimal list-inside space-y-1">
              <li>Redimensionar la ventana a menos de 768px (mobile)</li>
              <li>Verificar que el main content ocupa todo el ancho</li>
              <li>Hacer clic en el botón de menú para abrir sidebar</li>
              <li>Verificar que el sidebar se desliza sin afectar el layout</li>
              <li>Hacer clic fuera para cerrar y verificar que no queda espacio</li>
            </ol>
          </div>
        </div>
      </div>

      <!-- Mobile Menu Test -->
      <div class="bg-white rounded-xl p-4 sm:p-6 lg:p-8 shadow-lg border border-gray-100 mb-8">
        <h2 class="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-4">
          Mobile Menu Test - Botón y Animación
        </h2>

        <div class="space-y-4">
          <div class="p-4 bg-purple-50 rounded-lg border border-purple-200">
            <h3 class="font-semibold text-purple-900 mb-2">🎯 Funcionalidad del Botón Mobile</h3>
            <p class="text-sm text-purple-700 mb-4">
              El botón de menú mobile ahora tiene su propia función y debería funcionar
              correctamente.
            </p>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div class="p-3 bg-white rounded border">
                <h4 class="font-medium text-gray-900 mb-2">Antes (Problema)</h4>
                <div class="text-xs text-gray-600 space-y-1">
                  <p>• Botón llamaba a handleToggle (desktop)</p>
                  <p>• Sidebar mobile no se abría</p>
                  <p>• Función incorrecta para mobile</p>
                </div>
              </div>
              <div class="p-3 bg-white rounded border">
                <h4 class="font-medium text-gray-900 mb-2">Después (Solución)</h4>
                <div class="text-xs text-purple-600 space-y-1">
                  <p>• Botón llama a handleMobileToggle</p>
                  <p>• Sidebar mobile se abre/cierra</p>
                  <p>• Función específica para mobile</p>
                </div>
              </div>
            </div>
          </div>

          <div class="p-4 bg-indigo-50 rounded-lg border border-indigo-200">
            <h3 class="font-semibold text-indigo-900 mb-2">🎬 Animación del Sidebar</h3>
            <p class="text-sm text-indigo-700 mb-4">
              Al cambiar de desktop a mobile, el sidebar se anima suavemente para ocultarse.
            </p>
            <div class="bg-white p-3 rounded border text-xs font-mono text-gray-700">
              <p><span class="text-indigo-600">// Animación al cambiar a mobile</span></p>
              <p><span class="text-green-600">.sidebar-desktop-to-mobile</span> {</p>
              <p>&nbsp;&nbsp;width: 0;</p>
              <p>&nbsp;&nbsp;opacity: 0;</p>
              <p>&nbsp;&nbsp;transition: all 500ms ease-in-out;</p>
              <p>}</p>
            </div>
          </div>

          <div class="p-4 bg-teal-50 rounded-lg border border-teal-200">
            <h3 class="font-semibold text-teal-900 mb-2">🧪 Testing de Funcionalidad</h3>
            <p class="text-sm text-teal-700 mb-4">
              Para verificar que todo funciona correctamente:
            </p>
            <ol class="text-sm text-teal-700 list-decimal list-inside space-y-1">
              <li>
                <strong>Botón Mobile:</strong> Redimensionar a mobile y hacer clic en el botón de
                menú
              </li>
              <li><strong>Sidebar Mobile:</strong> Verificar que se abre/cierra correctamente</li>
              <li>
                <strong>Animación Desktop→Mobile:</strong> Redimensionar de desktop a mobile y ver
                la animación
              </li>
              <li>
                <strong>Espacio:</strong> Verificar que no queda espacio del sidebar en mobile
              </li>
              <li>
                <strong>Navegación:</strong> Probar que la navegación cierra el sidebar mobile
              </li>
            </ol>
          </div>
        </div>
      </div>

      <!-- Toggle Mobile Debug Test -->
      <div class="bg-white rounded-xl p-4 sm:p-6 lg:p-8 shadow-lg border border-red-200 mb-8">
        <h2 class="text-xl sm:text-2xl lg:text-3xl font-bold text-red-900 mb-4">
          🚨 Toggle Mobile Debug Test - PROBLEMA IDENTIFICADO
        </h2>

        <div class="space-y-4">
          <div class="p-4 bg-red-50 rounded-lg border border-red-200">
            <h3 class="font-semibold text-red-900 mb-2">🐛 Problema: Botón Mobile No Funciona</h3>
            <p class="text-sm text-red-700 mb-4">
              El botón de menú mobile no está abriendo el sidebar. Se han implementado herramientas
              de debugging.
            </p>
            <div class="bg-white p-3 rounded border text-xs font-mono text-red-700">
              <p><span class="text-red-600">// Estado actual del debugging:</span></p>
              <p>• Botón Debug: Muestra estado en console</p>
              <p>• Botón Force Mobile: Fuerza modo mobile para testing</p>
              <p>• Status Indicator: Muestra estado del sidebar</p>
              <p>• Console logs: Verificar que handleMobileToggle se ejecuta</p>
            </div>
          </div>

          <div class="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
            <h3 class="font-semibold text-yellow-900 mb-2">🔧 Pasos de Debugging</h3>
            <p class="text-sm text-yellow-700 mb-4">Para diagnosticar el problema:</p>
            <ol class="text-sm text-yellow-700 list-decimal list-inside space-y-1">
              <li><strong>Redimensionar</strong> la ventana a menos de 768px (mobile)</li>
              <li>
                <strong>Hacer clic</strong> en el botón "Force Mobile" para forzar modo mobile
              </li>
              <li><strong>Hacer clic</strong> en el botón de menú (hamburguesa)</li>
              <li><strong>Verificar</strong> que aparecen logs en la console</li>
              <li><strong>Verificar</strong> que el Status Indicator cambia</li>
              <li><strong>Verificar</strong> que el sidebar aparece</li>
            </ol>
          </div>

          <div class="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h3 class="font-semibold text-blue-900 mb-2">📋 Checklist de Verificación</h3>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div class="p-3 bg-white rounded border">
                <h4 class="font-medium text-gray-900 mb-2">Console Logs</h4>
                <div class="text-xs text-gray-600 space-y-1">
                  <p>□ "handleMobileToggle called" aparece</p>
                  <p>□ Estado cambia de false a true</p>
                  <p>□ No hay errores JavaScript</p>
                </div>
              </div>
              <div class="p-3 bg-white rounded border">
                <h4 class="font-medium text-gray-900 mb-2">UI Changes</h4>
                <div class="text-xs text-gray-600 space-y-1">
                  <p>□ Status Indicator cambia a "OPEN"</p>
                  <p>□ Botón cambia de Menu a X</p>
                  <p>□ Sidebar aparece desde la izquierda</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Breakpoint Indicator -->
      <div class="breakpoint-indicator">
        {{ currentBreakpoint }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useResponsive } from '@/composables/useResponsive'

const { currentBreakpoint, width, height } = useResponsive()
</script>
