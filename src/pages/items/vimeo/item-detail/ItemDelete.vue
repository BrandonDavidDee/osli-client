<template>
  <div>
    <q-btn
      label="Delete"
      size="sm"
      color="grey-9"
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
  defineComponent, PropType, ref,
} from 'vue';
import { useRouter } from 'vue-router';
import { ItemVimeo } from 'src/models/item-vimeo';
import { itemDelete, itemRelated } from 'src/api/item-vimeo';
import { Gallery } from 'src/models/gallery';
import DialogMaster from 'src/components/DialogMaster.vue';
import { positiveNotification } from 'src/services/notify';
import { getDateTimeDisplay } from 'src/services/date-master';

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
      type: Object as PropType<ItemVimeo>,
      required: true,
    },
  },
  setup(props) {
    const router = useRouter();
    const dialog = ref(false);
    const dialogRelated = ref(false);
    const internalLoading = ref(false);
    const relatedGalleries = ref<Gallery[]>([]);
    const savedUsers = ref<string[]>([]);

    async function doDelete(closeDialog: () => void) {
      internalLoading.value = true;
      const res = await itemDelete(props.sourceId, props.item.id);
      if (res && res.status === 200) {
        positiveNotification('Deleted!');
        router.push({ name: 'item-list-vimeo', params: { sourceId: props.sourceId } });
      }
      closeDialog();
      internalLoading.value = false;
    }

    function showDeleteDialog(closeDialog?: () => void) {
      dialogRelated.value = false;
      dialog.value = true;
      if (closeDialog) {
        closeDialog();
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

    return {
      dialog,
      doDelete,
      internalLoading,
      dialogRelated,
      showDeleteDialog,
      deletePrecheck,
      relatedGalleries,
      savedUsers,
      getDateTimeDisplay,
    };
  },
});
</script>
