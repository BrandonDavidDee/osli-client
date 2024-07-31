<template>
  <div>
    <q-chip
      v-for="itemTag in item.tags"
      :key="itemTag.id"
      color="teal"
      text-color="white"
      removable
    >
      {{ itemTag.tag.title }}
    </q-chip>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { Item } from 'src/models/item';

export default defineComponent({
  props: {
    item: {
      type: Object as PropType<Item>,
      required: true,
    },
  },
});
</script>
