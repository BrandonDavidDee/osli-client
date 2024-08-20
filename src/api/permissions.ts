import { api } from 'src/boot/axios';
import errorHandler from './error-handler';

const path = `${process.env.API}/api/authentication`;

export async function getPermissions() {
  try {
    return await api.get(`${path}/permissions`);
  } catch (err) {
    return errorHandler(err);
  }
}

export async function getPermissionGroups() {
  try {
    return await api.get(`${path}/permission-groups`);
  } catch (err) {
    return errorHandler(err);
  }
}
