<template>
  <router-view />
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';
import { useMeta } from 'quasar';

export default defineComponent({
  setup() {
    const websiteTitle = computed(() => {
      const siteTitle = process.env.APP_TITLE;
      return (typeof siteTitle === 'string' && siteTitle) || null;
    });
    useMeta(() => ({
      title: websiteTitle.value || 'OSLI',
    }));
  },
});
</script>

<style>
a {
  color: rgb(48, 48, 48);
  text-decoration: none;
}
a:hover {
  color: rgb(94, 94, 94);
}
</style>
