<template>
  <q-layout view="hHh lpR fFf">
    <q-header
      elevated
      class="bg-white text-grey-8"
      height-hint="64"
    >
      <q-toolbar
        class="GPL__toolbar"
        style="height: 64px"
      >
        <q-toolbar-title
          v-if="$q.screen.gt.sm"
          shrink
          class="row items-center no-wrap"
        >
          <router-link :to="{ name: 'home'}">
            <img
              style="height: 40px;"
              :src="logoUrl"
            >
          </router-link>
        </q-toolbar-title>
        <q-space />
        <div class="q-gutter-sm row items-center no-wrap">
          <q-badge
            v-if="isAdmin"
            color="grey-9"
          >
            Admin
          </q-badge><MyMenu @logout="onLogout" />
        </div>
      </q-toolbar>
    </q-header>
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script lang="ts">
import { computed } from 'vue';
import { useAuthStore } from 'stores/auth';
import { useRouter } from 'vue-router';
import MyMenu from 'src/components/MyMenu.vue';

export default {
  components: { MyMenu },
  setup() {
    const store = useAuthStore();
    const router = useRouter();

    const isAdmin = computed(() => store.user?.is_admin);
    const logoUrl = computed(() => {
      const envLogo = process.env.COMPANY_LOGO;
      return (typeof envLogo === 'string' && envLogo) || 'https://dummyimage.com/200x80/262626/fff&text=OSLI';
    });

    function onLogout() {
      store.clearTokens();
      router.push({ name: 'login' });
    }
    return {
      logoUrl,
      onLogout,
      isAdmin,
    };
  },
};
</script>

<style lang="sass">
.GPL

  &__toolbar
    height: 64px

  &__toolbar-input
    width: 35%

  &__drawer-item
    line-height: 24px
    border-radius: 0 24px 24px 0
    margin-right: 12px

    .q-item__section--avatar
      padding-left: 12px
      .q-icon
        color: #5f6368

    .q-item__label:not(.q-item__label--caption)
      color: #3c4043
      letter-spacing: .01785714em
      font-size: .875rem
      font-weight: 500
      line-height: 1.25rem

    &--storage
      border-radius: 0
      margin-right: 0
      padding-top: 24px
      padding-bottom: 24px

  &__side-btn
    &__label
      font-size: 12px
      line-height: 24px
      letter-spacing: .01785714em
      font-weight: 500

  @media (min-width: 1024px)
    &__page-container
      padding-left: 94px
</style>
