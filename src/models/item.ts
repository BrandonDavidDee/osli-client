import { Tag } from './tag';

export interface ItemTag {
  id: number;
  tag: Tag;
}

export interface SearchPayload {
  source: any;
  limit: number;
  offset: number;
  filter: string;
  tag_ids: any[];
}
