<template>
  <div class="q-mb-sm q-mt-sm">
    <span class="text-subtitle2">{{ label }}:</span> {{ text }}
    <q-separator v-if="separator" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  props: {
    label: {
      type: String,
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
    separator: {
      type: Boolean,
      default: true,
    },
  },
});
</script>
