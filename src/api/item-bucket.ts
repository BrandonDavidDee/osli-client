import { api } from 'src/boot/axios';
import { SearchPayload, ItemTag, ItemLink } from 'src/models/item';
import { ItemBucket } from 'src/models/item-bucket';
import errorHandler from './error-handler';

const path = `${process.env.API}/api/items/bucket`;

export function getBatchUploadUrl(sourceId: number, encryptionKey: string) {
  return `${path}?source_id=${sourceId}&encryption_key=${encryptionKey}`;
}

export async function itemList(sourceId: number, payload: SearchPayload) {
  try {
    return await api.post(`${path}/search?source_id=${sourceId}`, payload);
  } catch (err) {
    return errorHandler(err, false);
  }
}

export async function itemDetail(sourceId: number, itemId: number) {
  try {
    return await api.get(`${path}/${itemId}?source_id=${sourceId}`);
  } catch (err) {
    return errorHandler(err, false);
  }
}

export async function itemUpdate(sourceId: number, itemId: number, payload: ItemBucket) {
  try {
    return await api.put(`${path}/${itemId}?source_id=${sourceId}`, payload);
  } catch (err) {
    return errorHandler(err);
  }
}

export async function itemDelete(encryptionKey: string, sourceId: number, payload: ItemBucket) {
  try {
    return await api.put(`${path}/${payload.id}/delete?source_id=${sourceId}&encryption_key=${encryptionKey}`, payload);
  } catch (err) {
    return errorHandler(err);
  }
}

export async function itemRelated(sourceId: number, itemId: number) {
  try {
    return await api.get(`${path}/${itemId}/related?source_id=${sourceId}`);
  } catch (err) {
    return errorHandler(err);
  }
}

export async function itemTagCreate(sourceId: number, itemId: number, payload: ItemTag) {
  try {
    return await api.post(`${path}/${itemId}/tags?source_id=${sourceId}`, payload);
  } catch (err) {
    return errorHandler(err);
  }
}

export async function itemTagDelete(sourceId: number, itemId: number, tagItemBucketId: number) {
  try {
    return await api.delete(`${path}/${itemId}/tags/${tagItemBucketId}?source_id=${sourceId}`);
  } catch (err) {
    return errorHandler(err);
  }
}

export async function itemLinkCreate(itemId: number, payload: ItemLink) {
  try {
    return await api.post(`${path}/${itemId}/links`, payload);
  } catch (err) {
    return errorHandler(err);
  }
}

export async function itemLinks(itemId: number) {
  try {
    return await api.get(`${path}/${itemId}/links`);
  } catch (err) {
    return errorHandler(err);
  }
}

export async function itemLinkUpdate(itemId: number, payload: ItemLink) {
  try {
    return await api.put(`${path}/${itemId}/links/${payload.id}`, payload);
  } catch (err) {
    return errorHandler(err);
  }
}

export async function itemLinkDelete(itemId: number, itemLinkId: number) {
  try {
    return await api.delete(`${path}/${itemId}/links/${itemLinkId}`);
  } catch (err) {
    return errorHandler(err);
  }
}

export async function saveItem(itemId: number) {
  try {
    return await api.post(`${path}/${itemId}/save`);
  } catch (err) {
    return errorHandler(err);
  }
}

export async function deleteSavedItem(itemId: number) {
  try {
    return await api.delete(`${path}/${itemId}/save`);
  } catch (err) {
    return errorHandler(err);
  }
}
