<template>
  <div>
    <div
      :class="['embed-container', { vertical }]"
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
import { defineComponent, computed } from 'vue';

export default defineComponent({
  props: {
    videoId: {
      type: String,
      required: true,
    },
    width: {
      type: Number,
      default: 0,
    },
    height: {
      type: Number,
      default: 0,
    },
  },
  setup(props) {
    const vertical = computed(() => {
      if (props.width === props.height) { return false; }
      return props.height > props.width;
    });
    return {
      vertical,
    };
  },
});
</script>

<style scoped>
.embed-container {
  position: relative;
  padding-bottom: 56.25%; /* 16:9 aspect ratio for horizontal videos */
  height: 0;
  overflow: hidden;
  max-width: 100%;
}
.embed-container.vertical {
  padding-bottom: 177.81%; /* Adjusted for 9:16 aspect ratio for vertical videos */
}
.embed-container iframe, .embed-container object, .embed-container embed {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
</style>
