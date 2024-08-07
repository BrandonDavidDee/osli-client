import { Tag } from './tag';
import { User } from './user';

export interface ItemTag {
  id: number;
  tag: Tag;
}

export interface ItemLink {
  id: number;
  title: string | null;
  link: string;
  expiration_date: string | null;
  view_count: number;
  is_active: boolean;
  date_created: string | null;
  created_by: User | null;
}

export interface SearchPayload {
  source: any;
  limit: number;
  offset: number;
  filter: string;
  tag_ids: any[];
}
