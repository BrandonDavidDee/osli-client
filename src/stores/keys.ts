import { defineStore } from 'pinia';

interface StoredKey {
  sourceId: number;
  sourceType: string;
  encryptionKey: string;
}

interface KeyState {
  keys: StoredKey[]
}

export const useKeyStore = defineStore('keyStore', {
  state: (): KeyState => ({
    keys: [],
  }),
  actions: {
    addKey(sourceId: number, sourceType: string, encryptionKey: string) {
      const found = this.keys.find((v: StoredKey) => v.sourceId === sourceId && v.sourceType === sourceType);
      if (!found) {
        this.keys.push({ sourceId, sourceType, encryptionKey });
      }
    },
    getKey(sourceId: number, sourceType: string) {
      const found = this.keys.find((v: StoredKey) => v.sourceId === sourceId && v.sourceType === sourceType);
      if (found) {
        return found.encryptionKey;
      }
      return null;
    },
    removeKey(sourceId: number, sourceType: string) {
      const found = this.keys.find((v: StoredKey) => v.sourceId === sourceId && v.sourceType === sourceType);
      if (found) {
        const idx = this.keys.indexOf(found);
        this.keys.splice(idx, 1);
      }
    },
  },
});
