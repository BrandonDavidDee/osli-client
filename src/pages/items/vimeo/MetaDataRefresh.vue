<template>
  <div>
    <q-btn
      label="Refresh Vimeo data"
      size="sm"
      :loading="loading"
      @click="refreshMetaData"
    >
      <q-tooltip
        anchor="bottom left"
      >
        Update thumbnail, height and width from Vimeo
      </q-tooltip>
    </q-btn>
    <DialogMaster
      v-model="dialog"
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
</template>

<script lang="ts">
import {
  defineComponent, PropType, ref, onMounted,
} from 'vue';
import { itemUpdateVimeoMeta } from 'src/api/item-vimeo';
import { ItemVimeo } from 'src/models/item-vimeo';
import { useKeyStore } from 'src/stores/keys';
import DialogMaster from 'src/components/DialogMaster.vue';

export default defineComponent({
  components: { DialogMaster },
  props: {
    sourceId: {
      type: [Number, String],
      required: true,
    },
    item: {
      type: Object as PropType<ItemVimeo>,
      required: true,
    },
  },
  emits: ['update'],
  setup(props, { emit }) {
    const store = useKeyStore();
    const dialog = ref(false);
    const encryptionKey = ref();
    const loading = ref(false);

    async function doUpdate() {
      if (encryptionKey.value) {
        loading.value = true;
        const res = await itemUpdateVimeoMeta(
          props.sourceId,
          props.item.id,
          props.item,
          encryptionKey.value,
        );
        if (res && res.status === 200) {
          emit('update', res.data);
        } else {
          encryptionKey.value = null;
          store.removeKey(props.sourceId, 'vimeo');
        }
        loading.value = false;
      }
    }

    function refreshMetaData() {
      const keyInStore = store.getKey(props.sourceId, 'vimeo');
      if (!keyInStore) {
        dialog.value = true;
      } else {
        doUpdate();
      }
    }

    function addEncryptionKey(closeDialog: () => void) {
      doUpdate();
      closeDialog();
      store.addKey(props.sourceId, 'vimeo', encryptionKey.value);
    }

    onMounted(() => {
      const keyInStore = store.getKey(props.sourceId, 'vimeo');
      if (keyInStore) {
        encryptionKey.value = keyInStore;
      }
    });

    return {
      dialog,
      encryptionKey,
      refreshMetaData,
      addEncryptionKey,
      loading,
    };
  },
});
</script>
