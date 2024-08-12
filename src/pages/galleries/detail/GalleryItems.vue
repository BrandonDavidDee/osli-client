<template>
  <div>
    <q-list bordered>
      <q-item
        v-for="(item, index) in gallery.items"
        :key="`${index}_${item.id}`"
        @dragover.prevent
        @dragenter.prevent
        @dragstart="onDragStart(index)"
        @drop="onDrop(index)"
      >
        <q-item-section avatar>
          <q-avatar rounded>
            <img :src="getThumbnail(item)">
          </q-avatar>
        </q-item-section>
        <q-item-section>{{ getTitle(item) }}</q-item-section>
        <q-item-section side>
          <q-btn
            size="sm"
            flat
            icon="drag_handle"
            draggable="true"
          />
        </q-item-section>
      </q-item>
    </q-list>
  </div>
</template>

<script lang="ts">
import {
  defineComponent, PropType, ref,
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
  emits: ['update'],
  setup(props, { emit }) {
    const draggedIndex = ref<number | null>(null);

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
      return 'https://dummyimage.com/80x80/262626/fff&text=NULL';
    }

    function getTitle(v: GalleryItem) {
      if (v.source_type === 'bucket' && v.item_bucket) {
        return v.item_bucket.title || 'No Title';
      }
      if (v.source_type === 'vimeo' && v.item_vimeo) {
        return v.item_vimeo.title || 'NO Title';
      }
      return 'https://dummyimage.com/80x80/262626/fff&text=NULL';
    }

    function moveItem(fromIndex: number, toIndex: number): void {
      const { items } = props.gallery;
      if (fromIndex < 0 || fromIndex >= items.length || toIndex < 0 || toIndex >= items.length) {
        return;
      }
      const [movedItem] = items.splice(fromIndex, 1);
      items.splice(toIndex, 0, movedItem);

      items.forEach((item, index) => {
        item.item_order = index;
      });
      emit('update');
    }

    function onDragStart(index: number): void {
      draggedIndex.value = index;
    }

    function onDrop(toIndex: number): void {
      if (draggedIndex.value !== null) {
        moveItem(draggedIndex.value, toIndex);
        draggedIndex.value = null; // Reset after the drop
      }
    }
    return {
      draggedIndex,
      getThumbnail,
      getTitle,
      onDragStart,
      onDrop,
    };
  },
});
</script>
