<template>
  <ItemList
    :source-id="sourceId"
    :page="page"
    is-route
  />
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import ItemList from './ItemList.vue';

export default defineComponent({
  components: { ItemList },
  props: {
    sourceId: {
      type: [Number, String],
      required: true,
    },
    page: {
      type: [Number, String],
      required: true,
    },
  },
});
</script>
