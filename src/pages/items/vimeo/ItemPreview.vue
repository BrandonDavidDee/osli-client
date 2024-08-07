<template>
  <q-card
    square
    flat
    bordered
    class="q-ma-xs"
  >
    <q-card-section :class="item.title ? 'bg-grey-3 q-pb-xs q-pt-xs' : 'bg-grey-3'">
      <router-link :to="{ name: 'item-detail-vimeo', params: { itemId: item.id }}">
        <div
          v-if="item.title"
          class="text-overline"
        >
          {{ item.title }}
        </div>
        <div class="text-caption">
          {{ item.video_id }}
        </div>
      </router-link>
    </q-card-section>
    <div v-if="item.thumbnail">
      <q-card-section
        class="text-center cursor-pointer"
        @click="routeChange(item.id)"
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
import { useRouter } from 'vue-router';

export default defineComponent({
  props: {
    item: {
      type: Object as PropType<ItemVimeo>,
      required: true,
    },
  },
  setup() {
    const router = useRouter();
    function routeChange(itemId: number) {
      router.push({ name: 'item-detail-vimeo', params: { itemId } });
    }
    return {
      routeChange,
    };
  },
});
</script>
