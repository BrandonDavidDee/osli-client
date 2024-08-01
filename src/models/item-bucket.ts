import { SourceBucket } from './source-bucket';
import { ItemTag } from './item';

export interface ItemBucket {
  id: number;
  title: string | null;
  mime_type: string;
  file_path: string;
  file_name: string;
  file_size: number;
  notes: string;
  date_created: string;
  created_by: string;
  source: SourceBucket;
  tags: ItemTag[];
}
