<template>
  <q-card
    square
    flat
    bordered
    class="q-ma-xs"
  >
    <q-card-section class="bg-grey-3 text-caption">
      <router-link :to="{ name: 'item-detail-vimeo', params: { itemId: item.id }}">
        {{ item.video_id }}
      </router-link>
    </q-card-section>
    <div v-if="item.thumbnail">
      <q-card-section
        class="text-center"
      >
        <q-img
          :src="item.thumbnail"
          loading="lazy"
        >
          <template #error>
            <div class="absolute-full flex flex-center bg-grey-8 text-white">
              Error
            </div>
          </template>
        </q-img>
      </q-card-section>
    </div>
  </q-card>
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
