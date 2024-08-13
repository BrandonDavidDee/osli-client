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
    >
      <template
        v-if="selectedBucketSourceId"
        #content="{ closeDialog }"
      >
        <q-bar class="bg-grey-9">
          <q-space />
          <q-btn
            size="sm"
            flat
            icon="close"
            text-color="white"
            @click="closeDialog"
          />
        </q-bar>
        <q-card-section>
          <ItemListBucket
            :source-id="selectedBucketSourceId"
            :is-route="false"
            @selected="onSelectedBucketItem($event, closeDialog)"
          />
        </q-card-section>
        <q-card-actions align="right">
          <q-btn
            label="Close"
            @click="closeDialog"
          />
        </q-card-actions>
      </template>
    </DialogMaster>

    <DialogMaster
      v-model="dialogVimeoSource"
      size="full"
    >
      <template
        v-if="selectedVimeoSourceId"
        #content="{ closeDialog }"
      >
        <q-bar class="bg-grey-9">
          <q-space />
          <q-btn
            size="sm"
            flat
            icon="close"
            text-color="white"
            @click="closeDialog"
          />
        </q-bar>
        <q-card-section>
          <ItemListVimeo
            :source-id="selectedVimeoSourceId"
            :is-route="false"
            @selected="onSelectedVimeoItem($event, closeDialog)"
          />
        </q-card-section>
        <q-card-actions align="right">
          <q-btn
            label="Close"
            @click="closeDialog"
          />
        </q-card-actions>
      </template>
    </DialogMaster>
  </q-bar>
</template>

<script lang="ts">
import {
  defineComponent, computed, onMounted, ref,
} from 'vue';
import { galleryItemCreate } from 'src/api/galleries';
import { GalleryItemCreate } from 'src/models/gallery';
import { useSourceStore } from 'src/stores/sources';
import DialogMaster from 'src/components/DialogMaster.vue';
import ItemListBucket from 'src/pages/items/bucket/ItemList.vue';
import ItemListVimeo from 'src/pages/items/vimeo/ItemList.vue';

const newItem: GalleryItemCreate = {
  item_order: 0,
  item_id: null,
  source_type: null,
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
  },
  setup(props) {
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

    async function saveGalleryItem(payload: GalleryItemCreate) {
      payload.item_order = props.itemCount;
      const res = await galleryItemCreate(props.galleryId, payload);
      console.log(res);
    }

    function onSelectedBucketItem(v: number, closeDialog: () => void) {
      const payload: GalleryItemCreate = JSON.parse(JSON.stringify(newItem));
      payload.source_type = 'bucket';
      payload.item_id = v;
      closeDialog();
      saveGalleryItem(payload);
    }

    function onSelectedVimeoItem(v: number, closeDialog: () => void) {
      const payload: GalleryItemCreate = JSON.parse(JSON.stringify(newItem));
      payload.source_type = 'vimeo';
      payload.item_id = v;
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
