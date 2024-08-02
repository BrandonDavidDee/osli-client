import { api } from 'src/boot/axios';
import errorHandler from './error-handler';

const path = `${process.env.API}/api/gallery-links`;

export async function galleryLinkDetail(link: string) {
  try {
    return await api.get(`${path}/${link}`);
  } catch (err) {
    return errorHandler(err);
  }
}
