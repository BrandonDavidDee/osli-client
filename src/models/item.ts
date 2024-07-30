import { Source } from './source-config';
import { Tag } from './tag';

interface ItemTag {
  id: number;
  tag: Tag;
}

export interface Item {
  id: number;
  mime_type: string;
  file_path: string;
  file_name: string;
  file_size: number;
  notes: string;
  date_created: string;
  created_by: string;
  source: Source;
  tags: ItemTag[];
}

export interface SearchPayload {
  source: any;
  limit: number;
  offset: number;
  filter: string;
  tag_ids: any[];
}
