<template>
  <q-btn
    icon="account_circle"
    flat
  >
    <q-menu>
      <q-list style="min-width: 200px">
        <q-item
          v-for="item in menuItems"
          :key="item.routeName"
          v-close-popup
          clickable
          :to="{ name: item.routeName }"
          class="text-grey-9"
        >
          <q-item-section avatar>
            <q-icon
              color="teal"
              :name="item.icon"
            />
          </q-item-section>
          <q-item-section>{{ item.label }}</q-item-section>
        </q-item>

        <q-separator />
        <q-item
          v-close-popup
          clickable
          class="text-grey-9"
          @click="$emit('logout')"
        >
          <q-item-section avatar>
            <q-icon
              color="teal"
              name="logout"
            />
          </q-item-section>
          <q-item-section>Log Out</q-item-section>
        </q-item>
      </q-list>
    </q-menu>
  </q-btn>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

interface MenuItem {
  label: string;
  routeName: string;
  icon: string;
}
export default defineComponent({
  emits: ['logout'],
  setup() {
    const menuItems: MenuItem[] = [
      {
        label: 'Profile',
        routeName: 'my-profile',
        icon: 'account_circle',
      },
      {
        label: 'Saved',
        routeName: 'my-saved',
        icon: 'bookmark',
      },
      {
        label: 'My Links',
        routeName: 'my-saved',
        icon: 'link',
      },
    ];
    return {
      menuItems,
    };
  },
});
</script>
