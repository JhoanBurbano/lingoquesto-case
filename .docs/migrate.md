# Guía de Migración a Vue 3 (TypeScript)

Esta guía documenta cómo migrar el proyecto actual (React + TS) a Vue 3 + Vite + TypeScript, usando Pinia para estado global, vue-router para rutas, composables en lugar de hooks, y equivalentes de UI/animación.

## 1) Mapa del proyecto actual

Raíz `~/Downloads/LingoQuesto-tech/`:
- `App.tsx`: enrutamiento manual por sección vía `useSidebar()`;
  integra `VoiceChatProvider` en `oral-practice`.
- `components/`: layout, navegación, vistas y voz.
  - Layout/nav: `AppLayout.tsx`, `LingoSidebar.tsx`, `MobileSidebar.tsx`.
  - Vistas: `TeacherDashboard.tsx`, `AchievementsView.tsx`, `StudentsViews.tsx`, `StudentDetailView.tsx`, `CaseStudyView.tsx`.
  - Voz: `VoiceChatRoom.tsx`, `VoiceChatLogin.tsx`, `VoiceMessageItem.tsx`, `VoiceRecorder.tsx`, `VoiceActivityIndicator.tsx`.
  - UI: `components/ui/*`, `components/figma/*`.
- `contexts/VoiceChatContext.tsx`: reducer + `BroadcastChannel`.
- `hooks/useVoiceRecorder.ts`: MediaRecorder.
- `utils/studentUtils.ts`.
- `types/voice-chat.ts`.
- `styles/globals.css`.
- `data/students.ts`.
- `imports/*`: tokens/SVG.

Patrones:
- Estado de navegación en `AppLayout` (Context) sin React Router.
- Estado global de voz con Context + Reducer.
- Animaciones con `motion/react` (Framer Motion para React).
- Iconos `lucide-react`, toasts `sonner`, Tailwind CSS.

## 2) Stack destino (Vue)

- Vite + Vue 3 + TypeScript
- vue-router
- Pinia
- @vueuse/core (breakpoints, utilidades)
- @vueuse/motion (o Motion One) para animaciones
- lucide-vue-next (iconos)
- vue-sonner (toasts)
- Tailwind CSS (reusar `styles/globals.css`)

## 3) Estructura objetivo (propuesta)

```
src/
  main.ts
  App.vue
  router/index.ts
  layouts/AppLayout.vue
  components/
    LingoSidebar.vue
    MobileSidebar.vue
    LingoLogo.vue
    LingoCharacter.vue
    DecorativePattern.vue
    GradientButton.vue
    voice/VoiceRecorder.vue
    voice/VoiceMessageItem.vue
    voice/VoiceActivityIndicator.vue
    ui/* (equivalentes Vue)
  views/
    Dashboard.vue
    Students.vue
    StudentDetail.vue
    Activities.vue
    Reports.vue
    Progress.vue
    Calendar.vue
    Notifications.vue
    Settings.vue
    Achievements.vue
    CaseStudy.vue
    OralPractice.vue  # ≈ VoiceChatRoom
  stores/voiceChat.ts
  composables/useVoiceRecorder.ts
  types/voice-chat.ts
  utils/studentUtils.ts
  data/students.ts
  assets/
styles/
  globals.css
```

## 4) Migración por fases

1. Preparación
   - Crear proyecto Vite (Vue + TS) e instalar dependencias.
   - Configurar Tailwind e importar `styles/globals.css`.

2. Router + Layout
   - Crear `router/index.ts` con rutas: `dashboard`, `students`, `activities`, `reports`, `oral-practice`, `progress`, `calendar`, `notifications`, `settings`, `achievements`, `case-study`.
   - Migrar `AppLayout.tsx` a `layouts/AppLayout.vue`.
     - `SidebarContext` -> Pinia `useUiStore` (`isMobile`, `isMobileSidebarOpen`, `isSidebarCollapsed`).
     - `currentSection` -> `route.name` + `router.push()`.
     - Animaciones: `@vueuse/motion` o `<Transition>`.

3. Sidebar y navegación
   - Migrar `LingoSidebar.tsx` a `components/LingoSidebar.vue`.
     - `onSectionChange(id)` -> `router.push({ name: id })`.
     - Iconos `lucide-vue-next`.

4. Vistas
   - Migrar vistas a `views/*.vue` (JSX -> template SFC) manteniendo Tailwind.

5. Estado de voz (Context -> Pinia)
   - Crear `stores/voiceChat.ts`:
     - Estado: `messages`, `currentUser`, `isRecording`, `recordingDuration`, `playbackSpeed`.
     - Acciones: `login`, `logout`, `addMessage`, `startRecording`, `stopRecording`, `updateRecordingDuration`, `setPlaybackSpeed`, `setMessagePlaying`.
     - `BroadcastChannel`: inicializar en `onMounted` del store (o `useBroadcastChannel` de VueUse) y limpiar en `onUnmounted`.

6. Composable de grabación
   - Migrar `hooks/useVoiceRecorder.ts` -> `composables/useVoiceRecorder.ts` (refs/reactive, `onBeforeUnmount`).
   - Integrar con store de voz para añadir mensajes y duración.

7. Componentes de voz
   - `VoiceChatLogin.tsx` -> `components/voice/VoiceChatLogin.vue`.
   - `VoiceChatRoom.tsx` -> `views/OralPractice.vue`.
   - `VoiceMessageItem.tsx`, `VoiceRecorder.tsx`, `VoiceActivityIndicator.tsx` -> `components/voice/*`.
   - Reemplazar `sonner` por `vue-sonner`.

8. UI y utilidades
   - `components/ui/*`: migrar a shadcn-vue/Headless UI o componentes propios con Tailwind.
   - `utils/studentUtils.ts`, `data/students.ts`: mover a `src/utils` y `src/data`.
   - `imports/*`: convertir a componentes Vue o módulos TS en `src/assets/tokens/*`.

9. QA y paridad
   - Verificar rutas, toasts, animaciones, responsividad, MediaRecorder y BroadcastChannel.

## 5) Mapeo archivo a archivo

- `App.tsx` -> `App.vue` + `router/index.ts`
  - `MainContent()` -> `<RouterView />`.
  - `VoiceChatProvider` -> Pinia store global (envolver app con `pinia`).

- `components/AppLayout.tsx` -> `layouts/AppLayout.vue`
  - `SidebarContext` -> Pinia `useUiStore`.
  - `useIsMobile` -> `@vueuse/core` (`useBreakpoints` o `useWindowSize`).

- `components/LingoSidebar.tsx` -> `components/LingoSidebar.vue`
  - `onSectionChange` -> `router.push`.
  - Animaciones `motion` -> `@vueuse/motion`/`<Transition>`.

- `contexts/VoiceChatContext.tsx` -> `stores/voiceChat.ts`
  - Reducer/dispatch -> acciones Pinia.
  - `BroadcastChannel` -> `useBroadcastChannel` o API nativa.

- `hooks/useVoiceRecorder.ts` -> `composables/useVoiceRecorder.ts`
  - `ref/reactive` + limpieza de `MediaRecorder` en `onBeforeUnmount`.

- `components/VoiceChatRoom.tsx` -> `views/OralPractice.vue`
  - `useVoiceChat()` -> `useVoiceChatStore()`.
  - `toast` -> `vue-sonner`.
  - Scroll a bottom con `ref`, `watch(messages)`, `nextTick`.

- `types/voice-chat.ts` -> `src/types/voice-chat.ts`
- `components/ui/*` -> equivalentes Vue (Button, Badge, Card, ScrollArea, Separator, Toaster).

## 6) Comandos útiles

Inicializar proyecto Vue + TS:
```
npm create vite@latest lq-vue -- --template vue-ts
cd lq-vue
```
Instalar dependencias:
```
npm i vue-router pinia @vueuse/core @vueuse/motion lucide-vue-next vue-sonner
```
Tailwind CSS:
```
npm i -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```
Configurar Tailwind en `tailwind.config.js` y añade `styles/globals.css` a `main.ts`.

## 7) Sketch de implementación (referencia)

- `main.ts`:
```
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import './styles/globals.css'

const app = createApp(App)
app.use(createPinia())
app.use(router)
app.mount('#app')
```

- `stores/voiceChat.ts` (firma aproximada):
```
import { defineStore } from 'pinia'
import type { ChatState, VoiceMessage } from '@/types/voice-chat'

export const useVoiceChatStore = defineStore('voice', {
  state: (): ChatState & { channel?: BroadcastChannel } => ({
    messages: [],
    currentUser: { nickname: '', isLoggedIn: false },
    isRecording: false,
    recordingDuration: 0,
    playbackSpeed: 1,
    channel: undefined,
  }),
  actions: {
    login(nick: string) { this.currentUser = { nickname: nick, isLoggedIn: true } },
    logout() { this.currentUser = { nickname: '', isLoggedIn: false }; this.messages = [] },
    addMessage(m: VoiceMessage) { this.messages.push(m) },
    startRecording() { this.isRecording = true; this.recordingDuration = 0 },
    stopRecording() { this.isRecording = false; this.recordingDuration = 0 },
    updateRecordingDuration(n: number) { this.recordingDuration = n },
    setPlaybackSpeed(n: number) { this.playbackSpeed = n },
    setMessagePlaying(id: string, playing: boolean) {
      this.messages = this.messages.map(m => ({ ...m, isPlaying: m.id === id ? playing : false }))
    },
    initChannel() {
      if (this.channel) return
      const ch = new BroadcastChannel('voice-chat')
      ch.onmessage = (e) => {
        if (e.data.type === 'NEW_MESSAGE' && e.data.sender !== this.currentUser.nickname) {
          this.addMessage(e.data.message)
        }
      }
      this.channel = ch
    },
    disposeChannel() { this.channel?.close(); this.channel = undefined },
  }
})
```

- `composables/useVoiceRecorder.ts`: migrar la lógica actual 1:1 con `ref` y `MediaRecorder`.

## 8) Riesgos y mitigación

- Animaciones (Framer Motion) -> `@vueuse/motion` o CSS transitions.
- UI `components/ui/*`: puede requerir re-implementación de algunos componentes.
- `BroadcastChannel` en Safari iOS: validar compatibilidad o proveer fallback.
- API `MediaRecorder`: testear permisos y comportamiento en navegadores objetivo.

## 9) Hitos y entregables

1. Base (Vite + Tailwind + Router + Pinia) + `AppLayout` + `LingoSidebar` navegando.
2. Vistas estáticas migradas (dashboard, students, achievements, case-study).
3. Store de voz + composable de grabación + `OralPractice.vue` operativa.
4. Paridad visual/UX, animaciones y toasts pulidas.

---

¿Siguiente paso? Inicializaré el esqueleto Vue y migraré `AppLayout`, `LingoSidebar` y `OralPractice` como ejemplo para escalar el resto.
