<template>
  <div>
    <AddItemMenu
      :gallery-id="galleryId"
      :item-count="gallery.items.length"
      :last-order-value="lastOrderValue"
      @refresh="$emit('refresh')"
    />
    <q-card
      v-if="!gallery.items.length"
      flat
      bordered
      square
    >
      <q-card-section>
        No Items
      </q-card-section>
    </q-card>
    <q-list
      v-if="gallery.items.length"
      bordered
    >
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
        <q-item-section>
          {{ getTitle(item) }}
        </q-item-section>
        <q-item-section side>
          <q-btn-group flat>
            <q-btn
              size="sm"
              flat
              icon="drag_handle"
              draggable="true"
            />
            <q-btn
              size="sm"
              flat
              icon="delete"
              @click="deleteWarn(item)"
            />
          </q-btn-group>
        </q-item-section>
      </q-item>
    </q-list>
    <q-dialog v-model="dialog">
      <q-card>
        <q-card-section>This will only remove this item from this gallery. It is permanent.</q-card-section>
        <q-card-actions align="right">
          <q-btn
            v-close-popup
            label="Cancel"
            flat
            :disable="loading"
          />
          <q-btn
            label="Delete"
            color="red"
            :loading="loading"
            @click="doItemDelete"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script lang="ts">
import {
  defineComponent, PropType, ref, computed,
} from 'vue';
import { galleryItemDelete } from 'src/api/galleries';
import { Gallery, GalleryItem } from 'src/models/gallery';
import { positiveNotification } from 'src/services/notify';
import { ItemBucket } from 'src/models/item-bucket';
import { ItemVimeo } from 'src/models/item-vimeo';
import AddItemMenu from './AddItemMenu.vue';

export default defineComponent({
  components: { AddItemMenu },
  props: {
    galleryId: {
      type: [Number, String],
      required: true,
    },
    gallery: {
      type: Object as PropType<Gallery>,
      required: true,
    },
  },
  emits: ['update', 'refresh'],
  setup(props, { emit }) {
    const dialog = ref(false);
    const draggedIndex = ref<number | null>(null);
    const loading = ref(false);
    const selectedItemId = ref<number | null>(null);

    const lastOrderValue = computed(() => {
      if (!props.gallery.items.length) { return 0; }
      return props.gallery.items.reduce((max, item) => (item.item_order > max ? item.item_order : max), props.gallery.items[0].item_order);
    });

    function getBucketThumb(v: ItemBucket) {
      // TODO: handle bucket sources with no media prefix
      if (!v.source.media_prefix) { return ''; }
      return `${v.source.media_prefix}/${v.file_path}`;
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

    async function doItemDelete() {
      // TODO: remove this value from the array instead of refreshing
      if (selectedItemId.value) {
        const res = await galleryItemDelete(props.galleryId, selectedItemId.value);
        if (res && res.status === 200) {
          positiveNotification('Deleted');
          dialog.value = false;
          selectedItemId.value = null;
          emit('refresh');
        }
      }
    }

    function deleteWarn(item: GalleryItem) {
      selectedItemId.value = item.id;
      dialog.value = true;
    }

    return {
      dialog,
      doItemDelete,
      draggedIndex,
      getThumbnail,
      getTitle,
      onDragStart,
      onDrop,
      selectedItemId,
      deleteWarn,
      loading,
      lastOrderValue,
    };
  },
});
</script>
