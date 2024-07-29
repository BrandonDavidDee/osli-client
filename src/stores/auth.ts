import { defineStore } from 'pinia';
import { Cookies, Notify } from 'quasar';
import { AxiosResponse } from 'axios';
import { jwtDecode } from 'jwt-decode';
import { api } from 'boot/axios';
import { DecodedToken, NumberOrNull, StringOrNull } from 'src/services/token';

interface AuthState {
  accessToken: string | null
  refreshToken: string | null
  isAdmin: boolean
  scopes: string[]
  userId: NumberOrNull
  email: StringOrNull
  username: StringOrNull
  firstName: StringOrNull
  lastName: StringOrNull
  profileImageUrl: StringOrNull
  roleName: StringOrNull
  subscriberId: NumberOrNull
  subscriberName: StringOrNull
  subscriberLogoUrl: StringOrNull
  dbName: StringOrNull
}

interface ResponseData {
  access_token: string
  refresh_token: string
}

const loginPath = '/api/authentication/login';
const refreshPath = '/api/authentication/refresh-tokens';

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    accessToken: null,
    refreshToken: null,
    isAdmin: false,
    scopes: [],
    userId: null,
    email: null,
    username: null,
    firstName: null,
    lastName: null,
    profileImageUrl: null,
    roleName: null,
    subscriberId: null,
    subscriberName: null,
    subscriberLogoUrl: null,
    dbName: null,
  }),
  getters: {
    refreshTokenCookie(): string | null {
      return Cookies.get('refresh_token');
    },
    authUser: (state) => ({
      accessToken: state.accessToken,
      refreshToken: state.refreshToken,
      isAdmin: state.isAdmin,
      userId: state.userId,
      email: state.email,
      username: state.username,
      firstName: state.firstName,
      lastName: state.lastName,
      roleName: state.roleName,
      subscriberId: state.subscriberId,
      subscriberName: state.subscriberName,
      dbName: state.dbName,
      scopes: state.scopes,
    }),
  },
  actions: {
    inflateUser() {
      if (this.accessToken) {
        const decodedToken: DecodedToken = jwtDecode(this.accessToken);
        const { sub } = decodedToken;
        this.isAdmin = sub.is_admin;
        this.userId = sub.user_id;
        this.email = sub.email;
        this.username = sub.username;
        this.firstName = sub.first_name;
        this.lastName = sub.last_name;
        this.profileImageUrl = sub.profile_image_url;
        this.roleName = sub.role_name;
        this.subscriberId = sub.subscriber_id;
        this.subscriberName = sub.subscriber_name;
        this.subscriberLogoUrl = sub.subscriber_logo_url;
        this.dbName = sub.db_name;
        this.scopes = decodedToken.scopes;
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
    setTokens(accessToken: string, refreshToken: string) {
      this.accessToken = accessToken;
      this.refreshToken = refreshToken;
      this.storeRefreshTokenCookie(refreshToken);
    },
    async login(username: string, password: string) {
      try {
        const res: AxiosResponse = await api.post(loginPath, { username, password });
        const responseData: ResponseData = res.data;
        this.setTokens(responseData.access_token, responseData.refresh_token);
        this.inflateUser();
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
        this.setTokens(responseData.access_token, responseData.refresh_token);
        this.inflateUser();
        return responseData;
      } catch (err) {
        this.clearTokens();
        Notify.create({
          type: 'negative', message: 'Error Refreshing Tokens',
        });
        return null;
      }
    },
  },
});
