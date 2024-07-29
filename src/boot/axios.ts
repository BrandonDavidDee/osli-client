import { boot } from 'quasar/wrappers';
import axios, { AxiosInstance } from 'axios';
import { useAuthStore } from 'stores/auth';
// import { Cookies } from 'quasar';

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $axios: AxiosInstance;
    $api: AxiosInstance;
  }
}

// const noRedirect = ['login', 'password-recovery', 'password-reset'];
const noHeader = ['/api/authentication/login', '/api/authentication/refresh-tokens'];
const api: AxiosInstance = axios.create({ baseURL: process.env.API, withCredentials: true });

export default boot(async ({ app, router, store }) => {
  const authStore = useAuthStore(store);
  // ^^ note that this variable is set at "boot" time and does not update afterward
  // Cookies.get('refresh_token')
  await authStore.refreshTokenSet();

  router.beforeEach(async (to) => {
    if (to.name !== 'login' && !authStore.refreshToken) {
      return { name: 'login' };
    }
    return true;
  });

  api.interceptors.request.use(
    (config) => {
      const token = authStore.accessToken;
      if (config.url && token && !noHeader.includes(config.url)) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error),
  );
  // ^^ adding the token to auth header for an api call
  api.interceptors.response.use(
    (response) => response,
    async (error) => {
      if (error.response && error.response.status === 401) {
        // Token expired, attempt to refresh tokens
        try {
          // const refreshToken = Cookies.get('refresh_token');
          const res = await authStore.refreshTokenSet();
          if (!res) {
            authStore.clearTokens();
            router.push({ name: 'login' });
          } else {
            // Retry the original request with the new tokens
            return api(error.config);
          }
        } catch (refreshError) {
          // Clear tokens and redirect to login page
          authStore.clearTokens();
          router.push({ name: 'login' });
        }
      }
      return Promise.reject(error);
    },
  );
  // ^^ refreshing token if 401 error from api
  app.config.globalProperties.$axios = axios;
  app.config.globalProperties.$api = api;
  app.provide('api', api);
  app.provide('axios', axios);
});

export { api };
