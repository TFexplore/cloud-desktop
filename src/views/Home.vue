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

        @move="moveEvent"
        @moved="movedEvent">

        <div class="desktop-item" @click="handleItemClick(item)">
          <template v-if="item.type === 'app'">
            <div class="app-content">
              <img v-if="item.icon" :src="item.icon" :alt="item.name" class="app-icon" />
              <div v-else-if="item.iconText" class="app-icon-text">{{ item.iconText }}</div>
              <span class="app-name">{{ item.name }}</span>
            </div>
          </template>
          <template v-else-if="item.type === 'component'">
            <div class="component-content">
              <div class="component-name">{{ item.name }}</div>
              <div :id="`component-html-${item.i}`" v-html="item.html"></div>
            </div>
          </template>
        </div>
      </GridItem>
    </GridLayout>
  </MainLayout>
</template>

<script setup>
import { ref, onMounted, watch, nextTick, onBeforeUnmount } from 'vue';
import { GridLayout, GridItem } from 'vue-grid-layout-v3';
import MainLayout from '../layouts/MainLayout.vue';
import { dataService } from '../services/dataService.js';

const layout = ref([]);
let isDragging = ref(false); // Add a ref to track dragging state
const injectedStyleElements = new Map(); // Use Map to store style elements for cleanup

onMounted(() => {
  layout.value = dataService.loadLayout();
  nextTick(executeAllComponentLogic);
});

onBeforeUnmount(() => {
  // Clean up dynamically injected styles when component is unmounted
  injectedStyleElements.forEach(styleElement => {
    if (styleElement && styleElement.parentNode) {
      styleElement.parentNode.removeChild(styleElement);
    }
  });
});

watch(
  layout,
  (newLayout) => {
    dataService.saveLayout(newLayout);
    // When layout changes, re-run all component logic to ensure consistency
    // This will also clean up old styles and inject new ones as needed.
    nextTick(executeAllComponentLogic);
  },
  { deep: true }
);

function moveEvent(i, newX, newY){
        console.log(" isDragging = true");
        isDragging = true
    }
function movedEvent(i, newX, newY){
        console.log(" isDragging = movedEvent"+isDragging);
        setTimeout(() => {
          isDragging = false
           console.log(" isDragging = false");
        },500); // 延迟1秒设置为false
    }
function handleItemClick(item) {
   console.log(" click"+isDragging);
  if (isDragging) { // Prevent click if dragging
    return;
  }
  if (item.type === 'app') {
    if (item.openMode === 'newTab') {
      window.open(item.link, '_blank');
    } else if (item.openMode === 'window') {
      const width = (item.windowWidth || 80) / 100 * window.screen.width;
      const height = (item.windowHeight || 70) / 100 * window.screen.height;
      window.open(item.link, '_blank', `width=${width},height=${height}`);
    }
  }
}

function executeAllComponentLogic() {
  // Clear all previously injected styles
  injectedStyleElements.forEach(styleElement => {
    if (styleElement && styleElement.parentNode) {
      styleElement.parentNode.removeChild(styleElement);
    }
  });
  injectedStyleElements.clear(); // Clear the map

  layout.value.forEach(item => {
    if (item.type === 'component') {
      executeComponentLogicForItem(item);
    }
  });
}

function executeComponentLogicForItem(item) {
  if (item.type === 'component') {
    // Inject CSS
    if (item.css) {
      const style = document.createElement('style');
      style.type = 'text/css';
      style.innerHTML = item.css;
      document.head.appendChild(style);
      injectedStyleElements.set(item.i, style); // Store reference for cleanup
    }

    // Execute JS
    if (item.js) {
      try {
        // Evaluate the JS code in a new Function context
        // This assumes the JS can find its elements by ID or other means.
        // For component isolation, consider using iframes.
        new Function(item.js)();
      } catch (e) {
        console.error(`Error executing component script for ${item.name} (${item.i}):`, e);
      }
    }
  }
}

// For demonstration, addItem will alternate between app and component
function addItem() {
  const newItemId = String(layout.value.length);
  const isApp = layout.value.length % 2 === 0; // Alternate between app and component

  let newItem;
  if (isApp) {
    newItem = {
      x: (layout.value.length * 2) % 12,
      y: layout.value.length + 12, // Puts item at the bottom
      w: 2,
      h: 2,
      i: newItemId,
      static: false,
      type: 'app',
      name: `新应用 ${newItemId}`,
      link: 'https://www.example.com',
      iconText: '新',
      openMode: 'newTab',
    };
  } else {
    newItem = {
      x: (layout.value.length * 2) % 12,
      y: layout.value.length + 12, // Puts item at the bottom
      w: 2,
      h: 4,
      i: newItemId,
      static: false,
      type: 'component',
      name: `新组件 ${newItemId}`,
      html: `<div>这是新组件 ${newItemId} 的内容。</div>`,
      css: `#component-html-${newItemId} div { border: 1px solid red; padding: 10px; background-color: lightyellow; }`,
      js: `console.log('新组件 ${newItemId} 加载了，当前时间：' + new Date().toLocaleTimeString());`,
    };
  }
  layout.value.push(newItem);
  nextTick(() => {
    executeComponentLogicForItem(newItem);
  });
}
</script>

<style>
.vue-grid-layout {
  background: transparent;
}
.vue-grid-item:not(.vue-grid-placeholder) {
  background: rgba(255, 255, 255,1);
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

.desktop-item {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  cursor: pointer;
  box-sizing: border-box;
  overflow: hidden; /* Ensure content doesn't overflow grid item */
}

.app-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between; /* 图标和文字垂直方向上分布在两端 */
  text-align: center;
  width: 100%;
  height: 100%;
  box-sizing: border-box; /* 包含 padding 在宽度和高度内 */
}

.app-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  /* 使用 space-between 让图标和文字垂直方向上分布在两端 */
  justify-content: space-between;
  width: 100%;
  height: 100%;
  box-sizing: border-box; /* 包含 padding 在宽度和高度内 */
}

.app-icon {
  max-width: 100%; /* 最大宽度不超过父容器 */
  height: 70%; /* 设置固定高度为父容器的80% */
  object-fit: contain; /* 确保图像完整显示，不拉伸 */
  margin: auto; /* 在 flex 容器中居中 */
  margin-bottom: 5px; /* 与文字保持间距 */
}

.app-icon-text {
  font-size: 30px;
  font-weight: bold;
  color: #333;
  max-width: 100%; /* 最大宽度不超过父容器 */
  height: 80%; /* 设置固定高度为父容器的80% */
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 5px;
  background-color: #eee;
  margin: auto; /* 在 flex 容器中居中 */
  margin-bottom: 5px; /* 与文字保持间距 */
}

.app-name {
  font-size: 14px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 100%;
  height:30%; /* 设置固定高度为父容器的20% */
  display: flex; /* 使用 flexbox 居中文字 */
  justify-content: center;
  align-items: center;
  text-align: center; /* 确保文字居中 */
}

.component-content {
  width: 100%;
  height: 100%;
  overflow: auto;
  display: flex;
  flex-direction: column;
}

.component-name {
  font-size: 14px;
  font-weight: bold;
  margin-bottom: 5px;
  text-align: center;
}
</style>
