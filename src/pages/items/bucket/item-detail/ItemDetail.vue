<template>
  <ErrorNotAuthorized
    v-if="!authorized"
    home-button
    full-screen
  />
  <ErrorNotFound v-else-if="notFound" />
  <div
    v-else-if="data"
    class="row"
  >
    <q-toolbar class="bg-grey-9 text-white">
      <q-btn
        dense
        icon="arrow_back"
        color="white"
        text-color="black"
        size="sm"
        :to="{name: 'item-list-bucket', params: { sourceId: data.source.id}}"
      />
      <q-toolbar-title>
        {{ data.source.title }}
      </q-toolbar-title>
      <q-spinner
        v-show="loading"
        color="teal"
        size="2em"
      />
    </q-toolbar>
    <div class="col q-pa-md">
      <ItemDetailPreview :item="data" />
    </div>
    <div class="col q-pa-md">
      <div class="text-right">
        <q-btn-group>
          <q-btn
            label="Links"
            :disable="loading"
            :to="{ name: 'item-links-bucket', params: { sourceId, itemId}}"
          />
          <ItemSave
            :loading="loading"
            :item-id="itemIdAsNumber"
            :saved="data.saved"
            @update="onSaveUpdate"
          />
        </q-btn-group>
      </div>
      <LoadingDetailCard
        v-if="loading"
        class="q-mt-sm"
        :rows="3"
      />
      <q-card
        v-if="!loading"
        flat
        square
        bordered
        class="q-mt-sm"
      >
        <q-card-section>
          <LineItem
            label="File Path"
            :text="data.file_path"
          />
          <LineItem
            label="Mime Type"
            :text="data.mime_type"
          />
          <LineItem
            label="File Size"
            :text="calculateSize(data.file_size)"
            :separator="false"
          />
        </q-card-section>
      </q-card>
      <LoadingInputs
        v-if="loading"
        :rows="2"
        class="q-mt-sm"
      />
      <q-card
        v-if="!loading"
        flat
        square
        bordered
        class="q-mt-sm"
      >
        <q-card-section>
          <q-input
            v-model="data.title"
            filled
            square
            label="Title"
            color="black"
            class="q-mt-md"
            hint="Optional"
            @update:model-value="debouncedItemUpdate"
          />
          <q-input
            v-model="data.notes"
            filled
            square
            type="textarea"
            label="Notes"
            color="black"
            class="q-mt-md"
            @update:model-value="debouncedItemUpdate"
          />
        </q-card-section>
      </q-card>
      <ItemTags
        :loading="loading"
        :source-id="sourceIdAsNumber"
        :item="data"
        source-type="bucket"
        class="q-mt-md"
        @new="onNewTag"
        @deleted="onDeletedTagItem"
      />
      <div class="q-mt-md">
        <ItemDelete
          :loading="loading"
          :source-id="sourceIdAsNumber"
          :item="data"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {
  defineComponent, ref, watch,
} from 'vue';
import { itemDetail, itemUpdate } from 'src/api/item-bucket';
import { debounce } from 'quasar';
import { ItemTag } from 'src/models/item';
import { ItemBucket } from 'src/models/item-bucket';
import { calculateSize, numeralizeId } from 'src/services/utils';
import LineItem from 'src/components/LineItem.vue';
import ItemTags from 'src/pages/items/common/ItemTags.vue';
import ErrorNotAuthorized from 'src/pages/ErrorNotAuthorized.vue';
import ErrorNotFound from 'src/pages/ErrorNotFound.vue';
import LoadingDetailCard from 'src/components/LoadingDetailCard.vue';
import LoadingInputs from 'src/components/LoadingInputs.vue';
import ItemDetailPreview from './ItemDetailPreview.vue';
import ItemSave from './ItemSave.vue';
import ItemDelete from './ItemDelete.vue';

export default defineComponent({
  components: {
    ItemDetailPreview,
    LineItem,
    ItemTags,
    ItemSave,
    ItemDelete,
    ErrorNotAuthorized,
    ErrorNotFound,
    LoadingDetailCard,
    LoadingInputs,
  },
  props: {
    sourceId: {
      type: String,
      required: true,
    },
    itemId: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const sourceIdAsNumber = numeralizeId(props.sourceId);
    const itemIdAsNumber = numeralizeId(props.itemId);

    const authorized = ref(true);
    const notFound = ref(false);
    const data = ref<ItemBucket | null>(null);
    const loading = ref(false);

    async function fetchData() {
      loading.value = true;
      authorized.value = true;
      notFound.value = false;
      data.value = null;
      try {
        const res = await itemDetail(sourceIdAsNumber, itemIdAsNumber);
        if (res && res.status === 200 && res.data) {
          data.value = res.data;
        } else if (res && res.status === 404) {
          notFound.value = true;
        } else if (res && res.status === 403) {
          authorized.value = false;
        }
      } catch (error) {
        authorized.value = false;
      } finally {
        loading.value = false;
      }
    }

    const debouncedItemUpdate = debounce(async () => {
      if (data.value) {
        loading.value = true;
        await itemUpdate(sourceIdAsNumber, itemIdAsNumber, data.value);
        loading.value = false;
      }
    }, 500);

    function onNewTag(v: ItemTag) {
      data.value?.tags.push(v);
    }

    function onDeletedTagItem(v: number) {
      const index = data.value?.tags.findIndex((i: ItemTag) => i.id === v);
      if (index !== undefined && index !== -1) {
        data.value?.tags.splice(index, 1);
      }
    }

    function onSaveUpdate(v: boolean) {
      if (data.value) {
        data.value.saved = v;
      }
    }

    watch(() => props.itemId, () => {
      fetchData();
    }, { immediate: true });

    return {
      authorized,
      data,
      loading,
      calculateSize,
      debouncedItemUpdate,
      onNewTag,
      onDeletedTagItem,
      onSaveUpdate,
      notFound,
      itemIdAsNumber,
      sourceIdAsNumber,
    };
  },
});
</script>
