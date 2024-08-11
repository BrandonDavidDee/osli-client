<template>
  <div>
    <ImageDetail
      :src-url="source"
      :ratio="1"
      class="cursor-pointer"
      @click="dialog = true"
    >
      <template #caption>
        <div class="absolute-full text-subtitle2 flex flex-center">
          <q-icon
            name="play_circle"
            :size="playIconSize"
          />
        </div>
      </template>
    </ImageDetail>
    <DialogMaster v-model="dialog">
      <template #content="{ closeDialog }">
        <q-card-section
          v-if="item.title"
          class="text-subtitle2"
        >
          {{ item.title }}
        </q-card-section>
        <q-card-section>
          <VimeoPlayer :video-id="item.video_id" />
        </q-card-section>
        <q-card-actions align="right">
          <q-btn
            label="Close"
            flat
            @click="closeDialog"
          />
        </q-card-actions>
      </template>
    </DialogMaster>
  </div>
</template>

<script lang="ts">
import {
  defineComponent, PropType, computed, ref,
} from 'vue';
import { ItemVimeo } from 'src/models/item-vimeo';
import VimeoPlayer from 'src/components/VimeoPlayer.vue';
import DialogMaster from 'src/components/DialogMaster.vue';
import ImageDetail from 'src/components/ImageDetail.vue';

export default defineComponent({
  components: { DialogMaster, VimeoPlayer, ImageDetail },
  props: {
    item: {
      type: Object as PropType<ItemVimeo>,
      required: true,
    },
    playIconSize: {
      type: String,
      default: '2rem',
    },
  },
  setup(props) {
    const dialog = ref(false);
    const source = computed(() => props.item.thumbnail || 'https://dummyimage.com/400x224/ffffff/000000&text=404');
    return {
      dialog,
      source,
    };
  },
});
</script>
