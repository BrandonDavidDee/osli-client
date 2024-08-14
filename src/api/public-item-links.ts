import { api } from 'src/boot/axios';
import errorHandler from './error-handler';

const path = `${process.env.API}/api/public/item`;

export async function itemLinkDetail(link: string) {
  try {
    return await api.get(`${path}/${link}`);
  } catch (err) {
    return errorHandler(err);
  }
}
