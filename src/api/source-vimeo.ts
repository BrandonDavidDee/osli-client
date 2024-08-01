import { api } from 'src/boot/axios';
import errorHandler from './error-handler';

const path = `${process.env.API}/api/sources/vimeo`;

export async function sourceListVimeo() {
  try {
    return await api.get(path);
  } catch (err) {
    return errorHandler(err);
  }
}
