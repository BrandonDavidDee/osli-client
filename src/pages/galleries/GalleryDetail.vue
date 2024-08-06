<template>
  <div
    v-if="data"
    class="q-ma-md"
  >
    <div class="row">
      <div class="col-6">
        <q-input
          v-model="data.title"
          lable="Title"
          color="black"
          filled
          square
          :rules="[(v) => !!v || 'Required']"
          label="Title"
        />
        <q-card
          v-for="item in itemsSorted"
          :key="item.id"
          class="q-mb-sm"
          flat
          bordered
          square
        >
          <q-card-section class="row">
            <div class="col-3">
              <ItemBucketThumb
                v-if="item.item_bucket"
                :item="item.item_bucket"
              />
              <ItemVimeoThumb
                v-if="item.item_vimeo"
                :item="item.item_vimeo"
              />
            </div>
            <div class="col-9">
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
      <div class="col-6">
        <div class="q-pa-sm">
          <div class="text-h5">
            Shares
          </div>
          <q-markup-table
            flat
            square
            bordered
            dense
          >
            <thead>
              <tr>
                <th class="text-left">
                  Title
                </th>
                <th class="text-left">
                  Created By
                </th>
                <th class="text-left">
                  Expires On
                </th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="link in data.links"
                :key="link.id"
              >
                <td>
                  {{ link.title }}
                </td>
                <td>
                  {{ link.created_by?.username }}
                </td>
                <td>
                  {{ link.expiration_date }}
                </td>
              </tr>
            </tbody>
          </q-markup-table>
        </div>
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

export default defineComponent({
  components: { ItemVimeoThumb, ItemBucketThumb },
  props: {
    galleryId: {
      type: [Number, String],
      required: true,
    },
  },
  setup(props) {
    const data = ref<Gallery>();
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
      itemsSorted,
    };
  },
});
</script>

<style>
.thumbnail-container {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  overflow: hidden;
}

.thumbnail {
  max-width: 100%;
  max-height: 100%;
  object-fit: cover;
}
</style>
