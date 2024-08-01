<template>
  <div class="q-mb-sm q-mt-sm">
    <span class="text-subtitle2">{{ label }}:</span> {{ text }}
    <q-separator v-if="separator" />
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';

export default defineComponent({
  props: {
    label: {
      type: String,
      required: true,
    },
    text: {
      type: [String, null] as PropType<string | null>,
      default: '',
    },
    separator: {
      type: Boolean,
      default: true,
    },
  },
});
</script>
