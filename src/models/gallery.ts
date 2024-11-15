import { ItemBucket } from './item-bucket';
import { ItemVimeo } from './item-vimeo';
import { User } from './user';

export interface GalleryItem {
  id: number;
  item_order: number;
  source_type: string;
  item_bucket: ItemBucket | null;
  item_vimeo: ItemVimeo | null;
  date_created: string | null;
  source_id: number | null;
}

export interface GalleryLink {
  id: number;
  title: string | null;
  link: string;
  expiration_date: string | null;
  view_count: number;
  date_created: string | null;
  created_by: User | null;
  is_active: boolean;
}

export interface Gallery {
  id: number;
  title: string;
  description: string | null;
  date_created: string;
  created_by: User | null;
  items: GalleryItem[];
  links: GalleryLink[];
}
