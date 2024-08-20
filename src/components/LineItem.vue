<template>
  <div class="q-mb-sm q-mt-sm">
    <span v-if="externalUrl">
      <span class="text-subtitle2">{{ label }}:</span> <span
        class="cursor-pointer"
        @click="openLink(externalUrl)"
      >{{ text }}</span>
    </span>
    <span v-else>
      <span class="text-subtitle2">{{ label }}:</span> {{ text }}
    </span>
    <q-separator v-if="separator" />
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { openLink } from 'src/services/utils';

export default defineComponent({
  props: {
    label: {
      type: String,
      required: true,
    },
    text: {
      type: [String, Number, null] as PropType<string | number | null>,
      default: '',
    },
    separator: {
      type: Boolean,
      default: true,
    },
    externalUrl: {
      type: String,
      default: null,
    },
  },
  setup() {
    return {
      openLink,
    };
  },
});
</script>
