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
          <q-item-label>{{ source.name }}</q-item-label>
        </q-item-section>
      </q-item>
    </q-list>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import { sourcesS3List, sourcesVimeoList } from 'src/api/sources';

interface ResponseData {
  id: number;
  name: string;
  source_type: string;
}

export default defineComponent({
  setup() {
    const data = ref<ResponseData[]>([]);

    async function fetchData() {
      data.value = [];
      const res = await sourcesS3List();
      if (res && res.data) {
        data.value.push(...res.data);
      }
      const resVimeo = await sourcesVimeoList();
      if (resVimeo && resVimeo.data) {
        data.value.push(...resVimeo.data);
      }
    }

    function makeRouteObj(source: ResponseData) {
      const name = source.source_type === 's3' ? 's3-item-list' : 'vimeo-item-list';
      const params = source.source_type === 's3' ? { sourceS3Id: source.id } : { sourceVimeoId: source.id };
      return { name, params };
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
