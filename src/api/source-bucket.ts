import { api } from 'src/boot/axios';
import errorHandler from './error-handler';

const path = `${process.env.API}/api/sources/bucket`;

export async function sourceListBucket() {
  try {
    return await api.get(path);
  } catch (err) {
    return errorHandler(err);
  }
}
