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
import { ItemVimeo } from 'src/models/item-vimeo';

export default defineComponent({
  props: {
    item: {
      type: Object as PropType<ItemVimeo>,
      required: true,
    },
  },
});
</script>
