import { api } from 'src/boot/axios';
import errorHandler from './error-handler';

const path = `${process.env.API}/api/galleries`;

export async function galleryList() {
  try {
    return await api.get(path);
  } catch (err) {
    return errorHandler(err);
  }
}

export async function galleryDetail(galleryId: number | string) {
  try {
    return await api.get(`${path}/${galleryId}`);
  } catch (err) {
    return errorHandler(err);
  }
}

export async function galleryLinks(galleryId: number | string) {
  try {
    return await api.get(`${path}/${galleryId}/links`);
  } catch (err) {
    return errorHandler(err);
  }
}
