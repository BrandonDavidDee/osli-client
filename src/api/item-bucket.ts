import { api } from 'src/boot/axios';
import { SearchPayload } from 'src/models/item';
import { ItemBucket } from 'src/models/item-bucket';
import errorHandler from './error-handler';

const path = `${process.env.API}/api/items/bucket`;

export async function itemList(sourceId: number | string, payload: SearchPayload) {
  try {
    return await api.post(`${path}?source_id=${sourceId}`, payload);
  } catch (err) {
    return errorHandler(err);
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
