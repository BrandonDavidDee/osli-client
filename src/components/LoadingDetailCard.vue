<template>
  <q-card
    flat
    square
    bordered
  >
    <q-card-section>
      <q-skeleton
        v-for="item in rows"
        :key="item"
        type="text"
      />
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
