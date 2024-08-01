<template>
  <div>
    <div
      class="embed-container"
    >
      <iframe
        :src="`https://player.vimeo.com/video/${videoId}`"
        frameborder="0"
        webkitAllowFullScreen
        mozallowfullscreen
        allowFullScreen
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  props: {
    videoId: {
      type: String,
      required: true,
    },
  },
});
</script>

<style scoped>
.embed-container {
  position: relative;
  padding-bottom: 56.25%;
  height: 0;
  overflow: hidden;
  max-width: 100%;
  }
.embed-container iframe, .embed-container object, .embed-container embed {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  }
</style>
