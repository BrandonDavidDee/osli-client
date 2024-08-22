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
      <div class="col">
        <PermissionGroups
          class="q-ma-sm"
          :user-detail="data"
          @new-scope="onNewScope"
          @remove-scope="onRemoveScope"
        />
      </div>
      <div class="col">
        <MiscPermissions
          class="q-ma-sm"
          :user-detail="data"
          @new-scope="onNewScope"
          @remove-scope="onRemoveScope"
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
import { numeralizeId } from 'src/services/utils';
import ErrorNotAuthorized from 'src/pages/ErrorNotAuthorized.vue';
import PermissionGroups from 'src/pages/users/permissions/PermissionGroups.vue';
import MiscPermissions from 'src/pages/users/permissions/MiscPermissions.vue';

export default defineComponent({
  components: { ErrorNotAuthorized, PermissionGroups, MiscPermissions },
  props: {
    userId: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const userId = numeralizeId(props.userId);
    const authorized = ref(true);
    const data = ref<User | null>(null);

    async function fetchData() {
      const res = await userDetail(userId);
      if (res && res.data && res.status === 200) {
        authorized.value = true;
        data.value = res.data;
      } else {
        authorized.value = false;
      }
    }

    function makeDataCopy() {
      return JSON.parse(JSON.stringify(data.value));
    }

    async function onNewScope(groupName: string) {
      if (data.value) {
        const copy = makeDataCopy();
        copy.scopes.push(groupName);
        const res = await userScopeUpdate(userId, copy);
        if (res && res.data && res.status === 200) {
          data.value = res.data;
        }
      }
    }

    async function onRemoveScope(groupName: string) {
      if (data.value) {
        const copy = makeDataCopy();
        const idx = copy.scopes.indexOf(groupName);
        if (idx !== -1) {
          copy.scopes.splice(idx, 1);
        }
        const res = await userScopeUpdate(userId, copy);
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
      onNewScope,
      onRemoveScope,
    };
  },
});
</script>
