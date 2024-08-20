<template>
  <div>
    <AddItemMenu
      :gallery-id="galleryId"
      :item-count="gallery.items.length"
      :last-order-value="lastOrderValue"
      @new="onNewGalleryItem"
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
          <q-item-label caption>
            {{ getDateTimeDisplay(item.date_created) }}
          </q-item-label>
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
              icon="visibility"
              :to="makeRouteObject(item)"
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
    <DialogMaster
      v-model="dialog"
      close-header
      size="small"
    >
      <template #content="{ closeDialog }">
        <q-card-section>This will only remove this item from this gallery. It is permanent.</q-card-section>
        <q-separator />
        <q-card-actions align="right">
          <q-btn
            label="Cancel"
            flat
            :disable="loading"
            @click="closeDialog"
          />
          <q-btn
            label="Delete"
            color="red"
            :loading="loading"
            @click="doItemDelete(closeDialog)"
          />
        </q-card-actions>
      </template>
    </DialogMaster>
  </div>
</template>

<script lang="ts">
import {
  defineComponent, PropType, ref, computed,
} from 'vue';
import { galleryItemDelete } from 'src/api/galleries';
import { Gallery, GalleryItem } from 'src/models/gallery';
import { positiveNotification } from 'src/services/notify';
import { getDateTimeDisplay } from 'src/services/date-master';
import { ItemBucket } from 'src/models/item-bucket';
import { ItemVimeo } from 'src/models/item-vimeo';
import DialogMaster from 'src/components/DialogMaster.vue';
import AddItemMenu from './AddItemMenu.vue';

export default defineComponent({
  components: { AddItemMenu, DialogMaster },
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
  emits: ['update', 'new', 'refresh'],
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

    async function doItemDelete(closeDialog: () => void) {
      // TODO: remove this value from the array instead of refreshing
      if (selectedItemId.value) {
        const res = await galleryItemDelete(props.galleryId, selectedItemId.value);
        if (res && res.status === 200) {
          positiveNotification('Deleted');
          selectedItemId.value = null;
          emit('refresh');
        }
        closeDialog();
      }
    }

    function deleteWarn(item: GalleryItem) {
      selectedItemId.value = item.id;
      dialog.value = true;
    }

    function makeRouteObject(item: GalleryItem) {
      let routeName;
      let itemId: number | null = null;
      if (item.item_bucket) {
        routeName = 'item-detail-bucket';
        itemId = item.item_bucket.id;
      } else if (item.item_vimeo) {
        routeName = 'item-detail-vimeo';
        itemId = item.item_vimeo.id;
      }
      const sourceId = item.source_id;
      return { name: routeName, params: { sourceId, itemId } };
    }

    function onNewGalleryItem(v: GalleryItem) {
      emit('new', v);
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
      getDateTimeDisplay,
      makeRouteObject,
      onNewGalleryItem,
    };
  },
});
</script>
