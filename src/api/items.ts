import { api } from 'src/boot/axios';
import { SearchPayload, Item } from 'src/models/item';
import errorHandler from './error-handler';

const prefix = `${process.env.API}/api/items/s3`;

export async function itemS3List(sourceS3Id: number | string, payload: SearchPayload) {
  try {
    return await api.post(`${prefix}?source_s3_id=${sourceS3Id}`, payload);
  } catch (err) {
    return errorHandler(err);
  }
}

export async function itemS3Detail(itemId: number | string) {
  try {
    return await api.get(`${prefix}/${itemId}`);
  } catch (err) {
    return errorHandler(err);
  }
}

export async function itemS3Update(itemId: number | string, payload: Item) {
  try {
    return await api.put(`${prefix}/${itemId}`, payload);
  } catch (err) {
    return errorHandler(err);
  }
}
