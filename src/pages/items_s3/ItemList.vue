<template>
  <div>
    <q-toolbar>
      <q-icon
        name="mdi-image-multiple"
        size="sm"
      />
      <q-toolbar-title>
        {{ sourceData?.name }}
      </q-toolbar-title>
      <TagSelector />
      <q-input
        v-model="filterLocal"
        class="GPL__toolbar-input"
        dense
        square
        outlined
        color="black"
        placeholder="Search"
        debounce="500"
      >
        <template #prepend>
          <q-icon
            v-if="filterLocal === ''"
            name="search"
          />
          <q-icon
            v-else
            name="clear"
            class="cursor-pointer"
            @click="filterLocal = ''"
          />
        </template>
      </q-input>
    </q-toolbar>
    <q-card
      v-if="!itemsData.length"
      class="q-ma-sm"
      flat
      bordered
      square
    >
      <q-card-section>No Results</q-card-section>
    </q-card>
    <div
      v-if="gridView"
      class="row"
    >
      <div
        v-for="item in itemsData"
        :key="item.id"
        class="col-xs-12 col-sm-6 col-md-4 col-lg-3 col-xl-2"
      >
        <ItemPreview
          :item="item"
        />
      </div>
    </div>
    <div v-else>
      <q-list
        bordered
        separator
        class="q-ma-md"
      >
        <q-item
          v-for="item in itemsData"
          :key="item.id"
        >
          <q-item-section>
            <q-item-label>
              <router-link :to="{ name: 'item-detail', params: { itemId: item.id }}">
                {{ item.file_name }}
              </router-link>
            </q-item-label>
            <q-item-label caption>
              {{ item.mime_type }}
            </q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </div>
    <div
      v-if="itemsData.length"
      class="q-pa-lg flex flex-center"
    >
      <q-pagination
        v-model="page"
        :max="maxPages"
        :max-pages="6"
        boundary-links
        color="teal"
      />
    </div>
  </div>
</template>

<script lang="ts">
import {
  defineComponent, ref, onMounted, watch, computed,
} from 'vue';
import { itemS3List } from 'src/api/items';
import { Source } from 'src/models/source-config';
import { Item, SearchPayload } from 'src/models/item';
import { useSearchStore } from 'stores/search';
import TagSelector from 'src/pages/sources/TagSelector.vue';
import ItemPreview from './ItemPreview.vue';

export default defineComponent({
  components: { ItemPreview, TagSelector },
  props: {
    sourceS3Id: {
      type: [Number, String],
      required: true,
    },
  },
  setup(props) {
    const store = useSearchStore();
    const sourceData = ref<Source>();
    const itemsData = ref<Item[]>([]);
    const limit = ref(18);
    const page = ref(1);
    const offset = ref(0);
    const totalCount = ref(0);
    const maxPages = ref(0);
    const selectedTagIds = computed(() => store.selectedTagIds);
    const filter = computed(() => store.filter);
    const filterLocal = ref('');
    const gridView = computed(() => sourceData.value?.grid_view);

    async function fetchItemsData() {
      itemsData.value = [];
      const payload: SearchPayload = {
        source: sourceData.value,
        limit: limit.value,
        offset: offset.value,
        filter: filter.value,
        tag_ids: selectedTagIds.value,
      };
      const res = await itemS3List(props.sourceS3Id, payload);
      if (res && res.data) {
        sourceData.value = res.data.source;
        itemsData.value = res.data.items;
        totalCount.value = res.data.total_count;
        maxPages.value = Math.ceil(totalCount.value / limit.value);
      }
    }

    watch(filter, () => {
      fetchItemsData();
    }, { immediate: true });

    watch(filterLocal, (value) => {
      store.filter = value || '';
    });

    watch(page, (v) => {
      offset.value = (v - 1) * limit.value;
      fetchItemsData();
    });

    watch(selectedTagIds, () => {
      fetchItemsData();
    }, { deep: true });

    onMounted(() => {
      if (store.page) {
        page.value = store.page;
      }
    });

    return {
      itemsData,
      page,
      maxPages,
      sourceData,
      gridView,
      filterLocal,
    };
  },
});
</script>
