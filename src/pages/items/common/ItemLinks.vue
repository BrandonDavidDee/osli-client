<template>
  <div>
    <q-toolbar class="bg-grey-9 text-white">
      <q-btn
        dense
        icon="arrow_back"
        color="white"
        text-color="black"
        size="sm"
        :to="{name: 'item-detail-bucket', params: { itemId }}"
      />
      <q-toolbar-title>
        Item Links: {{ displayTitle }}
      </q-toolbar-title>
    </q-toolbar>
    <div class="q-pa-md">
      <q-markup-table
        flat
        square
        bordered
        dense
      >
        <thead>
          <tr>
            <th
              class="text-right"
              colspan="5"
            >
              <q-btn
                icon="add"
                size="sm"
                flat
                @click="addNewItemLink"
              />
            </th>
          </tr>
          <tr>
            <th class="text-left">
              Status
            </th>
            <th class="text-left">
              Title
            </th>
            <th class="text-left">
              View Count
            </th>
            <th class="text-left">
              Created By
            </th>
            <th />
          </tr>
        </thead>
        <tbody>
          <tr v-if="!data?.links.length">
            <td
              colspan="4"
              class="text-caption text-grey-7"
            >
              No Links
            </td>
          </tr>
          <tr
            v-for="link in data?.links"
            :key="link.id"
            :class="!link.is_active ? 'bg-grey-3 text-grey-8' : ''"
          >
            <td>
              <q-badge
                v-if="link.is_active"
                color="green"
              >
                Active
              </q-badge>
            </td>
            <td
              class="cursor-pointer"
              @click="selectLink(link)"
            >
              {{ link.title || 'No Title' }}
            </td>
            <td>
              {{ link.view_count }}
            </td>
            <td>
              {{ link.created_by?.username }}
              <div>{{ getDateTimeDisplay(link.date_created) }}</div>
            </td>
            <td>
              <q-btn-group flat>
                <q-btn
                  size="sm"
                  icon="visibility"
                  round
                  @click="selectLink(link)"
                />
                <q-btn
                  size="sm"
                  icon="content_copy"
                  round
                  @click="copyLink(link.link)"
                />
                <q-btn
                  size="sm"
                  icon="link"
                  round
                  @click="openLink(link.link)"
                />

                <q-btn
                  size="sm"
                  icon="delete"
                  round
                  :disable="isDisabled(link)"
                  @click="deleteWarn(link)"
                />
              </q-btn-group>
            </td>
          </tr>
        </tbody>
      </q-markup-table>
    </div>
    <DialogMaster
      v-model="dialog"
      close-header
    >
      <template
        v-if="selected"
        #content="{ closeDialog }"
      >
        <q-form @submit="onSubmit(closeDialog)">
          <q-card-section>
            <q-input
              v-model="selected.title"
              filled
              hint="Optional - Overrides Gallery Title"
              color="black"
              class="q-mb-md"
              label="Title"
            />
            <ManageLink
              v-if="selected.id > 0"
              :item-link="selected"
              @updated="onUpdatedLink(closeDialog)"
            />
            <q-checkbox
              v-model="selected.is_active"
              class="q-mt-md"
              color="black"
              label="Is Active"
            />
          </q-card-section>
          <q-separator />
          <q-card-actions align="right">
            <q-btn
              v-close-popup
              label="Close"
              flat
            />
            <q-btn
              color="green"
              label="Save"
              type="submit"
              :disable="isDisabled(selected)"
            />
          </q-card-actions>
        </q-form>
      </template>
    </DialogMaster>

    <DialogMaster
      v-model="dialogDelete"
      close-header
      size="small"
    >
      <template #content="{ closeDialog }">
        <q-card-section>Are you sure? This is permanent.</q-card-section>
        <q-separator />
        <q-card-actions align="right">
          <q-btn
            label="Cancel"
            flat
            @click="closeDialog"
          />
          <q-btn
            label="Delete"
            color="red"
            @click="doLinkDelete(closeDialog)"
          />
        </q-card-actions>
      </template>
    </DialogMaster>
  </div>
</template>

<script lang="ts">
import {
  defineComponent, ref, watch, computed,
} from 'vue';
import {
  itemLinkCreate as itemLinkCreateBucket,
  itemLinks as itemLinksBucket,
  itemLinkUpdate as itemLinkUpdateBucket,
  itemLinkDelete as itemLinkDeleteBucket,
} from 'src/api/item-bucket';
import {
  itemLinkCreate as itemLinkCreateVimeo,
  itemLinks as itemLinksVimeo,
  itemLinkUpdate as itemLinkUpdateVimeo,
  itemLinkDelete as itemLinkDeleteVimeo,
} from 'src/api/item-vimeo';
import { ItemLink } from 'src/models/item';
import { ItemVimeo } from 'src/models/item-vimeo';
import { ItemBucket } from 'src/models/item-bucket';
import { getDateTimeDisplay } from 'src/services/date-master';
import { useAuthStore } from 'src/stores/auth';
import { copyLink, openLink } from 'src/services/utils';
import { positiveNotification } from 'src/services/notify';
import DialogMaster from 'src/components/DialogMaster.vue';
import ManageLink from './ManageLink.vue';

export default defineComponent({
  components: { DialogMaster, ManageLink },
  props: {
    sourceId: {
      type: [Number, String],
      required: true,
    },
    itemId: {
      type: [Number, String],
      required: true,
    },
    sourceType: {
      type: String,
      validator: (value: string) => ['bucket', 'vimeo'].includes(value),
      required: true,
    },
  },
  setup(props) {
    const store = useAuthStore();

    const data = ref<ItemBucket | ItemVimeo>();
    const dialog = ref(false);
    const dialogDelete = ref(false);
    const selected = ref<ItemLink>();

    const userId = computed(() => (store.userId !== null ? parseInt(store.userId, 10) : null));

    function isItemBucket(item: ItemBucket | ItemVimeo): item is ItemBucket {
      return (item as ItemBucket).file_path !== undefined;
    }

    // Type guard function for ItemVimeo
    function isItemVimeo(item: ItemBucket | ItemVimeo): item is ItemVimeo {
      return (item as ItemVimeo).video_id !== undefined;
    }

    const displayTitle = computed(() => {
      if (!data.value) return '';
      if (data.value.title) {
        return data.value.title;
      }
      if (isItemBucket(data.value)) {
        return data.value.file_path;
      }
      if (isItemVimeo(data.value)) {
        return data.value.video_id;
      }
      return '';
    });

    async function itemLinks(itemId: number | string) {
      if (props.sourceType === 'bucket') {
        return itemLinksBucket(itemId);
      }
      if (props.sourceType === 'vimeo') {
        return itemLinksVimeo(itemId);
      }
      throw new Error(`Unknown sourceType: ${props.sourceType}`);
    }

    async function fetchData() {
      const res = await itemLinks(props.itemId);
      if (res && res.data) {
        data.value = res.data;
      }
    }

    function selectLink(v: ItemLink) {
      selected.value = v;
      dialog.value = true;
    }

    function addNewItemLink() {
      const model: ItemLink = {
        id: 0,
        title: null,
        link: '',
        expiration_date: null,
        view_count: 0,
        date_created: null,
        created_by: null,
        is_active: true,
      };
      if (userId.value) {
        model.created_by = { id: userId.value, username: '', is_active: true };
      }
      selected.value = model;
      dialog.value = true;
    }

    async function itemLinkCreate(itemId: number | string, selectedItemLink: ItemLink) {
      if (props.sourceType === 'bucket') {
        return itemLinkCreateBucket(itemId, selectedItemLink);
      }
      if (props.sourceType === 'vimeo') {
        return itemLinkCreateVimeo(itemId, selectedItemLink);
      }
      throw new Error(`Unknown sourceType: ${props.sourceType}`);
    }

    async function createNew() {
      if (selected.value) {
        const res = await itemLinkCreate(props.itemId, selected.value);
        if (res && res.status === 200) {
          positiveNotification('Created!');
          // TODO: return object and unshift
          fetchData();
        }
      }
    }
    async function itemLinkUpdate(itemId: number | string, selectedItemLink: ItemLink) {
      if (props.sourceType === 'bucket') {
        return itemLinkUpdateBucket(itemId, selectedItemLink);
      }
      if (props.sourceType === 'vimeo') {
        return itemLinkUpdateVimeo(itemId, selectedItemLink);
      }
      throw new Error(`Unknown sourceType: ${props.sourceType}`);
    }

    async function updateExisting() {
      if (selected.value) {
        const res = await itemLinkUpdate(props.itemId, selected.value);
        if (res && res.status === 200) {
          positiveNotification('Updated!');
        }
      }
    }

    function onSubmit(closeDialog: () => void) {
      if (selected.value && selected.value.id === 0) {
        createNew();
      } else {
        updateExisting();
      }
      closeDialog();
    }

    function deleteWarn(v: ItemLink) {
      selected.value = v;
      dialogDelete.value = true;
    }

    function isDisabled(v: ItemLink) {
      if (!v.created_by) { return true; }
      return v.created_by.id !== userId.value;
    }

    async function itemLinkDelete(itemId: number | string, itemLinkId: number) {
      if (props.sourceType === 'bucket') {
        return itemLinkDeleteBucket(itemId, itemLinkId);
      }
      if (props.sourceType === 'vimeo') {
        return itemLinkDeleteVimeo(itemId, itemLinkId);
      }
      throw new Error(`Unknown sourceType: ${props.sourceType}`);
    }

    async function doLinkDelete(closeDialog: () => void) {
      if (selected.value) {
        const res = await itemLinkDelete(props.itemId, selected.value.id);
        if (res && res.status === 200) {
          positiveNotification('Deleted!');
          fetchData();
        }
      }
      closeDialog();
    }

    function onUpdatedLink(closeDialog: () => void) {
      // TODO: actually replace in array instead of refetching
      fetchData();
      closeDialog();
    }

    watch(
      () => props.itemId,
      () => {
        fetchData();
      },
      { immediate: true },
    );

    return {
      data,
      dialog,
      dialogDelete,
      displayTitle,
      deleteWarn,
      doLinkDelete,
      getDateTimeDisplay,
      isDisabled,
      selectLink,
      selected,
      onSubmit,
      copyLink,
      openLink,
      addNewItemLink,
      onUpdatedLink,
    };
  },
});
</script>
