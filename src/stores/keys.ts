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
    addKey(sourceId: number | string, sourceType: string, encryptionKey: string) {
      const needle = typeof sourceId === 'string' ? parseInt(sourceId, 10) : sourceId;
      const found = this.keys.find((v: StoredKey) => v.sourceId === needle && v.sourceType === sourceType);
      if (!found) {
        this.keys.push({ sourceId: needle, sourceType, encryptionKey });
      }
    },
    getKey(sourceId: number | string, sourceType: string) {
      const needle = typeof sourceId === 'string' ? parseInt(sourceId, 10) : sourceId;
      const found = this.keys.find((v: StoredKey) => v.sourceId === needle && v.sourceType === sourceType);
      if (found) {
        return found.encryptionKey;
      }
      return null;
    },
    removeKey(sourceId: number | string, sourceType: string) {
      const needle = typeof sourceId === 'string' ? parseInt(sourceId, 10) : sourceId;
      const found = this.keys.find((v: StoredKey) => v.sourceId === needle && v.sourceType === sourceType);
      if (found) {
        const idx = this.keys.indexOf(found);
        this.keys.splice(idx, 1);
      }
    },
  },
});
