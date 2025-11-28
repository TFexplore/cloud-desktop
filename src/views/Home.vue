<template>
  <MainLayout @add-item="addItem">
    <GridLayout
      v-model:layout="layout"
      :col-num="12"
      :row-height="30"
      :is-draggable="true"
      :is-resizable="true"
      :vertical-compact="false"
      :use-css-transforms="true"
    >
      <GridItem
        v-for="item in layout"
        :key="item.i"
        :static="item.static"
        :x="item.x"
        :y="item.y"
        :w="item.w"
        :h="item.h"
        :i="item.i"
      >
        <span class="text">{{ item.i }}</span>
      </GridItem>
    </GridLayout>
  </MainLayout>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { GridLayout, GridItem } from 'vue-grid-layout-v3';
import MainLayout from '../layouts/MainLayout.vue';
import { dataService } from '../services/dataService.js';

const layout = ref([]);

onMounted(() => {
  layout.value = dataService.loadLayout();
});

watch(
  layout,
  (newLayout) => {
    dataService.saveLayout(newLayout);
  },
  { deep: true }
);

function addItem() {
  const newItem = {
    x: (layout.value.length * 2) % 12,
    y: layout.value.length + 12, // Puts item at the bottom
    w: 2,
    h: 2,
    i: String(layout.value.length),
    static: false,
  };
  layout.value.push(newItem);
}
</script>

<style>
.vue-grid-layout {
  background: transparent;
}
.vue-grid-item:not(.vue-grid-placeholder) {
  background: rgba(204, 204, 204, 0.8);
  border: 1px solid black;
}
.vue-grid-item .text {
  font-size: 24px;
  text-align: center;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  margin: auto;
  height: 1.5em;
}
</style>