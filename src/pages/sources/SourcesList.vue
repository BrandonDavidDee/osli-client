<template>
  <div class="q-pa-xl">
    <q-list
      bordered
      separator
    >
      <q-item v-if="loadingBuckets">
        <q-item-section avatar>
          <q-icon
            name="mdi-image"
          />
        </q-item-section>
        <q-item-section>
          <q-item-label>
            <q-skeleton type="text" />
          </q-item-label>
          <q-item-label>
            <q-skeleton
              type="text"
              width="10%"
            />
          </q-item-label>
        </q-item-section>
      </q-item>

      <q-item
        v-for="source in dataBuckets"
        :key="source.id"
        v-ripple
        clickable
        :to="{ name: 'item-list-bucket', params: { sourceId: source.id}}"
      >
        <q-item-section avatar>
          <q-icon
            name="mdi-image"
          />
        </q-item-section>
        <q-item-section>
          <q-item-label>{{ source.title }}</q-item-label>
          <q-item-label
            caption
            class="text-uppercase"
          >
            BUCKET
          </q-item-label>
        </q-item-section>
      </q-item>

      <q-item v-if="loadingVimeo">
        <q-item-section avatar>
          <q-icon
            name="mdi-video"
          />
        </q-item-section>
        <q-item-section>
          <q-item-label>
            <q-skeleton type="text" />
          </q-item-label>
          <q-item-label>
            <q-skeleton
              type="text"
              width="10%"
            />
          </q-item-label>
        </q-item-section>
      </q-item>

      <q-item
        v-for="source in dataVimeo"
        :key="source.id"
        v-ripple
        clickable
        :to="{ name: 'item-list-vimeo', params: { sourceId: source.id}}"
      >
        <q-item-section avatar>
          <q-icon
            name="mdi-video"
          />
        </q-item-section>
        <q-item-section>
          <q-item-label>{{ source.title }}</q-item-label>
          <q-item-label
            caption
            class="text-uppercase"
          >
            VIMEO
          </q-item-label>
        </q-item-section>
      </q-item>

      <q-item
        v-ripple
        clickable
        :to="{name: 'gallery-list'}"
      >
        <q-item-section avatar>
          <q-icon
            name="mdi-image-multiple"
          />
        </q-item-section>
        <q-item-section>
          <q-item-label>Galleries</q-item-label>
        </q-item-section>
      </q-item>
    </q-list>
  </div>
</template>

<script lang="ts">
import {
  defineComponent, onMounted, computed,
} from 'vue';
import { useSourceStore } from 'src/stores/sources';

export default defineComponent({
  setup() {
    const store = useSourceStore();

    const dataBuckets = computed(() => store.bucketData);
    const dataVimeo = computed(() => store.vimeoData);

    const loadingBuckets = computed(() => store.bucketLoading);
    const loadingVimeo = computed(() => store.vimeoLoading);

    onMounted(async () => {
      await store.getBucketSources();
      await store.getVimeoSources();
    });

    return {
      loadingBuckets,
      loadingVimeo,
      dataBuckets,
      dataVimeo,
    };
  },
});
</script>
