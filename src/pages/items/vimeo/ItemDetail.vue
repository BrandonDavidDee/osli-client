<template>
  <div
    v-if="data"
    class="row"
  >
    <div class="col q-pa-md">
      <VimeoPlayer :video-id="data.video_id" />
    </div>
    <div class="col q-pa-md">
      <LineItem
        label="Title"
        :text="data.title"
      />
      <LineItem
        label="Thumbnail"
        :text="data.thumbnail"
      />
      <q-input
        v-model="data.notes"
        filled
        square
        type="textarea"
        label="Notes"
        color="black"
        class="q-mt-md"
        @update:model-value="debouncedItemUpdate"
      />
      <ItemTags
        :item="data"
        class="q-mt-md"
      />
    </div>
  </div>
</template>

<script lang="ts">
import {
  defineComponent, ref, watch,
} from 'vue';
import { itemDetail, itemUpdate } from 'src/api/item-vimeo';
import { debounce } from 'quasar';
import { ItemVimeo } from 'src/models/item-vimeo';
import LineItem from 'src/components/LineItem.vue';
import VimeoPlayer from './VimeoPlayer.vue';
import ItemTags from './ItemTags.vue';

export default defineComponent({
  components: { LineItem, ItemTags, VimeoPlayer },
  props: {
    sourceId: {
      type: [Number, String],
      required: true,
    },
    itemId: {
      type: [Number, String],
      required: true,
    },
  },
  setup(props) {
    const data = ref<ItemVimeo>();

    async function fetchData() {
      const res = await itemDetail(props.itemId);
      if (res && res.data) {
        data.value = res.data;
      }
    }

    const debouncedItemUpdate = debounce(async () => {
      if (data.value) {
        const res = await itemUpdate(props.itemId, data.value);
        if (res) {
          // console.log(res.status);
        }
      }
    }, 500);

    watch(() => props.itemId, () => {
      fetchData();
    }, { immediate: true });

    return {
      data,
      debouncedItemUpdate,
    };
  },
});
</script>
