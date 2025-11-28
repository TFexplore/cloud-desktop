<template>
  <div class="main-layout">
    <Sidebar @add-item="onAddItem" />
    <Desktop>
      <slot></slot>
    </Desktop>
  </div>
</template>

<script setup>
import { defineEmits } from 'vue';
import Sidebar from '../components/Sidebar.vue';
import Desktop from '../components/Desktop.vue';

const emit = defineEmits(['add-item']);

function onAddItem() {
  emit('add-item');
}
</script>

<style scoped>
.main-layout {
  position: relative;
}
</style>