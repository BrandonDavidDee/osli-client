<template>
  <q-bar>
    {{ barTitle }}
    <q-space />
    <q-btn
      flat
      size="sm"
      icon="add"
    />
  </q-bar>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';

export default defineComponent({
  props: {
    itemCount: {
      type: Number,
      required: true,
    },
  },
  setup(props) {
    const barTitle = computed(() => `${props.itemCount} ${props.itemCount === 1 ? 'Item' : 'Items'}`);

    return {
      barTitle,
    };
  },
});
</script>
