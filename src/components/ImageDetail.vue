<template>
  <div>
    <q-img
      :src="srcUrl"
      :ratio="ratio"
      loading="lazy"
    >
      <template #error>
        <div class="absolute-full flex flex-center bg-grey-8 text-white">
          Error
        </div>
      </template>
      <slot
        name="caption"
      />
    </q-img>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  props: {
    ratio: {
      type: Number,
      default: null,
    },
    srcUrl: {
      type: String,
      required: true,
    },
  },
});

</script>
