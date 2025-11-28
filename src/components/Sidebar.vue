<template>
  <div class="sidebar">
    <h2>Sidebar</h2>
    <button @click="addItem">Add Item</button>
  </div>
</template>

<script setup>
import { defineEmits } from 'vue';

const emit = defineEmits(['add-item']);

function addItem() {
  emit('add-item');
}
</script>

<style scoped>
.sidebar {
  position: fixed;
  left: 0;
  top: 0;
  height: 100%;
  width: 60px;
  background-color: rgba(25, 34, 44, 0.281);
  backdrop-filter: blur(10px);
  border-right: 1px solid rgba(204, 204, 204, 0.5);
  z-index: 1000;
}
</style>
