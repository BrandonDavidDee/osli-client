import { api } from 'src/boot/axios';
import errorHandler from './error-handler';

const s3Prefix = `${process.env.API}/api/sources/bucket`;

export async function sourceBucketList() {
  try {
    return await api.get(s3Prefix);
  } catch (err) {
    return errorHandler(err);
  }
}

const vimeoPrefix = `${process.env.API}/api/sources/vimeo`;

export async function sourceVimeoList() {
  try {
    return await api.get(vimeoPrefix);
  } catch (err) {
    return errorHandler(err);
  }
}
