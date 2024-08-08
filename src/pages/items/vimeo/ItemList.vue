<template>
  <div>
    <q-toolbar class="bg-grey-9 text-white">
      <q-btn
        dense
        icon="arrow_back"
        color="white"
        text-color="black"
        size="sm"
        :to="{name: 'home'}"
      />
      <q-toolbar-title>
        {{ sourceData?.title }}
      </q-toolbar-title>
      <TagSelector />
      <q-input
        v-model="filterLocal"
        class="GPL__toolbar-input"
        dense
        square
        outlined
        color="white"
        bg-color="white"
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
      <q-btn
        class="q-ml-sm"
        icon="add"
        color="white"
        text-color="black"
        size="sm"
        @click="showNewVideoDialog"
      />
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
              <router-link
                :to="{
                  name: 'item-detail-bucket',
                  params: { sourceId: sourceId, itemId: item.id }
                }"
              >
                {{ item.title }}
              </router-link>
            </q-item-label>
            <q-item-label caption>
              {{ item.video_id }}
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
    <q-dialog v-model="dialog">
      <q-card
        style="width: 800px; max-width: 80vw;"
      >
        <q-card-section>
          <q-input
            v-model="newVimeoId"
            filled
            color="black"
            label="Vimeo Video ID"
            :rules="[(v) => !!v || 'Required']"
            :loading="loading"
          />
        </q-card-section>
        <q-card-actions align="right">
          <q-btn
            v-close-popup
            label="Cancel"
            flat
          />
          <q-btn
            label="Create"
            color="green"
            :loading="loading"
            :disable="!newVimeoId"
            @click="createNewItem"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model="dialogEncryptKey">
      <q-card style="width: 800px; max-width: 80vw;">
        <q-card-section>
          <q-input
            v-model="encryptionKey"
            label="Encryption Key"
            filled
            color="black"
            type="password"
          />
        </q-card-section>
        <q-card-actions align="right">
          <q-btn
            v-close-popup
            label="Cancel"
            flat
          />
          <q-btn
            label="Continue"
            :disable="!encryptionKey"
            @click="dialog = true, dialogEncryptKey = false"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script lang="ts">
import {
  defineComponent, ref, onMounted, watch, computed,
} from 'vue';
import { itemList, itemCreate } from 'src/api/item-vimeo';
import { SourceVimeo } from 'src/models/source-vimeo';
import { SearchPayload } from 'src/models/item';
import { ItemVimeo } from 'src/models/item-vimeo';
import { useSearchStore } from 'stores/search';
import TagSelector from 'src/pages/sources/TagSelector.vue';
import ItemPreview from './ItemPreview.vue';

export default defineComponent({
  components: { TagSelector, ItemPreview },
  props: {
    sourceId: {
      type: [Number, String],
      required: true,
    },
  },
  setup(props) {
    const dialog = ref(false);
    const dialogEncryptKey = ref(false);
    const store = useSearchStore();
    const sourceData = ref<SourceVimeo>();
    const itemsData = ref<ItemVimeo[]>([]);
    const limit = ref(18);
    const page = ref(1);
    const offset = ref(0);
    const totalCount = ref(0);
    const maxPages = ref(0);
    const selectedTagIds = computed(() => store.selectedTagIds);
    const filter = computed(() => store.filter);
    const filterLocal = ref('');
    const gridView = computed(() => sourceData.value?.grid_view);
    const newVimeoId = ref('');
    const loading = ref(false);
    const encryptionKey = ref();

    async function fetchItemsData() {
      itemsData.value = [];
      const payload: SearchPayload = {
        source: sourceData.value,
        limit: limit.value,
        offset: offset.value,
        filter: filter.value,
        tag_ids: selectedTagIds.value,
      };
      const res = await itemList(props.sourceId, payload);
      if (res && res.data) {
        sourceData.value = res.data.source;
        itemsData.value = res.data.items;
        totalCount.value = res.data.total_count;
        maxPages.value = Math.ceil(totalCount.value / limit.value);
      }
    }

    function resetSearchParams() {
      page.value = 1;
      filterLocal.value = '';
      // TODO: reset tags and any search values in state too
    }

    async function createNewItem() {
      loading.value = true;
      const res = await itemCreate(props.sourceId, newVimeoId.value, encryptionKey.value);
      if (res && res.status === 200) {
        resetSearchParams();
        fetchItemsData();
      } else {
        encryptionKey.value = null;
      }
      newVimeoId.value = '';
      dialog.value = false;
      loading.value = false;
    }

    function showNewVideoDialog() {
      if (!encryptionKey.value) {
        dialogEncryptKey.value = true;
      } else {
        dialog.value = true;
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
      dialog,
      newVimeoId,
      createNewItem,
      loading,
      dialogEncryptKey,
      encryptionKey,
      showNewVideoDialog,
    };
  },
});
</script>
