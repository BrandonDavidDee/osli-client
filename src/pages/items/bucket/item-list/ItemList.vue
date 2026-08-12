<template>
  <div>
    <ErrorServer v-if="serverError" />
    <ErrorNotAuthorized
      v-else-if="!authorized"
      :home-button="isRoute"
      :full-screen="isRoute"
    />
    <div v-else>
      <q-toolbar class="bg-grey-9 text-white">
        <q-toolbar-title>
          {{ sourceData?.title }}
        </q-toolbar-title>
        <TagSelector />
        <q-btn-toggle
          v-model="filterMode"
          size="sm"
          class="q-pr-sm"
          color="grey"
          toggle-color="teal"
          :options="[
            { label: 'AND', value: 'and' },
            { label: 'OR', value: 'or' },
          ]"
        />
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
      <LoadingItems v-if="loading" />
      <div
        v-if="showTopPagination"
        class="q-pa-lg flex flex-center"
      >
        <q-pagination
          v-model="paginationModel"
          :max="maxPages"
          :max-pages="6"
          boundary-links
          color="teal"
        />
      </div>
      <q-card
        v-if="!itemsData.length && !loading"
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
            @selected="onSelected"
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
          v-model="paginationModel"
          :max="maxPages"
          :max-pages="6"
          boundary-links
          color="teal"
        />
      </div>
      <DialogMaster
        v-model="dialog"
        close-header
        close-footer
      >
        <template #content="{ closeDialog }">
          <q-card-section>
            <BatchUploader
              :encryption-key="encryptionKey"
              :source-id="sourceIdAsNumber"
              @uploaded="onUploaded(closeDialog)"
              @error="onUploadError(closeDialog)"
            />
          </q-card-section>
        </template>
      </DialogMaster>
      <DialogMaster
        v-model="dialogEncryptKey"
        close-header
      >
        <template #content="{ closeDialog }">
          <q-card-section>
            <q-input
              v-model="encryptionKey"
              label="Encryption Key"
              filled
              color="black"
              type="password"
            />
          </q-card-section>
          <q-separator />
          <q-card-actions align="right">
            <q-btn
              label="Cancel"
              flat
              @click="closeDialog"
            />
            <q-btn
              label="Continue"
              :disable="!encryptionKey"
              @click="addEncryptionKey(closeDialog)"
            />
          </q-card-actions>
        </template>
      </DialogMaster>
    </div>
  </div>
</template>

<script lang="ts">
import {
  defineComponent, ref, onMounted, watch, computed,
} from 'vue';
import { useRouter } from 'vue-router';
import { itemList } from 'src/api/item-bucket';
import { useKeyStore } from 'src/stores/keys';
import { useSearchStore } from 'stores/search';
import { ItemBucket } from 'src/models/item-bucket';
import { SourceBucket } from 'src/models/source-bucket';
import { SearchPayload } from 'src/models/item';
import TagSelector from 'src/pages/sources/TagSelector.vue';
import DialogMaster from 'src/components/DialogMaster.vue';
import ErrorNotAuthorized from 'src/pages/ErrorNotAuthorized.vue';
import ErrorServer from 'src/pages/ErrorServer.vue';
import LoadingItems from 'src/components/LoadingItems.vue';
import BatchUploader from './BatchUploader.vue';
import ItemListPreview from './ItemListPreview.vue';

export default defineComponent({
  components: {
    ItemListPreview,
    TagSelector,
    BatchUploader,
    DialogMaster,
    LoadingItems,
    ErrorNotAuthorized,
    ErrorServer,
  },
  props: {
    sourceId: {
      type: [Number, String],
      required: true,
    },
    page: {
      type: [Number, String],
      required: true,
    },
    isRoute: {
      type: Boolean,
      required: true,
    },
  },
  emits: ['selected'],
  setup(props, { emit }) {
    const router = useRouter();
    const sourceIdAsNumber = Number(props.sourceId);

    const keyStore = useKeyStore();
    const store = useSearchStore();

    const authorized = ref(true);
    const dialog = ref(false);
    const dialogEncryptKey = ref(false);
    const encryptionKey = ref();
    const filterLocal = ref('');
    const filterMode = ref('or');
    const itemsData = ref<ItemBucket[]>([]);
    const loading = ref(false);
    const limit = ref(18);
    const maxPages = ref(0);
    const serverError = ref(false);
    const sourceData = ref<SourceBucket>();
    const totalCount = ref(0);

    // Pagination model gets synced with the page prop in a watcher
    const paginationModel = ref(Number(props.page));

    const filter = computed(() => store.filter);
    const gridView = computed(() => sourceData.value?.grid_view);
    const selectedTagIds = computed(() => store.selectedTagIds);
    const offset = computed(() => (paginationModel.value - 1) * limit.value);

    async function fetchItemsData() {
      serverError.value = false;
      loading.value = true;
      itemsData.value = [];
      const payload: SearchPayload = {
        source: sourceData.value,
        limit: limit.value,
        offset: offset.value,
        filter: filter.value,
        tag_ids: selectedTagIds.value,
        filter_mode: filterMode.value,
      };
      const res = await itemList(sourceIdAsNumber, payload);
      if (res && res.data && res.status === 200) {
        authorized.value = true;
        sourceData.value = res.data.source;
        itemsData.value = res.data.items;
        totalCount.value = res.data.total_count;
        maxPages.value = Math.ceil(totalCount.value / limit.value);
      } else if (res && res.status === 403) {
        authorized.value = false;
      } else {
        serverError.value = true;
      }
      loading.value = false;
    }

    const showTopPagination = computed(() => itemsData.value.length > 6);

    function addEncryptionKey(closeDialog: () => void) {
      dialog.value = true;
      closeDialog();
      keyStore.addKey(sourceIdAsNumber, 'bucket', encryptionKey.value);
    }

    function resetToFirstPage() {
      if (props.isRoute) {
        // go to route to page 1
        router.push({ name: 'item-list-bucket', params: { sourceId: sourceIdAsNumber, page: 1 } });
      } else {
        // If being shown in dialog pagination still needs to be reset
        paginationModel.value = 1;
      }
      fetchItemsData();
    }

    function onUploaded(closeDialog: () => void) {
      filterLocal.value = '';
      resetToFirstPage();
      closeDialog();
    }

    function showUploader() {
      const keyInStore = keyStore.getKey(sourceIdAsNumber, 'bucket');
      if (!keyInStore) {
        dialogEncryptKey.value = true;
        encryptionKey.value = null;
      } else {
        encryptionKey.value = keyInStore;
        dialog.value = true;
      }
    }

    function onUploadError(closeDialog: () => void) {
      closeDialog();
      encryptionKey.value = null;
      keyStore.removeKey(sourceIdAsNumber, 'bucket');
    }

    function onSelected(v: ItemBucket) {
      emit('selected', v);
    }

    // Watch the page prop and sync paginationModel
    watch(() => props.page, (newPage: string | number) => {
      const pageNum = Number(newPage);
      if (paginationModel.value !== pageNum) {
        paginationModel.value = pageNum;
      }
      fetchItemsData();
    }, { immediate: true });

    // Watch paginationModel and change route accordingly
    watch(paginationModel, (newPage: number) => {
      if (props.isRoute) {
        // Only update route if we're in route mode and the page actually changed
        const currentPage = Number(props.page);
        if (newPage !== currentPage) {
          router.push({ name: 'item-list-bucket', params: { sourceId: sourceIdAsNumber, page: newPage } });
        }
      } else {
        // In dialog mode, fetch data directly (the offset is calculated dynamically)
        fetchItemsData();
      }
    });

    watch(filterLocal, (value) => {
      store.filter = value || '';
      resetToFirstPage();
    });

    watch([filter, filterMode], () => {
      fetchItemsData();
    });

    watch(selectedTagIds, () => {
      resetToFirstPage();
    }, { deep: true });

    onMounted(() => {
      // Initialize local filter with value from store if it exists
      if (store.filter) {
        filterLocal.value = store.filter;
      }

      const keyInStore = keyStore.getKey(sourceIdAsNumber, 'bucket');
      if (keyInStore) {
        encryptionKey.value = keyInStore;
      }
    });

    return {
      filterMode,
      authorized,
      dialog,
      dialogEncryptKey,
      encryptionKey,
      filterLocal,
      gridView,
      itemsData,
      loading,
      maxPages,
      paginationModel,
      serverError,
      showTopPagination,
      sourceData,
      sourceIdAsNumber,
      addEncryptionKey,
      onSelected,
      onUploaded,
      onUploadError,
      showUploader,
    };
  },
});
</script>
