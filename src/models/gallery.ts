import { ItemBucket } from './item-bucket';
import { ItemVimeo } from './item-vimeo';
import { User } from './user';

interface GalleryItem {
  id: number;
  item_order: number;
  source_type: string;
  item_bucket: ItemBucket | null;
  item_vimeo: ItemVimeo | null;
}

export interface Gallery {
  id: number;
  title: string;
  description: string | null;
  date_created: string;
  items: GalleryItem[];
  created_by: User | null;
}
