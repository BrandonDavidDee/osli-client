import { api } from 'src/boot/axios';
import { User } from 'src/models/user';
import errorHandler from './error-handler';

const path = `${process.env.API}/api/users`;

export async function userList() {
  try {
    return await api.get(path);
  } catch (err) {
    return errorHandler(err);
  }
}

export async function userDetail(userId: number | string) {
  try {
    return await api.get(`${path}/${userId}`);
  } catch (err) {
    return errorHandler(err, false);
  }
}

export async function userScopeUpdate(userId: number | string, payload: User) {
  try {
    return await api.put(`${path}/${userId}/scopes`, payload);
  } catch (err) {
    return errorHandler(err);
  }
}
