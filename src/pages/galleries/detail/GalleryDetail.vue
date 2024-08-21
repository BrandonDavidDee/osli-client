<template>
  <div
    v-if="data"
  >
    <q-toolbar class="bg-grey-9 text-white">
      <q-btn
        dense
        icon="arrow_back"
        color="white"
        text-color="black"
        size="sm"
        :to="{ name: 'gallery-list'}"
      />
      <q-toolbar-title>
        Gallery: {{ data.title }}
      </q-toolbar-title>
      <q-spinner
        v-show="loading"
        color="teal"
        size="2em"
      />
    </q-toolbar>
    <div class="row">
      <div class="col q-pa-md">
        <GalleryItems
          :gallery-id="galleryIdAsNumber"
          :gallery="data"
          @update="updateGallery"
          @new="onNewGalleryItem"
          @deleted="onItemDelete"
        />
      </div>
      <div class="col q-pa-md">
        <div class="text-right">
          <q-btn
            label="Links"
            :to="{ name: 'gallery-links', params: { galleryId: galleryId}}"
          />
        </div>
        <q-card
          flat
          square
          bordered
          class="q-mt-sm q-mb-md"
        >
          <q-card-section>
            <LineItem
              label="Date Created"
              :text="getDateTimeDisplay(data.date_created)"
            />
            <LineItem
              label="Created By"
              :text="data.created_by?.username"
              :separator="false"
            />
          </q-card-section>
        </q-card>
        <q-input
          v-model="data.title"
          color="black"
          filled
          square
          :rules="[(v) => !!v || 'Required']"
          label="Title"
          @update:model-value="debouncedGalleryUpdate"
        />
        <q-input
          v-model="data.description"
          color="black"
          filled
          square
          label="Description"
          type="textarea"
          @update:model-value="debouncedGalleryUpdate"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {
  defineComponent, ref, watch, computed,
} from 'vue';
import { debounce } from 'quasar';
import { numeralizeId } from 'src/services/utils';
import { Gallery, GalleryItem } from 'src/models/gallery';
import { galleryDetail, galleryUpdate } from 'src/api/galleries';
import LineItem from 'src/components/LineItem.vue';
import { getDateTimeDisplay } from 'src/services/date-master';
import GalleryItems from './GalleryItems.vue';

export default defineComponent({
  components: {
    LineItem, GalleryItems,
  },
  props: {
    galleryId: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const galleryIdAsNumber = numeralizeId(props.galleryId);
    const data = ref<Gallery>();
    const loading = ref(false);

    const itemsSorted = computed(() => data.value?.items.slice().sort((a, b) => a.item_order - b.item_order));
    async function fetchData() {
      const res = await galleryDetail(galleryIdAsNumber);
      if (res && res.data) {
        data.value = res.data;
      }
    }

    async function updateGallery() {
      if (data.value) {
        await galleryUpdate(galleryIdAsNumber, data.value);
      }
    }

    const debouncedGalleryUpdate = debounce(async () => {
      if (data.value) {
        loading.value = true;
        await galleryUpdate(galleryIdAsNumber, data.value);
        loading.value = false;
      }
    }, 500);

    function onNewGalleryItem(v: GalleryItem) {
      data.value?.items.push(v);
    }

    function onItemDelete(v: number) {
      const found = data.value?.items.find((item) => item.id === v);
      if (found) {
        const idx = data.value?.items.indexOf(found);
        if (idx) {
          data.value?.items.splice(idx, 1);
        }
      }
    }

    watch(
      () => props.galleryId,
      () => {
        fetchData();
      },
      { immediate: true },
    );

    return {
      data,
      loading,
      itemsSorted,
      getDateTimeDisplay,
      updateGallery,
      debouncedGalleryUpdate,
      fetchData,
      onNewGalleryItem,
      onItemDelete,
      galleryIdAsNumber,
    };
  },
});
</script>
