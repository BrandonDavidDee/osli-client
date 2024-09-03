<template>
  <div class="text-right">
    <q-btn
      label="Delete"
      size="sm"
      color="grey-9"
      :disable="loading"
      @click="deletePrecheck"
    />
    <DialogMaster
      v-model="dialog"
      close-header
      size="small"
    >
      <template #content="{ closeDialog }">
        <q-card-section>Are you sure you want to delete?</q-card-section>
        <q-separator />
        <q-card-actions align="right">
          <q-btn
            label="Cancel"
            :diable="internalLoading"
            flat
            @click="closeDialog"
          />
          <q-btn
            label="Delete"
            color="red"
            :loading="internalLoading"
            @click="doDelete(closeDialog)"
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
    <DialogMaster
      v-model="dialogRelated"
      close-header
    >
      <template #content="{ closeDialog }">
        <q-card-section v-if="relatedGalleries.length">
          <q-banner class="bg-amber-3">
            This item must be removed from the following galleries before deleting:
          </q-banner>
          <q-markup-table
            flat
            square
            bordered
            dense
            class="q-mt-md"
          >
            <thead>
              <tr>
                <th class="text-left">
                  Title
                </th>
                <th class="text-left">
                  Created On
                </th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="gallery in relatedGalleries"
                :key="gallery.id"
              >
                <td>
                  {{ gallery.title }}
                </td>
                <td>{{ getDateTimeDisplay(gallery.date_created) }}</td>
              </tr>
            </tbody>
          </q-markup-table>
        </q-card-section>
        <q-card-section v-if="savedUsers.length">
          <q-banner class="bg-grey-3">
            The following users have this item saved.
          </q-banner>
          <q-list
            bordered
            separator
            class="q-mt-md"
            dense
          >
            <q-item
              v-for="username in savedUsers"
              :key="username"
            >
              <q-item-section>{{ username }}</q-item-section>
            </q-item>
          </q-list>
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
            color="amber"
            :disable="relatedGalleries.length > 0"
            @click="showDeleteDialog(closeDialog);"
          />
        </q-card-actions>
      </template>
    </DialogMaster>
  </div>
</template>

<script lang="ts">
import {
  defineComponent, ref, PropType, onMounted,
} from 'vue';
import { useRouter } from 'vue-router';
import { itemDelete, itemRelated } from 'src/api/item-bucket';
import { ItemBucket } from 'src/models/item-bucket';
import { Gallery } from 'src/models/gallery';
import { useKeyStore } from 'src/stores/keys';
import { positiveNotification } from 'src/services/notify';
import { getDateTimeDisplay } from 'src/services/date-master';
import DialogMaster from 'src/components/DialogMaster.vue';

interface RelatedData {
  has_related: boolean;
  galleries: Gallery[];
  saved_users: string[];
}

export default defineComponent({
  components: { DialogMaster },
  props: {
    loading: {
      type: Boolean,
      required: true,
    },
    sourceId: {
      type: Number,
      required: true,
    },
    item: {
      type: Object as PropType<ItemBucket>,
      required: true,
    },
  },
  setup(props) {
    const keyStore = useKeyStore();
    const router = useRouter();
    const internalLoading = ref(false);

    const dialog = ref(false);
    const dialogEncryptKey = ref(false);
    const dialogRelated = ref(false);
    const encryptionKey = ref();

    const relatedGalleries = ref<Gallery[]>([]);
    const savedUsers = ref<string[]>([]);

    async function doDelete(closeDialog: () => void) {
      internalLoading.value = true;
      const res = await itemDelete(encryptionKey.value, props.sourceId, props.item);
      if (res && res.status !== 200) {
        encryptionKey.value = null;
        keyStore.removeKey(props.sourceId, 'bucket');
      } else {
        positiveNotification('Deleted!');
        router.push({ name: 'item-list-bucket', params: { sourceId: props.sourceId } });
      }
      closeDialog();
      internalLoading.value = false;
    }

    function showDeleteDialog(closeDialog?: () => void) {
      dialogRelated.value = false;
      const keyInStore = keyStore.getKey(props.sourceId, 'bucket');
      if (!keyInStore) {
        dialogEncryptKey.value = true;
      } else if (closeDialog) {
        closeDialog();
      } else {
        dialog.value = true;
      }
    }

    async function deletePrecheck() {
      const res = await itemRelated(props.sourceId, props.item.id);
      if (res && res.data) {
        const relatedData: RelatedData = res.data;
        relatedGalleries.value = relatedData.galleries;
        savedUsers.value = relatedData.saved_users;
        if (relatedData.has_related) {
          dialogRelated.value = true;
        } else {
          showDeleteDialog();
        }
      }
    }

    function addEncryptionKey(closeDialog: () => void) {
      dialog.value = true;
      closeDialog();
      keyStore.addKey(props.sourceId, 'bucket', encryptionKey.value);
    }

    onMounted(() => {
      const keyInStore = keyStore.getKey(props.sourceId, 'bucket');
      if (keyInStore) {
        encryptionKey.value = keyInStore;
      }
    });

    return {
      dialog,
      dialogEncryptKey,
      dialogRelated,
      doDelete,
      encryptionKey,
      deletePrecheck,
      showDeleteDialog,
      addEncryptionKey,
      internalLoading,
      relatedGalleries,
      savedUsers,
      getDateTimeDisplay,
    };
  },
});
</script>
