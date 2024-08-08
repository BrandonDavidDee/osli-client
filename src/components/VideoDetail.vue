<template>
  <video
    height="100%"
    width="100%"
    controls
  >
    <source
      :src="srcUrl"
      type="video/mp4"
    >
    Your browser does not support the video tag.
  </video>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  props: {
    srcUrl: {
      type: String,
      required: true,
    },
  },
});

</script>
