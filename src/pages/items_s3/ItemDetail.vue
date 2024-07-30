<template>
  <div
    v-if="data"
    class="row"
  >
    <div class="col q-pa-md">
      <ItemPreview :item="data" />
    </div>
    <div class="col q-pa-md">
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
import { itemS3Detail, itemS3Update } from 'src/api/items';
import { debounce } from 'quasar';
import { Item } from 'src/models/item';
import LineItem from 'src/components/LineItem.vue';
import ItemPreview from './ItemPreview.vue';
import ItemTags from './ItemTags.vue';

export default defineComponent({
  components: { ItemPreview, LineItem, ItemTags },
  props: {
    itemId: {
      type: [Number, String],
      required: true,
    },
  },
  setup(props) {
    const data = ref<Item>();

    async function fetchData() {
      const res = await itemS3Detail(props.itemId);
      if (res && res.data) {
        data.value = res.data;
      }
    }

    const debouncedItemUpdate = debounce(async () => {
      if (data.value) {
        const res = await itemS3Update(props.itemId, data.value);
        if (res) {
          // console.log(res.status);
        }
      }
    }, 500);

    function calculateSize(fileSize: number | undefined) {
      // move to a reusable function
      if (!fileSize) { return 'No File Size'; }
      const kilobytes = 1024;
      const megabytes = kilobytes * 1024;
      const gigabytes = megabytes * 1024;
      if (fileSize >= gigabytes) {
        return `${(fileSize / gigabytes).toFixed(2)} GB`;
      } if (fileSize >= megabytes) {
        return `${(fileSize / megabytes).toFixed(2)} MB`;
      } if (fileSize >= kilobytes) {
        return `${(fileSize / kilobytes).toFixed(2)} KB`;
      }
      return `${fileSize} bytes`;
    }

    watch(() => props.itemId, () => {
      fetchData();
    }, { immediate: true });

    return {
      data,
      calculateSize,
      debouncedItemUpdate,
    };
  },
});
</script>
