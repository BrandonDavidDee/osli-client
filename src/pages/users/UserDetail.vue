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
    <div class="row">
      <div class="col q-pa-md">
        {{ data.username }}
      </div>
      <div class="col q-pa-md">
        <PermissionGroups
          :user-detail="data"
          @new-group="onNewGroup"
          @remove-group="onRemoveGroup"
        />
        <MiscPermissions
          class="q-mt-md"
          :user-detail="data"
        />
      </div>
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
import { userDetail, userScopeUpdate } from 'src/api/users';
import { User } from 'src/models/user';
import ErrorNotAuthorized from 'src/pages/ErrorNotAuthorized.vue';
import PermissionGroups from 'src/pages/users/permissions/PermissionGroups.vue';
import MiscPermissions from 'src/pages/users/permissions/MiscPermissions.vue';

export default defineComponent({
  components: { ErrorNotAuthorized, PermissionGroups, MiscPermissions },
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

    async function onNewGroup(groupName: string) {
      if (data.value) {
        data.value.scopes.push(groupName);
        const res = await userScopeUpdate(props.userId, data.value);
        if (res && res.data) {
          data.value = res.data;
        }
      }
    }

    async function onRemoveGroup(groupName: string) {
      if (data.value) {
        const idx = data.value.scopes.indexOf(groupName);
        if (idx !== -1) {
          data.value.scopes.splice(idx, 1);
        }
        const res = await userScopeUpdate(props.userId, data.value);
        if (res && res.data && res.status === 200) {
          data.value = res.data;
        }
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
      onNewGroup,
      onRemoveGroup,
    };
  },
});
</script>
