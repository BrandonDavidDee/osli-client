import { SourceVimeo } from './source-vimeo';
import { ItemTag, ItemLink } from './item';

export interface ItemVimeo {
  id: number;
  title: string | null;
  thumbnail: string | null;
  video_id: string;
  notes: string;
  date_created: string;
  created_by: string;
  source: SourceVimeo;
  tags: ItemTag[];
  links: ItemLink[];
}
