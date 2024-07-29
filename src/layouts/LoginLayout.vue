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
            outlined
            :rules="[(v) => !!v || 'Required']"
          />
          <q-input
            v-model="password"
            label="Password"
            color="black"
            outlined
            type="password"
            :rules="[(v) => !!v || 'Required']"
          />
        </q-card-section>
        <q-card-actions align="right">
          <q-btn
            label="Login"
            type="submit"
            text-color="white"
          />
        </q-card-actions>
      </q-form>
    </q-card>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { useAuthStore } from 'stores/auth';
import { useRouter } from 'vue-router';

export default defineComponent({
  setup() {
    const store = useAuthStore();
    const router = useRouter();
    const loginForm = ref();
    const username = ref();
    const password = ref();
    async function onSubmit() {
      const res = await store.login(username.value, password.value);
      if (res && res.status === 200) {
        await router.push({ name: 'home' });
      }
    }
    return {
      loginForm,
      username,
      password,
      onSubmit,
    };
  },
});
</script>
