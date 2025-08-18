<script setup lang="ts">
/* Portal simple con Teleport */
</script>

<template>
  <teleport to="body">
    <div data-slot="alert-dialog-portal">
      <slot />
    </div>
  </teleport>
</template>
