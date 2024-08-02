<template>
  <pre>{{ data }}</pre>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from 'vue';
import { Gallery } from 'src/models/gallery';
import { galleryDetail } from 'src/api/galleries';

export default defineComponent({
  props: {
    galleryId: {
      type: [Number, String],
      required: true,
    },
  },
  setup(props) {
    const data = ref<Gallery>();

    async function fetchData() {
      const res = await galleryDetail(props.galleryId);
      if (res && res.data) {
        data.value = res.data;
      }
    }

    watch(
      () => props.galleryId,
      () => {
        fetchData();
      },
      { immediate: true },
    );

    return {
      data,
    };
  },
});
</script>
