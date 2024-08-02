import { ItemBucket } from './item-bucket';
import { ItemVimeo } from './item-vimeo';

interface GalleryItem {
  id: number;
  item_order: number;
  item_bucket: ItemBucket | null;
  item_vimeo: ItemVimeo | null;
}

export interface Gallery {
  id: number;
  title: string;
  description: string | null;
  created_by: string;
  date_created: string;
  items: GalleryItem[];
}
