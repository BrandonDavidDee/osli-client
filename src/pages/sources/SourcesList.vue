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
        :to="{name: 'source-items', params: { sourceId: source.id}}"
      >
        <q-item-section>
          <q-item-label>{{ source.name }}</q-item-label>
          <q-item-label caption>
            {{ source.access_key_id }}
          </q-item-label>
        </q-item-section>
      </q-item>
    </q-list>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import { sourcesList } from 'src/api/sources';

export default defineComponent({
  setup() {
    const data = ref();

    async function fetchData() {
      const res = await sourcesList();
      if (res && res.data) {
        data.value = res.data;
      }
    }

    onMounted(() => fetchData());

    return {
      data,
      fetchData,
    };
  },
});
</script>
