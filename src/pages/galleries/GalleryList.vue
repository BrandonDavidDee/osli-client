<template>
  <div>
    <q-toolbar class="bg-grey-9 text-white q-mb-md">
      <q-btn
        dense
        icon="arrow_back"
        color="white"
        text-color="black"
        size="sm"
        :to="{ name: 'home'}"
      />
      <q-toolbar-title>
        Galleries
      </q-toolbar-title>
    </q-toolbar>
    <div class="q-ma-md">
      <q-markup-table
        flat
        square
        bordered
        dense
      >
        <thead>
          <tr>
            <th
              colspan="2"
              class="text-left"
            >
              <q-btn
                icon="settings"
                :label="myGalleries ? 'My Galleries' : 'All Galleries'"
                size="sm"
                flat
                @click="myGalleries = !myGalleries"
              />
            </th>
            <th
              class="text-right"
            >
              <q-btn
                icon="add"
                size="sm"
                flat
                @click="addNew"
              />
            </th>
          </tr>
          <tr>
            <th class="text-left">
              Title
            </th>
            <th class="text-left">
              Created By
            </th>
            <th class="text-left">
              Created On
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="!data">
            <td
              class="text-caption text-grey-8"
              colspan="3"
            >
              No Galleries
            </td>
          </tr>
          <tr
            v-for="gallery in dataFiltered"
            :key="gallery.id"
          >
            <td>
              <router-link :to="{ name: 'gallery-detail', params: { galleryId: gallery.id}}">
                {{ gallery.title }}
              </router-link>
            </td>
            <td>{{ gallery.created_by?.username }}</td>
            <td>{{ getDateTimeDisplay(gallery.date_created) }}</td>
          </tr>
        </tbody>
      </q-markup-table>
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
                label="Title"
                filled
                color="black"
                :rules="[(v) => !!v || 'Required']"
              />
              <q-input
                v-model="selected.description"
                label="Description"
                filled
                color="black"
                type="textarea"
              />
            </q-card-section>
            <q-separator />
            <q-card-actions align="right">
              <q-btn
                v-close-popup
                label="Cancel"
                :disable="loading"
                flat
              />
              <q-btn
                label="Save"
                type="submit"
                color="green"
                :loading="loading"
              />
            </q-card-actions>
          </q-form>
        </template>
      </DialogMaster>
    </div>
  </div>
</template>

<script lang="ts">
import {
  defineComponent, ref, onMounted, computed,
} from 'vue';
import { Gallery } from 'src/models/gallery';
import { positiveNotification } from 'src/services/notify';
import { galleryCreate, galleryList } from 'src/api/galleries';
import { getDateTimeDisplay } from 'src/services/date-master';
import DialogMaster from 'src/components/DialogMaster.vue';
import { useAuthStore } from 'src/stores/auth';

const model = {
  id: 0,
  title: '',
  description: null,
};

export default defineComponent({
  components: { DialogMaster },
  setup() {
    const store = useAuthStore();
    const data = ref<Gallery[]>();
    const dialog = ref(false);
    const loading = ref(false);
    const myGalleries = ref(false);
    const selected = ref<Gallery | null>(null);

    const userId = computed(() => (store.userId !== null ? parseInt(store.userId, 10) : null));

    const dataFiltered = computed(() => {
      if (!myGalleries.value) { return data.value; }
      return data.value?.filter((v) => v.created_by?.id === userId.value);
    });

    async function fetchData() {
      const res = await galleryList();
      if (res && res.data) {
        data.value = res.data;
      }
    }

    function addNew() {
      selected.value = JSON.parse(JSON.stringify(model));
      dialog.value = true;
    }

    async function onSubmit(closeDialog: () => void) {
      if (selected.value) {
        const res = await galleryCreate(selected.value);
        if (res && res.status === 200) {
          positiveNotification('Added Gallery');
          fetchData();
        }
      }
      // dialog.value = false;
      closeDialog();
      selected.value = null;
    }
    onMounted(() => fetchData());
    return {
      addNew,
      data,
      dialog,
      getDateTimeDisplay,
      myGalleries,
      loading,
      onSubmit,
      selected,
      dataFiltered,
    };
  },
});
</script>
