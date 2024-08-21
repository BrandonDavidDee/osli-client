import { api } from 'src/boot/axios';
import { Gallery, GalleryLink, GalleryItem } from 'src/models/gallery';
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

export async function galleryDetail(galleryId: number) {
  try {
    return await api.get(`${path}/${galleryId}`);
  } catch (err) {
    return errorHandler(err);
  }
}

export async function galleryUpdate(galleryId: number, payload: Gallery) {
  try {
    return await api.put(`${path}/${galleryId}`, payload);
  } catch (err) {
    return errorHandler(err);
  }
}

export async function galleryItemCreate(galleryId: number, payload: GalleryItem) {
  try {
    return await api.post(`${path}/${galleryId}/items`, payload);
  } catch (err) {
    return errorHandler(err);
  }
}

export async function galleryItemDelete(galleryId: number, galleryItemId: number) {
  try {
    return await api.delete(`${path}/${galleryId}/items/${galleryItemId}`);
  } catch (err) {
    return errorHandler(err);
  }
}

export async function galleryLinkCreate(galleryId: number, payload: GalleryLink) {
  try {
    return await api.post(`${path}/${galleryId}/links`, payload);
  } catch (err) {
    return errorHandler(err);
  }
}

export async function galleryLinks(galleryId: number) {
  try {
    return await api.get(`${path}/${galleryId}/links`);
  } catch (err) {
    return errorHandler(err);
  }
}

export async function galleryLinkUpdate(galleryId: number, payload: GalleryLink, linkOnly: boolean) {
  try {
    return await api.put(`${path}/${galleryId}/links/${payload.id}?link_only=${linkOnly}`, payload);
  } catch (err) {
    return errorHandler(err);
  }
}

export async function galleryLinkDelete(galleryId: number, galleryLinkId: number) {
  try {
    return await api.delete(`${path}/${galleryId}/links/${galleryLinkId}`);
  } catch (err) {
    return errorHandler(err);
  }
}

export async function galleryLinkAvailability(link: string) {
  try {
    return await api.get(`${path}/link-availability/${link}`);
  } catch (err) {
    return errorHandler(err);
  }
}
