<template>
  <div>
    <q-card
      square
      flat
      bordered
      class="absolute-center bg-amber-9"
      style="width: 700px; max-width: 80vw;"
    >
      <q-form
        ref="loginForm"
        @submit="onSubmit"
      >
        <q-card-section class="bg-white">
          <q-input
            v-model="username"
            label="Username"
            color="black"
            filled
            :rules="[(v) => !!v || 'Required']"
            :loading="loading"
          />
          <q-input
            v-model="password"
            label="Password"
            color="black"
            filled
            type="password"
            :rules="[(v) => !!v || 'Required']"
            :loading="loading"
          />
        </q-card-section>
        <q-separator />
        <q-card-actions align="right">
          <q-btn
            label="Login"
            type="submit"
            text-color="white"
            :loading="loading"
          />
        </q-card-actions>
      </q-form>
    </q-card>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from 'stores/auth';

export default defineComponent({
  setup() {
    const store = useAuthStore();
    const router = useRouter();
    const loading = ref(false);
    const loginForm = ref();
    const username = ref();
    const password = ref();

    async function onSubmit() {
      loading.value = true;
      const res = await store.login(username.value, password.value);
      if (res && res.status === 200) {
        loading.value = false;
        await router.push({ name: 'home' });
      }
      loading.value = false;
    }

    return {
      loading,
      loginForm,
      onSubmit,
      password,
      username,
    };
  },
});
</script>
