import { api } from 'src/boot/axios';
import errorHandler from './error-handler';

const path = `${process.env.API}/api/public/gallery`;

export async function galleryLinkDetail(link: string) {
  try {
    return await api.get(`${path}/${link}`);
  } catch (err) {
    return errorHandler(err);
  }
}
