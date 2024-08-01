import { api } from 'src/boot/axios';
import { SearchPayload } from 'src/models/item';
import { ItemVimeo } from 'src/models/item-vimeo';
import errorHandler from './error-handler';

const path = `${process.env.API}/api/items/vimeo`;

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

export async function itemUpdate(itemId: number | string, payload: ItemVimeo) {
  try {
    return await api.put(`${path}/${itemId}`, payload);
  } catch (err) {
    return errorHandler(err);
  }
}
