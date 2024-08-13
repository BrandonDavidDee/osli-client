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
              class="text-right"
              colspan="3"
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
            v-for="gallery in data"
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
      <q-dialog v-model="dialog">
        <q-card
          v-if="selected"
          style="width: 800px; max-width: 80vw;"
        >
          <q-form @submit="onSubmit">
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
        </q-card>
      </q-dialog>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import { Gallery } from 'src/models/gallery';
import { positiveNotification } from 'src/services/notify';
import { galleryCreate, galleryList } from 'src/api/galleries';
import { getDateTimeDisplay } from 'src/services/date-master';

const model = {
  id: 0,
  title: '',
  description: null,
};

export default defineComponent({
  setup() {
    const data = ref<Gallery[]>();
    const dialog = ref(false);
    const loading = ref(false);
    const selected = ref<Gallery | null>(null);

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

    async function onSubmit() {
      if (selected.value) {
        const res = await galleryCreate(selected.value);
        if (res && res.status === 200) {
          positiveNotification('Added Gallery');
          fetchData();
        }
      }
      dialog.value = false;
      selected.value = null;
    }
    onMounted(() => fetchData());
    return {
      addNew,
      data,
      dialog,
      getDateTimeDisplay,
      loading,
      onSubmit,
      selected,
    };
  },
});
</script>
