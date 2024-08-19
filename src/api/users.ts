import { api } from 'src/boot/axios';
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
