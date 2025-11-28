<template>
  <div class="desktop">
   <div class="container">
        <slot></slot>
   </div>
  </div>
</template>

<script setup>
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