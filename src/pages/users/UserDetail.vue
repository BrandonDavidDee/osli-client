<template>
  <div v-if="authorized">
    <q-toolbar class="bg-grey-9 text-white q-mb-md">
      <q-btn
        dense
        icon="arrow_back"
        color="white"
        text-color="black"
        size="sm"
        :to="{ name: 'user-list'}"
      />
      <q-toolbar-title>
        Users
      </q-toolbar-title>
    </q-toolbar>
    <div class="q-ma-md">
      <pre>{{ data }}</pre>
    </div>
  </div>
  <ErrorNotAuthorized
    v-if="!authorized"
    full-screen
    home-button
  />
</template>

<script lang="ts">
import { defineComponent, watch, ref } from 'vue';
import { userDetail } from 'src/api/users';
import { User } from 'src/models/user';
import ErrorNotAuthorized from 'src/pages/ErrorNotAuthorized.vue';

export default defineComponent({
  components: { ErrorNotAuthorized },
  props: {
    userId: {
      type: [Number, String],
      required: true,
    },
  },
  setup(props) {
    const authorized = ref(true);
    const data = ref<User | null>(null);

    async function fetchData() {
      const res = await userDetail(props.userId);
      if (res && res.data && res.status === 200) {
        authorized.value = true;
        data.value = res.data;
      } else {
        authorized.value = false;
      }
    }

    watch(
      () => props.userId,
      () => {
        fetchData();
      },
      { immediate: true },
    );

    return {
      authorized,
      data,
    };
  },
});
</script>
