import { AxiosResponse } from 'axios';
import { api } from 'src/boot/axios';
import errorHandler from './error-handler';

const prefix = `${process.env.API}/api/tags`;

export async function tagList(): Promise<AxiosResponse | undefined> {
  try {
    return await api.get(prefix);
  } catch (err) {
    return errorHandler(err);
  }
}
