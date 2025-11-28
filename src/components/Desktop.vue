<template>
  <div class="desktop">
   <div class="container">
      <Window
        v-for="window in windows"
        :key="window.id"
        :window-id="window.id"
        :title="window.title"
        :initial-width="window.width"
        :initial-height="window.height"
        :initial-x="window.x"
        :initial-y="window.y"
        :style="{ zIndex: window.zIndex }"
        @close="closeWindow"
        @minimize="minimizeWindow"
        @bring-to-front="bringToFront"
      >
        <!-- Window content goes here -->
        <div>这是窗口 {{ window.title }} 的内容。</div>
      </Window>
      <slot></slot>
   </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import Window from './Window.vue';

const windows = ref([]);
let nextWindowId = 1;
let nextZIndex = 1000; // Starting z-index for windows

const openNewWindow = () => {
  const newWindow = {
    id: `window-${nextWindowId++}`,
    title: `窗口 ${nextWindowId - 1}`,
    width: 400,
    height: 300,
    x: 50 + ((nextWindowId -1) * 30 % (window.innerWidth - 400)), // Stagger initial positions, ensuring within bounds
    y: 50 + ((nextWindowId -1) * 30 % (window.innerHeight - 300)),
    zIndex: getNextZIndex(),
    minimized: false,
    maximized: false,
  };
  windows.value.push(newWindow);
};

const closeWindow = (id) => {
  windows.value = windows.value.filter(window => window.id !== id);
};

const minimizeWindow = (id) => {
  const windowToMinimize = windows.value.find(window => window.id === id);
  if (windowToMinimize) {
    windowToMinimize.minimized = !windowToMinimize.minimized; // Toggle minimize state
  }
};

const bringToFront = (id) => {
  const windowToFront = windows.value.find(window => window.id === id);
  if (windowToFront) {
    windowToFront.zIndex = getNextZIndex();
  }
};

const getNextZIndex = () => {
  return ++nextZIndex;
};


</script>

<style scoped>
.desktop {
  height: 100vh;
  width: 100%;
  position: relative;
  background-image: url('https://oss.nbtab.com/public/xxoo/d9727495-e303-4081-b0f0-73268b05dcf8.png?imageView2/2/w/1920'); /* Example wallpaper */
  background-size: cover;
  background-position: center;
}
.container {
  position: absolute;
  top: 0;
  left: 60px; /* Adjust for sidebar width */
  right: 0;
  bottom: 0;
  overflow: auto;
}
</style>
