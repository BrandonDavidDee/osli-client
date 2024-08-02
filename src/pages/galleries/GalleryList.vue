<template>
  <pre>{{ data }}</pre>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import { Gallery } from 'src/models/gallery';
import { galleryList } from 'src/api/galleries';

export default defineComponent({
  setup() {
    const data = ref<Gallery[]>();

    async function fetchData() {
      const res = await galleryList();
      if (res && res.data) {
        data.value = res.data;
      }
    }

    onMounted(() => fetchData());

    return {
      data,
    };
  },
});
</script>
