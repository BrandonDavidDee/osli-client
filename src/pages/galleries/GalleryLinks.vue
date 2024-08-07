<template>
  <div>
    <q-toolbar class="bg-grey-9 text-white">
      <q-btn
        dense
        icon="arrow_back"
        color="white"
        text-color="black"
        size="sm"
        :to="{name: 'gallery-detail', params: { galleryId }}"
      />
      <q-toolbar-title>
        Gallery Links: {{ data?.title }}
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
            <th class="text-left">
              Title
            </th>
            <th class="text-left">
              Created By
            </th>
            <th class="text-left">
              Expires On
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="link in data?.links"
            :key="link.id"
          >
            <td>
              {{ link.title }}
            </td>
            <td>
              {{ link.created_by?.username }}
            </td>
            <td>
              {{ link.expiration_date }}
            </td>
          </tr>
        </tbody>
      </q-markup-table>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from 'vue';
import { Gallery } from 'src/models/gallery';
import { galleryLinks } from 'src/api/galleries';

export default defineComponent({
  props: {
    galleryId: {
      type: [Number, String],
      required: true,
    },
  },
  setup(props) {
    const data = ref<Gallery>();

    async function fetchData() {
      const res = await galleryLinks(props.galleryId);
      if (res && res.data) {
        data.value = res.data;
      }
    }

    watch(
      () => props.galleryId,
      () => {
        fetchData();
      },
      { immediate: true },
    );

    return {
      data,
    };
  },
});
</script>
