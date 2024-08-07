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
        <q-card
          v-for="item in itemsSorted"
          :key="item.id"
          class="q-mb-sm"
          flat
          bordered
          square
        >
          <q-card-section class="row">
            <div class="col-2">
              <ItemBucketThumb
                v-if="item.item_bucket"
                :item="item.item_bucket"
              />
              <ItemVimeoThumb
                v-if="item.item_vimeo"
                :item="item.item_vimeo"
              />
            </div>
            <div class="col-10">
              <q-input
                v-model.number="item.item_order"
                type="number"
                label="Item Order"
                class="q-ma-md"
                dense
                filled
                color="black"
              />
            </div>
          </q-card-section>
          <q-card-actions
            align="right"
            class="q-pt-none"
          >
            <q-btn
              label="Delete"
              size="sm"
            />
          </q-card-actions>
        </q-card>
      </div>
      <div class="col q-pa-md">
        <q-btn
          label="Links"
          :to="{ name: 'gallery-links', params: { galleryId: galleryId}}"
        />
        <LineItem
          label="Date Created"
          :text="data.date_created"
        />
        <LineItem
          label="Created By"
          :text="data.created_by?.username"
        />
        <q-input
          v-model="data.title"
          color="black"
          filled
          square
          :rules="[(v) => !!v || 'Required']"
          label="Title"
        />
        <q-input
          v-model="data.description"
          color="black"
          filled
          square
          label="Description"
          type="textarea"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {
  defineComponent, ref, watch, computed,
} from 'vue';
import { Gallery } from 'src/models/gallery';
import { galleryDetail } from 'src/api/galleries';
import ItemBucketThumb from 'src/public-thumbs/ItemBucketThumb.vue';
import ItemVimeoThumb from 'src/public-thumbs/ItemVimeoThumb.vue';
import LineItem from 'src/components/LineItem.vue';

export default defineComponent({
  components: { ItemVimeoThumb, ItemBucketThumb, LineItem },
  props: {
    galleryId: {
      type: [Number, String],
      required: true,
    },
  },
  setup(props) {
    const data = ref<Gallery>();
    const loading = ref(false);
    const itemsSorted = computed(() => data.value?.items.slice().sort((a, b) => a.item_order - b.item_order));
    async function fetchData() {
      const res = await galleryDetail(props.galleryId);
      if (res && res.data) {
        data.value = res.data;
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
    };
  },
});
</script>
