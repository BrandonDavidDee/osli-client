<template>
  <div>
    {{ data }}
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from 'vue';
import { galleryLinkDetail } from 'src/api/gallery-links';
import { Gallery } from 'src/models/gallery';

export default defineComponent({
  props: {
    link: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const data = ref<Gallery>();

    async function fetchData() {
      const res = await galleryLinkDetail(props.link);
      if (res && res.data) {
        data.value = res.data;
      }
    }

    watch(
      () => props.link,
      () => fetchData(),
      { immediate: true },
    );

    return {
      data,
    };
  },
});
</script>
