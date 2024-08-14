<template>
  <div>
    <q-card
      flat
      bordered
      square
    >
      <q-card-section class="text-subtitle2">
        Public Link
      </q-card-section>
      <q-separator />
      <q-card-section
        class="cursor-pointer"
        @click="copyLink(itemLink.link)"
      >
        {{ itemLink.link }}
      </q-card-section>
    </q-card>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { ItemLink } from 'src/models/item';
import { copyLink } from 'src/services/utils';

export default defineComponent({
  props: {
    itemLink: {
      type: Object as PropType<ItemLink>,
      required: true,
    },
  },
  setup() {
    return {
      copyLink,
    };
  },
});
</script>
