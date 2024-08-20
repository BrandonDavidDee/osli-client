<template>
  <div v-if="data && authorized">
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
        Users: {{ data.username }}
      </q-toolbar-title>
    </q-toolbar>
    <div class="q-ma-md">
      <q-card
        flat
        square
        bordered
      >
        <q-card-section class="text-subtitle2">
          {{ data.username }}
        </q-card-section>
        <q-card-section>
          <UserPermissions :user-detail="data" />
        </q-card-section>
      </q-card>
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
import UserPermissions from './UserPermissions.vue';

export default defineComponent({
  components: { UserPermissions, ErrorNotAuthorized },
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
