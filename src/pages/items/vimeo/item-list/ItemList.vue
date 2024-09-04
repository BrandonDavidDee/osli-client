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
          @click="showNewVideoDialog"
        />
      </q-toolbar>
      <LoadingItems v-if="loading" />
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
                    name: 'item-detail-vimeo',
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
      <DialogMaster
        v-model="dialog"
        close-header
      >
        <template #content="{ closeDialog }">
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
          <q-separator />
          <q-card-actions align="right">
            <q-btn
              label="Cancel"
              flat
              :disable="loading"
              @click="closeDialog"
            />
            <q-btn
              label="Create"
              color="green"
              :loading="loading"
              :disable="!newVimeoId"
              @click="createNewItem(closeDialog)"
            />
          </q-card-actions>
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
import { itemList, itemCreate } from 'src/api/item-vimeo';
import { SourceVimeo } from 'src/models/source-vimeo';
import { SearchPayload } from 'src/models/item';
import { ItemVimeo } from 'src/models/item-vimeo';
import { numeralizeId } from 'src/services/utils';
import { useSearchStore } from 'stores/search';
import { useKeyStore } from 'src/stores/keys';
import TagSelector from 'src/pages/sources/TagSelector.vue';
import DialogMaster from 'src/components/DialogMaster.vue';
import ErrorNotAuthorized from 'src/pages/ErrorNotAuthorized.vue';
import ErrorServer from 'src/pages/ErrorServer.vue';
import LoadingItems from 'src/components/LoadingItems.vue';
import ItemListPreview from './ItemListPreview.vue';

export default defineComponent({
  components: {
    TagSelector, ItemListPreview, DialogMaster, ErrorNotAuthorized, LoadingItems, ErrorServer,
  },
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
  emits: ['selected'],
  setup(props, { emit }) {
    const sourceIdAsNumber = numeralizeId(props.sourceId);

    const store = useSearchStore();
    const keyStore = useKeyStore();

    const authorized = ref(true);
    const dialog = ref(false);
    const dialogEncryptKey = ref(false);
    const encryptionKey = ref();
    const filterLocal = ref('');
    const itemsData = ref<ItemVimeo[]>([]);
    const limit = ref(18);
    const loading = ref(false);
    const maxPages = ref(0);
    const newVimeoId = ref('');
    const offset = ref(0);
    const page = ref(1);
    const serverError = ref(false);
    const sourceData = ref<SourceVimeo>();
    const totalCount = ref(0);

    const filter = computed(() => store.filter);
    const gridView = computed(() => sourceData.value?.grid_view);
    const selectedTagIds = computed(() => store.selectedTagIds);

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

    function addEncryptionKey(closeDialog: () => void) {
      dialog.value = true;
      // dialogEncryptKey.value = false;
      closeDialog();
      keyStore.addKey(sourceIdAsNumber, 'vimeo', encryptionKey.value);
    }

    function resetSearchParams() {
      page.value = 1;
      filterLocal.value = '';
      // TODO: reset tags and any search values in state too
    }

    async function createNewItem(closeDialog: () => void) {
      loading.value = true;
      const res = await itemCreate(sourceIdAsNumber, newVimeoId.value, encryptionKey.value);
      if (res && res.status === 200) {
        resetSearchParams();
        fetchItemsData();
      } else {
        encryptionKey.value = null;
        keyStore.removeKey(sourceIdAsNumber, 'vimeo');
      }
      newVimeoId.value = '';
      closeDialog();
      loading.value = false;
    }

    function showNewVideoDialog() {
      const keyInStore = keyStore.getKey(sourceIdAsNumber, 'vimeo');
      if (!keyInStore) {
        dialogEncryptKey.value = true;
      } else {
        dialog.value = true;
      }
    }

    function onSelected(v: ItemVimeo) {
      emit('selected', v);
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
      const keyInStore = keyStore.getKey(sourceIdAsNumber, 'vimeo');
      if (keyInStore) {
        encryptionKey.value = keyInStore;
      }
    });

    return {
      authorized,
      addEncryptionKey,
      createNewItem,
      filterLocal,
      dialog,
      dialogEncryptKey,
      encryptionKey,
      gridView,
      itemsData,
      loading,
      maxPages,
      newVimeoId,
      onSelected,
      page,
      serverError,
      showNewVideoDialog,
      sourceData,
    };
  },
});
</script>
