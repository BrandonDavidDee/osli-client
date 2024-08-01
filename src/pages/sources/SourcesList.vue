<template>
  <div>
    <q-list
      class="q-ma-xl"
      bordered
      separator
    >
      <q-item
        v-for="source in data"
        :key="source.id"
        v-ripple
        clickable
        :to="makeRouteObj(source)"
      >
        <q-item-section>
          <q-item-label>{{ source.title }}</q-item-label>
        </q-item-section>
      </q-item>
    </q-list>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import { sourceListBucket } from 'src/api/source-bucket';
import { sourceListVimeo } from 'src/api/source-vimeo';

interface ResponseData {
  id: number;
  title: string;
  source_type: string;
}

export default defineComponent({
  setup() {
    const data = ref<ResponseData[]>([]);

    async function fetchData() {
      data.value = [];
      const res = await sourceListBucket();
      if (res && res.data) {
        data.value.push(...res.data);
      }
      const resVimeo = await sourceListVimeo();
      if (resVimeo && resVimeo.data) {
        data.value.push(...resVimeo.data);
      }
    }

    function makeRouteObj(source: ResponseData) {
      const name = source.source_type === 'bucket' ? 'item-list-bucket' : 'item-list-vimeo';
      return { name, params: { sourceId: source.id } };
    }

    onMounted(() => fetchData());

    return {
      data,
      fetchData,
      makeRouteObj,
    };
  },
});
</script>
