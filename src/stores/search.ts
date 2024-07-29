import { defineStore } from 'pinia';
import { Tag } from 'src/models/tag';

interface SearchState {
  page: number
  filter: string
  tags: Tag[]
  view: string,
}

export const useSearchStore = defineStore('search', {
  state: (): SearchState => ({
    page: 1,
    filter: '',
    tags: [],
    view: 'grid',
  }),
  getters: {
    selectedTags: (state) => state.tags.sort((a, b) => ((a.title > b.title) ? 1 : -1)),
    selectedTagIds: (state) => state.tags.map((v) => v.id),
  },
  actions: {
    addTag(tag: Tag) {
      this.tags.push(tag);
    },
    removeTag(tag: Tag) {
      const found = this.tags.find((v) => v.id === tag.id);
      if (found) {
        const idx = this.tags.indexOf(found);
        this.tags.splice(idx, 1);
      }
    },
  },
});
