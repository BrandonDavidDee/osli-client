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
        :to="{name: 'item-list-bucket', params: { sourceId: data.source.id}}"
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
      <ItemDetailPreview :item="data" />
    </div>
    <div class="col q-pa-md">
      <div class="text-right">
        <q-btn-group>
          <q-btn
            label="Links"
            :to="{ name: 'item-links-bucket', params: { sourceId, itemId}}"
          />
          <ItemSave
            :item-id="itemId"
            :saved="data.saved"
            @update="onSaveUpdate"
          />
        </q-btn-group>
      </div>
      <LineItem
        label="File Path"
        :text="data.file_path"
      />
      <LineItem
        label="Mime Type"
        :text="data.mime_type"
      />
      <LineItem
        label="File Size"
        :text="calculateSize(data.file_size)"
        :separator="false"
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
        source-type="bucket"
        class="q-mt-md"
        @new="onNewTag"
        @deleted="onDeletedTagItem"
      />
      <ItemDelete
        class="q-mt-md"
        :source-id="sourceId"
        :item="data"
      />
    </div>
  </div>
</template>

<script lang="ts">
import {
  defineComponent, ref, watch,
} from 'vue';
import { itemDetail, itemUpdate } from 'src/api/item-bucket';
import { debounce } from 'quasar';
import { ItemTag } from 'src/models/item';
import { ItemBucket } from 'src/models/item-bucket';
import { calculateSize } from 'src/services/utils';
import LineItem from 'src/components/LineItem.vue';
import ItemTags from 'src/pages/items/common/ItemTags.vue';
import ItemDetailPreview from './ItemDetailPreview.vue';
import ItemSave from './ItemSave.vue';
import ItemDelete from './ItemDelete.vue';

export default defineComponent({
  components: {
    ItemDetailPreview, LineItem, ItemTags, ItemSave, ItemDelete,
  },
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
    const data = ref<ItemBucket>();
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

    function onNewTag(v: ItemTag) {
      data.value?.tags.push(v);
    }

    function onDeletedTagItem(v: number) {
      const index = data.value?.tags.findIndex((i: ItemTag) => i.id === v);
      if (index !== undefined && index !== -1) {
        data.value?.tags.splice(index, 1);
      }
    }

    function onSaveUpdate(v: boolean) {
      if (data.value) {
        data.value.saved = v;
      }
    }

    watch(() => props.itemId, () => {
      fetchData();
    }, { immediate: true });

    return {
      data,
      loading,
      calculateSize,
      debouncedItemUpdate,
      onNewTag,
      onDeletedTagItem,
      onSaveUpdate,
    };
  },
});
</script>
