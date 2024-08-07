<template>
  <div
    v-if="data"
    class="row"
  >
    <q-toolbar class="bg-grey-9 text-white">
      <q-btn
        dense
        icon="arrow_back"
        color="white"
        text-color="black"
        size="sm"
        :to="{name: 'item-list-vimeo', params: { sourceId: data.source.id}}"
      />
      <q-toolbar-title>
        {{ data.source.title }}
      </q-toolbar-title>
      <q-spinner
        v-show="loading"
        color="teal"
        size="2em"
      />
    </q-toolbar>
    <div class="col q-pa-md">
      <VimeoPlayer :video-id="data.video_id" />
    </div>
    <div class="col q-pa-md">
      <q-btn
        label="Links"
        :to="{ name: 'item-links-vimeo', params: { sourceId, itemId}}"
      />
      <LineItem
        label="Thumbnail"
        :text="data.thumbnail"
      />
      <q-input
        v-model="data.title"
        filled
        square
        label="Title"
        color="black"
        class="q-mt-md"
        hint="Optional"
        @update:model-value="debouncedItemUpdate"
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
        @new="onNewTag"
        @deleted="onDeletedTagItem"
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
import { ItemTag } from 'src/models/item';
import { ItemVimeo } from 'src/models/item-vimeo';
import LineItem from 'src/components/LineItem.vue';
import VimeoPlayer from 'src/public-thumbs/VimeoPlayer.vue';
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
    const loading = ref(false);

    async function fetchData() {
      const res = await itemDetail(props.itemId);
      if (res && res.data) {
        data.value = res.data;
      }
    }

    const debouncedItemUpdate = debounce(async () => {
      if (data.value) {
        loading.value = true;
        await itemUpdate(props.itemId, data.value);
        loading.value = false;
      }
    }, 500);

    watch(() => props.itemId, () => {
      fetchData();
    }, { immediate: true });

    function onNewTag(v: ItemTag) {
      data.value?.tags.push(v);
    }

    function onDeletedTagItem(v: number) {
      const index = data.value?.tags.findIndex((i: ItemTag) => i.id === v);
      if (index !== undefined && index !== -1) {
        data.value?.tags.splice(index, 1);
      }
    }

    return {
      data,
      loading,
      debouncedItemUpdate,
      onNewTag,
      onDeletedTagItem,
    };
  },
});
</script>
