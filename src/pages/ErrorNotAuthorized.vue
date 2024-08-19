<template>
  <div
    class="bg-black text-white text-center q-pa-md flex flex-center"
    :class="fullScreen ? 'fullscreen' : ''"
  >
    <div>
      <div
        style="font-size: 30vh"
      >
        403
      </div>

      <div
        class="text-h2"
        style="opacity:.4"
      >
        Oops. Not Authorized
      </div>

      <q-btn
        v-if="homeButton"
        class="q-mt-xl"
        color="white"
        text-color="black"
        unelevated
        label="Go Home"
        no-caps
        :to="{name: 'home'}"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  props: {
    fullScreen: {
      type: Boolean,
      default: false,
    },
    homeButton: {
      type: Boolean,
      default: false,
    },
  },
});
</script>
