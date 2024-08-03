<template>
  <div>
    <q-img
      :src="source"
      :ratio="1"
    >
      <div class="absolute-bottom-right text-subtitle2">
        <q-icon
          name="play_circle"
          size="2rem"
        />
      </div>
      <template #error>
        <div class="absolute-full flex flex-center bg-negative text-white">
          Cannot load image
        </div>
      </template>
    </q-img>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, computed } from 'vue';
import { ItemVimeo } from 'src/models/item-vimeo';

export default defineComponent({
  props: {
    item: {
      type: Object as PropType<ItemVimeo>,
      required: true,
    },
  },
  setup(props) {
    const source = computed(() => props.item.thumbnail || 'https://dummyimage.com/400x224/ffffff/000000&text=404');
    return {
      source,
    };
  },
});
</script>
