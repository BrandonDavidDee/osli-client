<template>
  <div v-if="data">
    <div class="text-h6 q-ma-md text-grey-9">
      <q-input
        v-model="data.title"
        lable="Title"
        color="black"
      />
    </div>
    <div>
      <div
        v-for="item in data?.items"
        :key="item.id"
      >
        <q-card flat>
          <q-card-section class="row">
            <div class="col=3">
              {{ item }}
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from 'vue';
import { Gallery } from 'src/models/gallery';
import { galleryDetail } from 'src/api/galleries';

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
      const res = await galleryDetail(props.galleryId);
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

<style>
.thumbnail-container {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  overflow: hidden;
}

.thumbnail {
  max-width: 100%;
  max-height: 100%;
  object-fit: cover;
}
</style>
