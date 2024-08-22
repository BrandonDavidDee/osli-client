<template>
  <div>
    <q-btn
      label="Delete"
      size="sm"
      color="grey-9"
      disable
    />
  </div>
</template>

<script lang="ts">
import {
  defineComponent, PropType,
} from 'vue';
import { ItemVimeo } from 'src/models/item-vimeo';

export default defineComponent({
  props: {
    loading: {
      type: Boolean,
      required: true,
    },
    sourceId: {
      type: Number,
      required: true,
    },
    item: {
      type: Object as PropType<ItemVimeo>,
      required: true,
    },
  },
});
</script>
