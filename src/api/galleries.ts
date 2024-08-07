import { api } from 'src/boot/axios';
import { GalleryLink } from 'src/models/gallery';
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

export async function galleryLinkCreate(galleryId: number | string, payload: GalleryLink) {
  try {
    return await api.post(`${path}/${galleryId}/links`, payload);
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

export async function galleryLinkUpdate(galleryId: number | string, payload: GalleryLink) {
  try {
    return await api.put(`${path}/${galleryId}/links/${payload.id}`, payload);
  } catch (err) {
    return errorHandler(err);
  }
}

export async function galleryLinkDelete(galleryId: number | string, galleryLinkId: number) {
  try {
    return await api.delete(`${path}/${galleryId}/links/${galleryLinkId}`);
  } catch (err) {
    return errorHandler(err);
  }
}
