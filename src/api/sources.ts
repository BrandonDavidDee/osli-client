import { api } from 'src/boot/axios';
import errorHandler from './error-handler';

const prefix = `${process.env.API}/api/sources`;

export async function sourcesList() {
  try {
    return await api.get(prefix);
  } catch (err) {
    return errorHandler(err);
  }
}

export async function sourceDetail(sourceId: number | string) {
  try {
    return await api.get(`${prefix}/${sourceId}`);
  } catch (err) {
    return errorHandler(err);
  }
}
