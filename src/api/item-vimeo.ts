import { api } from 'src/boot/axios';
import { SearchPayload } from 'src/models/item';
import errorHandler from './error-handler';

const path = `${process.env.API}/api/items/vimeo`;

export async function itemList(sourceId: number | string, payload: SearchPayload) {
  try {
    return await api.post(`${path}?source_id=${sourceId}`, payload);
  } catch (err) {
    return errorHandler(err);
  }
}
