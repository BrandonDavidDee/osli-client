<template>
  <q-card
    square
    flat
    bordered
    class="q-ma-xs"
  >
    <q-card-section :class="item.title ? 'bg-grey-3 q-pb-xs q-pt-xs' : 'bg-grey-3'">
      <div v-if="useRouter">
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
      </div>
      <div
        v-else
        class="cursor-pointer"
        @click="itemSelect(item.id)"
      >
        <div
          v-if="item.title"
          class="text-overline"
        >
          {{ item.title }}
        </div>
        <div class="text-caption">
          {{ item.video_id }}
        </div>
      </div>
    </q-card-section>
    <div v-if="item.thumbnail">
      <q-card-section
        class="text-center cursor-pointer"
        @click="itemSelect(item.id)"
      >
        <ImageDetail
          :src-url="item.thumbnail"
          :ratio="item.width/item.height"
        />
      </q-card-section>
    </div>
  </q-card>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { ItemVimeo } from 'src/models/item-vimeo';
import { useRouter } from 'vue-router';
import ImageDetail from 'src/components/ImageDetail.vue';

export default defineComponent({
  components: { ImageDetail },
  props: {
    item: {
      type: Object as PropType<ItemVimeo>,
      required: true,
    },
    useRouter: {
      type: Boolean,
      required: true,
    },
  },
  emits: ['selected'],
  setup(props, { emit }) {
    const router = useRouter();
    function itemSelect(itemId: number) {
      if (props.useRouter) {
        router.push({ name: 'item-detail-vimeo', params: { itemId } });
      } else {
        emit('selected', itemId);
      }
    }
    return {
      itemSelect,
    };
  },
});
</script>
