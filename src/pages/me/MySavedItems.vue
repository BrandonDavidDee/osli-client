<template>
  <div class="q-pa-md">
    <q-markup-table
      flat
      bordered
      square
    >
      <thead>
        <tr>
          <th class="text-left" />
          <th class="text-left">
            Item Title
          </th>
          <th class="text-left">
            Source
          </th>
          <th class="text-left">
            Date Saved
          </th>
          <th class="text-left" />
        </tr>
      </thead>
      <tbody>
        <tr v-if="!data.length">
          <td
            class="text-caption text-grey-8"
            colspan="5"
          >
            No Items
          </td>
        </tr>
        <tr
          v-for="(item, index) in data"
          :key="index"
        >
          <td>
            <ItemBucketThumb
              v-if="item.item_bucket"
              :item="item.item_bucket"
            />
            <ItemVimeoThumb
              v-if="item.item_vimeo"
              :item="item.item_vimeo"
            />
          </td>
          <td>
            {{ parseTitle(item) }}
          </td>
          <td>
            {{ parseSourceTitle(item) }}
          </td>
          <td>{{ getDateTimeDisplay(item.date_saved) }}</td>
          <td>
            <q-btn
              size="sm"
              flat
              icon="visibility"
              :to="getDetailRoute(item)"
            />
          </td>
        </tr>
      </tbody>
    </q-markup-table>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import { ItemBucket } from 'src/models/item-bucket';
import { ItemVimeo } from 'src/models/item-vimeo';
import { savedItems } from 'src/api/me';
import ItemBucketThumb from 'src/pages/galleries/ItemBucketThumb.vue';
import ItemVimeoThumb from 'src/pages/galleries/ItemVimeoThumb.vue';
import { getDateTimeDisplay } from 'src/services/date-master';

interface SavedItem {
  source_type: string;
  item_bucket: ItemBucket | null;
  item_vimeo: ItemVimeo | null;
  date_saved: string;
}

export default defineComponent({
  components: { ItemBucketThumb, ItemVimeoThumb },
  setup() {
    const data = ref<SavedItem[]>([]);

    async function fetchData() {
      const res = await savedItems();
      if (res && res.data) {
        data.value = res.data;
      }
    }

    function parseTitle(v: SavedItem) {
      const title = v.item_bucket ? v.item_bucket.title : v.item_vimeo?.title;
      return title || 'No Title';
    }

    function parseSourceTitle(v: SavedItem) {
      const bucketTitle = v.item_bucket?.source?.title;
      const vimeoTitle = v.item_vimeo?.source?.title;
      const title = v.source_type === 'bucket' ? bucketTitle : vimeoTitle;
      return (title) || 'No Title';
    }

    function getDetailRoute(v: SavedItem) {
      const name = v.source_type === 'bucket' ? 'item-detail-bucket' : 'item-detail-vimeo';
      const itemId = v.source_type === 'bucket' ? v.item_bucket?.id : v.item_vimeo?.id;
      const sourceId = v.source_type === 'bucket' ? v.item_bucket?.source.id : v.item_vimeo?.source.id;
      return {
        name,
        params: { sourceId, itemId },
      };
    }

    onMounted(() => fetchData());
    return {
      data,
      parseTitle,
      parseSourceTitle,
      getDateTimeDisplay,
      getDetailRoute,
    };
  },
});
</script>
