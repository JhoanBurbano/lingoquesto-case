<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <label
    data-slot="label"
    v-bind="$attrs"
    :class="[
      'flex items-center gap-2 text-sm leading-none font-medium select-none',
      'group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50',
      'peer-disabled:cursor-not-allowed peer-disabled:opacity-50',
    ]"
  >
    <slot />
  </label>
</template>

<script setup lang="ts">
// Componente simple de Label para Vue 3 (sin dependencia de radix-vue).
// Reenvía todos los atributos nativos (incluido `for`, `id`, `aria-*`, etc.)
// y permite clases adicionales a través de `class`.
</script>

<!--
  Uso:
  
  <script setup lang="ts">
  import Label from '@/ui/Label.vue'
  </script>
  
  <template>
    <div class="grid gap-2">
      <Label for="email">Correo</Label>
      <input id="email" type="email" class="border px-3 py-2 rounded-md" />
    </div>
  </template>
  -->
