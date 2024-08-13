<template>
  <div>
    <q-toolbar class="bg-grey-9 text-white">
      <q-btn
        v-if="isRoute"
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
        v-if="isRoute"
        class="q-ml-sm"
        icon="add"
        color="white"
        text-color="black"
        size="sm"
        @click="showUploader"
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
        <ItemListPreview
          :item="item"
          :use-router="isRoute"
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
    <q-dialog v-model="dialog">
      <q-card style="width: 800px; max-width: 80vw;">
        <BatchUploader
          :encryption-key="encryptionKey"
          :source-id="sourceId"
          @uploaded="onUploaded"
          @error="onUploadError"
        />
        <q-card-actions align="right">
          <q-btn
            v-close-popup
            label="Close"
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
            @click="addEncryptionKey"
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
import { itemList } from 'src/api/item-bucket';
import { ItemBucket } from 'src/models/item-bucket';
import { SourceBucket } from 'src/models/source-bucket';
import { SearchPayload } from 'src/models/item';
import { useKeyStore } from 'src/stores/keys';
import { useSearchStore } from 'stores/search';
import BatchUploader from 'src/components/BatchUploader.vue';
import TagSelector from 'src/pages/sources/TagSelector.vue';
import ItemListPreview from './ItemListPreview.vue';

export default defineComponent({
  components: { ItemListPreview, TagSelector, BatchUploader },
  props: {
    sourceId: {
      type: [Number, String],
      required: true,
    },
    isRoute: {
      type: Boolean,
      required: true,
    },
  },
  setup(props) {
    const keyStore = useKeyStore();
    const store = useSearchStore();

    const dialog = ref(false);
    const dialogEncryptKey = ref(false);
    const encryptionKey = ref();
    const filterLocal = ref('');
    const itemsData = ref<ItemBucket[]>([]);
    const limit = ref(18);
    const maxPages = ref(0);
    const offset = ref(0);
    const page = ref(1);
    const sourceData = ref<SourceBucket>();
    const totalCount = ref(0);

    const filter = computed(() => store.filter);
    const gridView = computed(() => sourceData.value?.grid_view);
    const selectedTagIds = computed(() => store.selectedTagIds);

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

    function addEncryptionKey() {
      dialog.value = true;
      dialogEncryptKey.value = false;
      keyStore.addKey(props.sourceId, 'bucket', encryptionKey.value);
    }

    function resetSearchParams() {
      page.value = 1;
      filterLocal.value = '';
      // TODO: reset tags and any search values in state too
    }

    function onUploaded() {
      resetSearchParams();
      fetchItemsData();
      dialog.value = false;
    }

    function showUploader() {
      const keyInStore = keyStore.getKey(props.sourceId, 'bucket');
      if (!keyInStore) {
        dialogEncryptKey.value = true;
      } else {
        dialog.value = true;
      }
    }

    function onUploadError() {
      dialog.value = false;
      encryptionKey.value = null;
      keyStore.removeKey(props.sourceId, 'bucket');
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
        if (filter.value) {
          filterLocal.value = filter.value;
        }
      }
      const keyInStore = keyStore.getKey(props.sourceId, 'bucket');
      if (keyInStore) {
        encryptionKey.value = keyInStore;
      }
    });

    return {
      addEncryptionKey,
      dialog,
      dialogEncryptKey,
      encryptionKey,
      filterLocal,
      gridView,
      itemsData,
      page,
      maxPages,
      onUploaded,
      onUploadError,
      showUploader,
      sourceData,
    };
  },
});
</script>
