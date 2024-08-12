<template>
  <div class="text-right">
    <q-btn
      label="Delete"
      size="sm"
      color="grey-9"
      @click="showDeleteDialog"
    />
    <q-dialog v-model="dialog">
      <q-card style="width: 500px; max-width: 50vw;">
        <q-card-section>Are you sure you want to delete?</q-card-section>
        <q-card-actions align="right">
          <q-btn
            v-close-popup
            label="Cancel"
            :loading="loading"
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
  </div>
</template>

<script lang="ts">
import {
  defineComponent, ref, PropType, onMounted,
} from 'vue';
import { useRouter } from 'vue-router';
import { itemDelete } from 'src/api/item-bucket';
import { ItemBucket } from 'src/models/item-bucket';
import { useKeyStore } from 'src/stores/keys';
import { positiveNotification } from 'src/services/notify';

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
    const encryptionKey = ref();

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
      const keyInStore = keyStore.getKey(props.sourceId, 'bucket');
      if (!keyInStore) {
        dialogEncryptKey.value = true;
      } else {
        dialog.value = true;
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
      doDelete,
      encryptionKey,
      showDeleteDialog,
      addEncryptionKey,
      loading,
    };
  },
});
</script>
