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
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import { Gallery } from 'src/models/gallery';
import { galleryList } from 'src/api/galleries';
import { getDateTimeDisplay } from 'src/services/date-master';

export default defineComponent({
  setup() {
    const data = ref<Gallery[]>();
    async function fetchData() {
      const res = await galleryList();
      if (res && res.data) {
        data.value = res.data;
      }
    }
    onMounted(() => fetchData());
    return {
      data,
      getDateTimeDisplay,
    };
  },
});
</script>
