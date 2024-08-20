<template>
  <q-toolbar class="bg-grey-9 text-white q-mb-md">
    <q-btn
      dense
      icon="arrow_back"
      color="white"
      text-color="black"
      size="sm"
      :to="{ name: 'home'}"
    />
    <q-toolbar-title>
      Users
    </q-toolbar-title>
  </q-toolbar>
  <div class="q-ma-md">
    <q-markup-table
      flat
      square
      bordered
    >
      <tbody>
        <tr
          v-for="user in data"
          :key="user.id"
        >
          <td>
            <q-badge
              v-if="user.is_admin"
              color="grey-9"
              class="q-mr-sm"
            >
              Admin
            </q-badge>
            <router-link :to="{ name: 'user-detail', params: { userId: user.id }}">
              {{ user.username }}
            </router-link>
          </td>
          <td>
            <q-badge :color="user.is_active ? 'green' : 'red'">
              {{ activeLabel(user.is_active) }}
            </q-badge>
          </td>
          <td>
            <q-btn
              icon="visibility"
              size="sm"
              flat
              :to="{ name: 'user-detail', params: { userId: user.id }}"
            />
          </td>
        </tr>
      </tbody>
    </q-markup-table>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue';
import { userList } from 'src/api/users';
import { User } from 'src/models/user';

export default defineComponent({
  setup() {
    const data = ref<User[]>([]);

    async function fetchData() {
      const res = await userList();
      if (res && res.data) {
        data.value = res.data;
      }
    }

    function activeLabel(v: boolean) {
      return v ? 'Active' : 'Inactive';
    }

    onMounted(() => fetchData());
    return {
      data,
      activeLabel,
    };
  },
});
</script>
