import { defineStore } from 'pinia';
import { Cookies, Notify } from 'quasar';
import { AxiosResponse } from 'axios';
import { jwtDecode } from 'jwt-decode';
import { api } from 'boot/axios';
import { User } from 'src/models/user';

export interface DecodedToken {
  exp: number;
  scopes: string[];
  sub: string;
}

interface AuthState {
  accessToken: string | null
  refreshToken: string | null
  userId: string | null
  user: User | null,
}

interface ResponseData {
  access_token: string
  refresh_token: string
  user: User
}

const loginPath = '/api/authentication/login';
const refreshPath = '/api/authentication/refresh-tokens';

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    accessToken: null,
    refreshToken: null,
    userId: null,
    user: null,
  }),
  getters: {
    refreshTokenCookie(): string | null {
      return Cookies.get('refresh_token');
    },
    authUser: (state) => ({
      accessToken: state.accessToken,
      refreshToken: state.refreshToken,
    }),
  },
  actions: {
    getUserIdFromToken() {
      if (this.accessToken) {
        const decodedToken: DecodedToken = jwtDecode(this.accessToken);
        this.userId = decodedToken.sub;
      }
    },
    clearTokens() {
      this.accessToken = null;
      this.refreshToken = null;
      Cookies.remove('refresh_token');
    },
    storeRefreshTokenCookie(refreshToken: string) {
      Cookies.set('refresh_token', refreshToken, { expires: 365, secure: true, sameSite: 'Strict' });
    },
    setUser(value: User) {
      this.user = value;
    },
    setTokens(accessToken: string, refreshToken: string) {
      this.accessToken = accessToken;
      this.refreshToken = refreshToken;
      this.storeRefreshTokenCookie(refreshToken);
    },
    async login(username: string, password: string) {
      try {
        const res: AxiosResponse = await api.post(loginPath, { username, password });
        const responseData: ResponseData = res.data;
        this.setUser(responseData.user);
        this.setTokens(responseData.access_token, responseData.refresh_token);
        this.getUserIdFromToken();
        return res;
      } catch (err) {
        Notify.create({
          type: 'negative', message: 'Error Logging In',
        });
        return null;
      }
    },
    async refreshTokenSet() {
      if (!this.refreshTokenCookie) { return null; }
      try {
        const res: AxiosResponse = await api.post(refreshPath, {}, { headers: { Authorization: `Bearer ${this.refreshTokenCookie}` } });
        const responseData: ResponseData = res.data;
        this.setUser(responseData.user);
        this.setTokens(responseData.access_token, responseData.refresh_token);
        this.getUserIdFromToken();
        return responseData;
      } catch (err) {
        this.clearTokens();
        Notify.create({
          type: 'negative', message: 'You have been logged out',
        });
        return null;
      }
    },
  },
});
