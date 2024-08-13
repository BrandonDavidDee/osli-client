import { api } from 'src/boot/axios';
import { Gallery, GalleryLink, GalleryItemCreate } from 'src/models/gallery';
import errorHandler from './error-handler';

const path = `${process.env.API}/api/galleries`;

export async function galleryCreate(payload: Gallery) {
  try {
    return await api.post(path, payload);
  } catch (err) {
    return errorHandler(err);
  }
}

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

export async function galleryUpdate(galleryId: number | string, payload: Gallery) {
  try {
    return await api.put(`${path}/${galleryId}`, payload);
  } catch (err) {
    return errorHandler(err);
  }
}

export async function galleryItemCreate(galleryId: number | string, payload: GalleryItemCreate) {
  try {
    return await api.post(`${path}/${galleryId}/items`, payload);
  } catch (err) {
    return errorHandler(err);
  }
}

export async function galleryItemDelete(galleryId: number | string, galleryItemId: number) {
  try {
    return await api.delete(`${path}/${galleryId}/items/${galleryItemId}`);
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
