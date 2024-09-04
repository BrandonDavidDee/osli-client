import { AxiosResponse } from 'axios';
import { api } from 'src/boot/axios';
import { Tag } from 'src/models/tag';
import errorHandler from './error-handler';

const prefix = `${process.env.API}/api/tags`;

export async function tagCreate(payload: Tag) {
  try {
    return await api.post(prefix, payload);
  } catch (err) {
    return errorHandler(err);
  }
}

export async function tagList(): Promise<AxiosResponse | undefined> {
  try {
    return await api.get(prefix);
  } catch (err) {
    return errorHandler(err);
  }
}

export async function tagUpdate(payload: Tag) {
  try {
    return await api.put(`${prefix}/${payload.id}`, payload);
  } catch (err) {
    return errorHandler(err);
  }
}

export async function tagDelete(tagId: number) {
  try {
    return await api.delete(`${prefix}/${tagId}`);
  } catch (err) {
    return errorHandler(err);
  }
}

export async function tagRelated(tagId: number) {
  try {
    return await api.get(`${prefix}/${tagId}/related`);
  } catch (err) {
    return errorHandler(err);
  }
}
