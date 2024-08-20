import { api } from 'src/boot/axios';
import { SearchPayload, ItemTag, ItemLink } from 'src/models/item';
import { ItemVimeo } from 'src/models/item-vimeo';
import errorHandler from './error-handler';

const path = `${process.env.API}/api/items/vimeo`;

interface NewItem {
  video_id: string;
}

export async function itemCreate(sourceId: number | string, videoId: string, encryptionKey: string) {
  try {
    const payload: NewItem = { video_id: videoId };
    return await api.post(`${path}?source_id=${sourceId}&encryption_key=${encryptionKey}`, payload);
  } catch (err) {
    return errorHandler(err);
  }
}

export async function itemList(sourceId: number | string, payload: SearchPayload) {
  try {
    return await api.post(`${path}/search?source_id=${sourceId}`, payload);
  } catch (err) {
    return errorHandler(err, false);
  }
}

export async function itemDetail(sourceId: number | string, itemId: number | string) {
  try {
    return await api.get(`${path}/${itemId}?source_id=${sourceId}`);
  } catch (err) {
    return errorHandler(err, false);
  }
}

export async function itemUpdate(sourceId: number | string, itemId: number | string, payload: ItemVimeo) {
  try {
    return await api.put(`${path}/${itemId}?source_id=${sourceId}`, payload);
  } catch (err) {
    return errorHandler(err);
  }
}

export async function itemUpdateVimeoMeta(sourceId: number | string, itemId: number | string, payload: ItemVimeo, encryptionKey: string) {
  try {
    return await api.put(`${path}/${itemId}/vimeo-meta?source_id=${sourceId}&encryption_key=${encryptionKey}`, payload);
  } catch (err) {
    return errorHandler(err);
  }
}

export async function itemTagCreate(sourceId: number | string, itemId: number | string, payload: ItemTag) {
  try {
    return await api.post(`${path}/${itemId}/tags?source_id=${sourceId}`, payload);
  } catch (err) {
    return errorHandler(err);
  }
}

export async function itemTagDelete(sourceId: number | string, itemId: number | string, tagItemBucketId: number) {
  try {
    return await api.delete(`${path}/${itemId}/tags/${tagItemBucketId}?source_id=${sourceId}`);
  } catch (err) {
    return errorHandler(err);
  }
}

export async function itemLinkCreate(itemId: number | string, payload: ItemLink) {
  try {
    return await api.post(`${path}/${itemId}/links`, payload);
  } catch (err) {
    return errorHandler(err);
  }
}

export async function itemLinks(itemId: number | string) {
  try {
    return await api.get(`${path}/${itemId}/links`);
  } catch (err) {
    return errorHandler(err);
  }
}

export async function itemLinkUpdate(itemId: number | string, payload: ItemLink) {
  try {
    return await api.put(`${path}/${itemId}/links/${payload.id}`, payload);
  } catch (err) {
    return errorHandler(err);
  }
}

export async function itemLinkDelete(itemId: number | string, itemLinkId: number) {
  try {
    return await api.delete(`${path}/${itemId}/links/${itemLinkId}`);
  } catch (err) {
    return errorHandler(err);
  }
}

export async function saveItem(itemId: number | string) {
  try {
    return await api.post(`${path}/${itemId}/save`);
  } catch (err) {
    return errorHandler(err);
  }
}

export async function deleteSavedItem(itemId: number | string) {
  try {
    return await api.delete(`${path}/${itemId}/save`);
  } catch (err) {
    return errorHandler(err);
  }
}
