<template>
  <q-card
    flat
    square
    bordered
  >
    <q-card-section>
      <div
        v-for="item in rows"
        :key="item"
        class="q-mt-sm q-mb-sm"
      >
        <q-skeleton
          type="QInput"
        />
      </div>
    </q-card-section>
  </q-card>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  props: {
    rows: {
      type: Number,
      required: true,
    },
  },
});
</script>
