<script setup lang="ts"></script>
<template>
  <teleport to="body">
    <div data-slot="dialog-portal"><slot /></div>
  </teleport>
</template>
