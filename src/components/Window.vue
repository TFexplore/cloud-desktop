<template>
  <teleport to="body">
    <div class="window" :style="{ width: width + 'px', height: height + 'px', left: x + 'px', top: y + 'px', zIndex: zIndex }" @mousedown="bringToFront">
      <div class="window-header" @mousedown="startDrag">
        <span class="window-title">{{ title }}</span>
        <div class="window-controls">
          <button @click="minimizeWindow">_</button>
          <button @click="toggleMaximize">{{ isMaximized ? '&#x2752;' : '&#x2750;' }}</button>
          <button @click="closeWindow">X</button>
        </div>
      </div>
      <div class="window-content">
        <slot></slot>
      </div>
      <div class="window-resizer top-left" @mousedown="startResize('topLeft', $event)"></div>
      <div class="window-resizer top-right" @mousedown="startResize('topRight', $event)"></div>
      <div class="window-resizer bottom-left" @mousedown="startResize('bottomLeft', $event)"></div>
      <div class="window-resizer bottom-right" @mousedown="startResize('bottomRight', $event)"></div>
      <div class="window-resizer top" @mousedown="startResize('top', $event)"></div>
      <div class="window-resizer bottom" @mousedown="startResize('bottom', $event)"></div>
      <div class="window-resizer left" @mousedown="startResize('left', $event)"></div>
      <div class="window-resizer right" @mousedown="startResize('right', $event)"></div>
    </div>
  </teleport>
</template>

<script>
export default {
  name: 'Window',
  props: {
    title: {
      type: String,
      default: '新窗口'
    },
    initialWidth: {
      type: Number,
      default: 400
    },
    initialHeight: {
      type: Number,
      default: 300
    },
    initialX: {
      type: Number,
      default: 50
    },
    initialY: {
      type: Number,
      default: 50
    },
    windowId: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      x: this.initialX,
      y: this.initialY,
      width: this.initialWidth,
      height: this.initialHeight,
      isDragging: false,
      isResizing: false,
      resizeHandle: '',
      isMaximized: false,
      originalX: 0,
      originalY: 0,
      originalWidth: 0,
      originalHeight: 0,
      zIndex: 1000 // Initial z-index
    };
  },
  mounted() {
    document.addEventListener('mousemove', this.doDragOrResize);
    document.addEventListener('mouseup', this.stopDragOrResize);
  },
  beforeUnmount() {
    document.removeEventListener('mousemove', this.doDragOrResize);
    document.removeEventListener('mouseup', this.stopDragOrResize);
  },
  methods: {
    bringToFront() {
      // Emit an event to the parent to update z-index
      this.$emit('bring-to-front', this.windowId);
    },
    startDrag(event) {
      if (this.isMaximized) return; // Cannot drag when maximized
      this.isDragging = true;
      this.startX = event.clientX - this.x;
      this.startY = event.clientY - this.y;
      this.bringToFront();
    },
    startResize(handle, event) {
      if (this.isMaximized) return; // Cannot resize when maximized
      this.isResizing = true;
      this.resizeHandle = handle;
      this.startX = event.clientX;
      this.startY = event.clientY;
      this.startWidth = this.width;
      this.startHeight = this.height;
      this.startXPos = this.x;
      this.startYPos = this.y;
      this.bringToFront();
    },
    doDragOrResize(event) {
      if (this.isDragging) {
        this.x = event.clientX - this.startX;
        this.y = event.clientY - this.startY;
      } else if (this.isResizing) {
        this.handleResize(event);
      }
    },
    handleResize(event) {
      const resizeSpeed = 0.8; // 调整尺寸调整的速度，值越小速度越慢
      const dx = (event.clientX - this.startX) * resizeSpeed;
      const dy = (event.clientY - this.startY) * resizeSpeed;

      switch (this.resizeHandle) {
        case 'topLeft':
          this.x = this.startXPos + dx;
          this.y = this.startYPos + dy;
          this.width = this.startWidth - dx;
          this.height = this.startHeight - dy;
          break;
        case 'topRight':
          this.y = this.startYPos + dy;
          this.width = this.startWidth + dx;
          this.height = this.startHeight - dy;
          break;
        case 'bottomLeft':
          this.x = this.startXPos + dx;
          this.width = this.startWidth - dx;
          this.height = this.startHeight + dy;
          break;
        case 'bottomRight':
          this.width = this.startWidth + dx;
          this.height = this.startHeight + dy;
          break;
        case 'top':
          this.y = this.startYPos + dy;
          this.height = this.startHeight - dy;
          break;
        case 'bottom':
          this.height = this.startHeight + dy;
          break;
        case 'left':
          this.x = this.startXPos + dx;
          this.width = this.startWidth - dx;
          break;
        case 'right':
          this.width = this.startWidth + dx;
          break;
      }

      // 确保最小宽度和高度
      this.width = Math.max(this.width, 100);
      this.height = Math.max(this.height, 50);
    },
    stopDragOrResize() {
      this.isDragging = false;
      this.isResizing = false;
      this.resizeHandle = '';
    },
    minimizeWindow() {
      // Implement minimize logic (e.g., hide window, add to taskbar)
      console.log('Minimize window');
      this.$emit('minimize', this.windowId);
    },
    toggleMaximize() {
      this.isMaximized = !this.isMaximized;
      if (this.isMaximized) {
        // Save original position and size
        this.originalX = this.x;
        this.originalY = this.y;
        this.originalWidth = this.width;
        this.originalHeight = this.height;

        // Maximize to full screen (or parent container)
        // 使用 document.documentElement.clientWidth/Height 更准确地获取视口尺寸
        this.x = 0;
        this.y = 0;
        this.width = document.documentElement.clientWidth;
        this.height = document.documentElement.clientHeight;
        document.body.style.overflow = 'hidden'; // 防止最大化时出现滚动条
      } else {
        // Restore original position and size
        this.x = this.originalX;
        this.y = this.originalY;
        this.width = this.originalWidth;
        this.height = this.originalHeight;
        document.body.style.overflow = ''; // 恢复 body 的 overflow 属性
      }
    },
    closeWindow() {
      // Emit an event to the parent to close this window
      this.$emit('close', this.windowId);
    }
  }
};
</script>

<style scoped>
.window {
  position: absolute;
  border: 1px solid #ccc;
  box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.2);
  background-color: white;
  display: flex;
  flex-direction: column;
  min-width: 100px;
  min-height: 50px;
  z-index: 1000; /* Default z-index */
}

.window-header {
  background-color: #f0f0f0;
  padding: 5px 10px;
  cursor: grab;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #eee;
}

.window-title {
  font-weight: bold;
}

.window-controls button {
  margin-left: 5px;
  padding: 2px 5px;
  border: 1px solid #ccc;
  background-color: #fff;
  cursor: pointer;
}

.window-content {
  flex-grow: 1;
  padding: 10px;
  overflow: auto;
}

.window-resizer {
  position: absolute;
  width: 8px;
  height: 8px;
  background-color: transparent;
  z-index: 1;
}

/* Corner Resizers */
.top-left {
  top: -4px;
  left: -4px;
  cursor: nwse-resize;
}
.top-right {
  top: -4px;
  right: -4px;
  cursor: nesw-resize;
}
.bottom-left {
  bottom: -4px;
  left: -4px;
  cursor: nesw-resize;
}
.bottom-right {
  bottom: -4px;
  right: -4px;
  cursor: nwse-resize;
}

/* Edge Resizers */
.top {
  top: -4px;
  left: 4px;
  right: 4px;
  height: 8px;
  cursor: ns-resize;
}
.bottom {
  bottom: -4px;
  left: 4px;
  right: 4px;
  height: 8px;
  cursor: ns-resize;
}
.left {
  left: -4px;
  top: 4px;
  bottom: 4px;
  width: 8px;
  cursor: ew-resize;
}
.right {
  right: -4px;
  top: 4px;
  bottom: 4px;
  width: 8px;
  cursor: ew-resize;
}
</style>
