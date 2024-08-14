<template>
  <div class="fullscreen bg-black text-white text-center q-pa-md flex flex-center">
    <div>
      <div
        style="font-size: 30vh"
      >
        404
      </div>

      <div
        class="text-h2"
        style="opacity:.4"
      >
        Oops. Nothing here...
      </div>

      <q-btn
        v-if="companyUrl"
        class="q-mt-xl"
        color="white"
        text-color="black"
        unelevated
        label="Go Home"
        no-caps
        @click="openCompanyUrl"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { computed } from 'vue';
import { openLink } from 'src/services/utils';

export default {
  setup() {
    const companyUrl = computed(() => {
      const url = process.env.COMPANY_URL;
      return (typeof url === 'string' && url) || null;
    });
    function openCompanyUrl() {
      if (companyUrl.value) {
        openLink(companyUrl.value);
      }
    }
    return {
      companyUrl,
      openCompanyUrl,
    };
  },
};
</script>
