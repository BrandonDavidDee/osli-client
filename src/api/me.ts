import { api } from 'src/boot/axios';
import errorHandler from './error-handler';

const path = `${process.env.API}/api/me`;

export async function savedItems() {
  try {
    return await api.get(`${path}/saved-items`);
  } catch (err) {
    return errorHandler(err);
  }
}
