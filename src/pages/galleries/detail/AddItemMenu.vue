<template>
  <q-bar>
    {{ barTitle }}
    <q-space />
    <q-btn-dropdown
      ref="dropDown"
      flat
      size="sm"
      icon="add"
      :disable="noSources"
    >
      <q-list>
        <q-item
          v-for="source in dataBuckets"
          :key="source.id"
          clickable
          @click="onSelectBucket(source.id)"
        >
          <q-item-section>
            <q-item-label>{{ source.title }}</q-item-label>
          </q-item-section>
        </q-item>
        <q-item
          v-for="source in dataVimeo"
          :key="source.id"
          clickable
          @click="onSelectVimeo(source.id)"
        >
          <q-item-section>
            <q-item-label>{{ source.title }}</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-btn-dropdown>
    <DialogMaster
      v-model="dialogBucketSource"
      size="full"
      close-header
      close-footer
    >
      <template
        v-if="selectedBucketSourceId"
        #content="{ closeDialog }"
      >
        <q-card-section>
          <ItemListBucket
            :source-id="selectedBucketSourceId"
            :is-route="false"
            @selected="onSelectedBucketItem($event, closeDialog)"
          />
        </q-card-section>
      </template>
    </DialogMaster>

    <DialogMaster
      v-model="dialogVimeoSource"
      size="full"
      close-header
      close-footer
    >
      <template
        v-if="selectedVimeoSourceId"
        #content="{ closeDialog }"
      >
        <q-card-section>
          <ItemListVimeo
            :source-id="selectedVimeoSourceId"
            :is-route="false"
            @selected="onSelectedVimeoItem($event, closeDialog)"
          />
        </q-card-section>
      </template>
    </DialogMaster>
  </q-bar>
</template>

<script lang="ts">
import {
  defineComponent, computed, onMounted, ref,
} from 'vue';
import { galleryItemCreate } from 'src/api/galleries';
import { GalleryItem } from 'src/models/gallery';
import { useSourceStore } from 'src/stores/sources';
import { positiveNotification } from 'src/services/notify';
import DialogMaster from 'src/components/DialogMaster.vue';
import ItemListBucket from 'src/pages/items/bucket/ItemList.vue';
import ItemListVimeo from 'src/pages/items/vimeo/ItemList.vue';
import { ItemBucket } from 'src/models/item-bucket';
import { ItemVimeo } from 'src/models/item-vimeo';

const newItem: GalleryItem = {
  id: 0,
  item_order: 0,
  source_type: 'bucket',
  item_bucket: null,
  item_vimeo: null,
  date_created: null,
  source_id: null,
};

export default defineComponent({
  components: { DialogMaster, ItemListBucket, ItemListVimeo },
  props: {
    galleryId: {
      type: [Number, String],
      required: true,
    },
    itemCount: {
      type: Number,
      required: true,
    },
    lastOrderValue: {
      type: Number,
      default: 0,
    },
  },
  emits: ['new'],
  setup(props, { emit }) {
    const dialogBucketSource = ref(false);
    const dialogVimeoSource = ref(false);
    const dropDown = ref();
    const selectedBucketSourceId = ref<number | null>(null);
    const selectedVimeoSourceId = ref<number | null>(null);

    const store = useSourceStore();
    const barTitle = computed(() => `${props.itemCount} ${props.itemCount === 1 ? 'Item' : 'Items'}`);

    const dataBuckets = computed(() => store.bucketData);
    const dataVimeo = computed(() => store.vimeoData);
    const noSources = computed(() => !dataBuckets.value.length && !dataVimeo.value.length);

    onMounted(async () => {
      await store.getBucketSources();
      await store.getVimeoSources();
    });

    function onSelectBucket(sourceId: number) {
      selectedBucketSourceId.value = sourceId;
      dialogBucketSource.value = true;
      dropDown.value.hide();
    }

    function onSelectVimeo(sourceId: number) {
      selectedVimeoSourceId.value = sourceId;
      dialogVimeoSource.value = true;
      dropDown.value.hide();
    }

    async function saveGalleryItem(payload: GalleryItem) {
      payload.item_order = props.lastOrderValue + 1;
      const res = await galleryItemCreate(props.galleryId, payload);
      if (res && res.status === 200) {
        emit('new', res.data);
        positiveNotification('Added Item');
      }
    }

    function onSelectedBucketItem(v: ItemBucket, closeDialog: () => void) {
      const payload: GalleryItem = JSON.parse(JSON.stringify(newItem));
      payload.source_type = 'bucket';
      payload.item_bucket = v;
      closeDialog();
      saveGalleryItem(payload);
    }

    function onSelectedVimeoItem(v: ItemVimeo, closeDialog: () => void) {
      const payload: GalleryItem = JSON.parse(JSON.stringify(newItem));
      payload.source_type = 'vimeo';
      payload.item_vimeo = v;
      closeDialog();
      saveGalleryItem(payload);
    }

    return {
      dialogBucketSource,
      dialogVimeoSource,
      dropDown,
      noSources,
      barTitle,
      dataBuckets,
      dataVimeo,
      onSelectBucket,
      onSelectVimeo,
      selectedBucketSourceId,
      selectedVimeoSourceId,
      onSelectedBucketItem,
      onSelectedVimeoItem,
    };
  },
});
</script>
