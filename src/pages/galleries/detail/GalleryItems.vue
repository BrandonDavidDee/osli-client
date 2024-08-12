<template>
  <div>
    <q-list bordered>
      <q-item
        v-for="item in itemsSorted"
        :key="item.id"
        draggable="true"
      >
        <q-item-section avatar>
          <q-avatar rounded>
            <img :src="getThumbnail(item)">
          </q-avatar>
        </q-item-section>
        <q-item-section>{{ item.item_order }} | {{ getTitle(item) }}</q-item-section>
        <q-item-section side>
          <q-btn
            size="sm"
            flat
            icon="drag_handle"
          />
        </q-item-section>
      </q-item>
    </q-list>
  </div>
</template>

<script lang="ts">
import {
  defineComponent, PropType, computed,
} from 'vue';
import { Gallery, GalleryItem } from 'src/models/gallery';
import { ItemBucket } from 'src/models/item-bucket';
import { ItemVimeo } from 'src/models/item-vimeo';

export default defineComponent({
  props: {
    gallery: {
      type: Object as PropType<Gallery>,
      required: true,
    },
  },
  setup(props) {
    const itemsSorted = computed(() => props.gallery.items.slice().sort((a, b) => a.item_order - b.item_order));

    function getBucketThumb(v: ItemBucket) {
      return v.file_path || '';
    }

    function getVimeoThumb(v: ItemVimeo) {
      return v.thumbnail || '';
    }

    function getThumbnail(v: GalleryItem) {
      if (v.source_type === 'bucket' && v.item_bucket) {
        return getBucketThumb(v.item_bucket);
      }
      if (v.source_type === 'vimeo' && v.item_vimeo) {
        return getVimeoThumb(v.item_vimeo);
      }
      return 'https://cdn.quasar.dev/img/mountains.jpg';
    }

    function getTitle(v: GalleryItem) {
      if (v.source_type === 'bucket' && v.item_bucket) {
        return v.item_bucket.title || 'No Title';
      }
      if (v.source_type === 'vimeo' && v.item_vimeo) {
        return v.item_vimeo.title || 'NO Title';
      }
      return 'https://cdn.quasar.dev/img/mountains.jpg';
    }
    return {
      itemsSorted,
      getThumbnail,
      getTitle,
    };
  },
});
</script>
