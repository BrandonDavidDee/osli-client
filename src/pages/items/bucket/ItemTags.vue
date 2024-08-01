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
import { ItemBucket } from 'src/models/item-bucket';

export default defineComponent({
  props: {
    item: {
      type: Object as PropType<ItemBucket>,
      required: true,
    },
  },
});
</script>
