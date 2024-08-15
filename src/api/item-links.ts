import { api } from 'src/boot/axios';
import { ItemLink } from 'src/models/item';
import errorHandler from './error-handler';

const path = `${process.env.API}/api/items/item-links`;

export async function itemLinkAvailability(link: string) {
  try {
    return await api.get(`${path}/availability/${link}`);
  } catch (err) {
    return errorHandler(err);
  }
}

export async function itemLinkUpdate(payload: ItemLink) {
  try {
    return await api.put(`${path}/${payload.id}`, payload);
  } catch (err) {
    return errorHandler(err);
  }
}
