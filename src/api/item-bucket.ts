import { api } from 'src/boot/axios';
import { SearchPayload, ItemTag, ItemLink } from 'src/models/item';
import { ItemBucket } from 'src/models/item-bucket';
import errorHandler from './error-handler';

const path = `${process.env.API}/api/items/bucket`;

export function getBatchUploadUrl(sourceId: number | string, encryptionKey: string) {
  return `${path}?source_id=${sourceId}&encryption_key=${encryptionKey}`;
}

export async function itemList(sourceId: number | string, payload: SearchPayload) {
  try {
    return await api.post(`${path}/search?source_id=${sourceId}`, payload);
  } catch (err) {
    return errorHandler(err, false);
  }
}

export async function itemDetail(itemId: number | string) {
  try {
    return await api.get(`${path}/${itemId}`);
  } catch (err) {
    return errorHandler(err);
  }
}

export async function itemUpdate(itemId: number | string, payload: ItemBucket) {
  try {
    return await api.put(`${path}/${itemId}`, payload);
  } catch (err) {
    return errorHandler(err);
  }
}

export async function itemDelete(encryptionKey: string, sourceId: number | string, payload: ItemBucket) {
  try {
    return await api.put(`${path}/${payload.id}/delete?source_id=${sourceId}&encryption_key=${encryptionKey}`, payload);
  } catch (err) {
    return errorHandler(err);
  }
}

export async function itemRelated(itemId: number | string) {
  try {
    return await api.get(`${path}/${itemId}/related`);
  } catch (err) {
    return errorHandler(err);
  }
}

export async function itemTagCreate(itemId: number | string, payload: ItemTag) {
  try {
    return await api.post(`${path}/${itemId}/tags`, payload);
  } catch (err) {
    return errorHandler(err);
  }
}

export async function itemTagDelete(itemId: number | string, tagItemBucketId: number) {
  try {
    return await api.delete(`${path}/${itemId}/tags/${tagItemBucketId}`);
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
