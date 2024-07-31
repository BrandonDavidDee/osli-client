import { api } from 'src/boot/axios';
import { SearchPayload, Item } from 'src/models/item';
import errorHandler from './error-handler';

const prefix = `${process.env.API}/api/items/bucket`;

export async function itemBucketList(sourceS3Id: number | string, payload: SearchPayload) {
  try {
    return await api.post(`${prefix}?source_id=${sourceS3Id}`, payload);
  } catch (err) {
    return errorHandler(err);
  }
}

export async function itemBucketDetail(itemId: number | string) {
  try {
    return await api.get(`${prefix}/${itemId}`);
  } catch (err) {
    return errorHandler(err);
  }
}

export async function itemBucketUpdate(itemId: number | string, payload: Item) {
  try {
    return await api.put(`${prefix}/${itemId}`, payload);
  } catch (err) {
    return errorHandler(err);
  }
}
