<template>
  <q-bar>
    {{ barTitle }}
    <q-space />
    <q-btn-dropdown
      flat
      size="sm"
      icon="add"
      :disable="noSources"
    >
      <q-list>
        <q-item
          v-for="source in dataBuckets"
          :key="source.id"
          clickable
          @click="onSelectBucket(source.id)"
        >
          <q-item-section>
            <q-item-label>{{ source.title }}</q-item-label>
          </q-item-section>
        </q-item>
        <q-item
          v-for="source in dataVimeo"
          :key="source.id"
          clickable
          @click="onSelectVimeo(source.id)"
        >
          <q-item-section>
            <q-item-label>{{ source.title }}</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-btn-dropdown>
  </q-bar>
</template>

<script lang="ts">
import {
  defineComponent, computed, onMounted,
} from 'vue';
import { useSourceStore } from 'src/stores/sources';

export default defineComponent({
  props: {
    itemCount: {
      type: Number,
      required: true,
    },
  },
  setup(props) {
    const store = useSourceStore();
    const barTitle = computed(() => `${props.itemCount} ${props.itemCount === 1 ? 'Item' : 'Items'}`);

    const dataBuckets = computed(() => store.bucketData);
    const dataVimeo = computed(() => store.vimeoData);
    const noSources = computed(() => !dataBuckets.value.length && !dataVimeo.value.length);

    onMounted(async () => {
      await store.getBucketSources();
      await store.getVimeoSources();
    });

    function onSelectBucket(sourceId: number) {
      //
    }

    function onSelectVimeo(sourceId: number) {
      //
    }

    return {
      noSources,
      barTitle,
      dataBuckets,
      dataVimeo,
      onSelectBucket,
      onSelectVimeo,
    };
  },
});
</script>
