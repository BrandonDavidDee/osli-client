<template>
  <div class="text-right">
    <q-btn
      label="Delete"
      size="sm"
      color="grey-9"
      @click="deletePrecheck"
    />
    <q-dialog v-model="dialog">
      <q-card style="width: 500px; max-width: 50vw;">
        <q-card-section>Are you sure you want to delete?</q-card-section>
        <q-card-actions align="right">
          <q-btn
            v-close-popup
            label="Cancel"
            :diable="loading"
            flat
          />
          <q-btn
            label="Delete"
            color="red"
            :loading="loading"
            @click="doDelete"
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
    <q-dialog v-model="dialogRelated">
      <q-card style="width: 800px; max-width: 80vw;">
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
        <q-card-section>
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
        <q-card-actions align="right">
          <q-btn
            v-close-popup
            label="Cancel"
            flat
          />
          <q-btn
            label="Continue"
            color="amber"
            :disable="relatedGalleries.length > 0"
            @click="showDeleteDialog();"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
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

interface RelatedData {
  has_related: boolean;
  galleries: Gallery[];
  saved_users: string[];
}

export default defineComponent({
  props: {
    sourceId: {
      type: [Number, String],
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
    const loading = ref(false);

    const dialog = ref(false);
    const dialogEncryptKey = ref(false);
    const dialogRelated = ref(false);
    const encryptionKey = ref();

    const relatedGalleries = ref<Gallery[]>([]);
    const savedUsers = ref<string[]>([]);

    async function doDelete() {
      loading.value = true;
      const res = await itemDelete(encryptionKey.value, props.sourceId, props.item);
      if (res && res.status !== 200) {
        encryptionKey.value = null;
        keyStore.removeKey(props.sourceId, 'bucket');
      } else {
        positiveNotification('Deleted!');
        router.push({ name: 'item-list-bucket', params: { sourceId: props.sourceId } });
      }
      dialog.value = false;
      loading.value = false;
    }

    function showDeleteDialog() {
      dialogRelated.value = false;
      const keyInStore = keyStore.getKey(props.sourceId, 'bucket');
      if (!keyInStore) {
        dialogEncryptKey.value = true;
      } else {
        dialog.value = true;
      }
    }

    async function deletePrecheck() {
      const res = await itemRelated(props.item.id);
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

    function addEncryptionKey() {
      dialog.value = true;
      dialogEncryptKey.value = false;
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
      loading,
      relatedGalleries,
      savedUsers,
      getDateTimeDisplay,
    };
  },
});
</script>
