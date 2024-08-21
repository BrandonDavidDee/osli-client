<template>
  <q-btn
    icon="bookmark"
    :text-color="saved ? 'amber' : 'grey'"
    @click="saved ? remove() : add()"
  />
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { saveItem, deleteSavedItem } from 'src/api/item-vimeo';

export default defineComponent({
  props: {
    itemId: {
      type: Number,
      required: true,
    },
    saved: {
      type: Boolean,
      required: true,
    },
  },
  emits: ['update'],
  setup(props, { emit }) {
    async function add() {
      const res = await saveItem(props.itemId);
      if (res && res.status === 200) {
        emit('update', true);
      }
    }
    async function remove() {
      const res = await deleteSavedItem(props.itemId);
      if (res && res.status === 200) {
        emit('update', false);
      }
    }
    return {
      add,
      remove,
    };
  },
});
</script>
