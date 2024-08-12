import { defineStore } from 'pinia';
import { SourceBucket } from 'src/models/source-bucket';
import { SourceVimeo } from 'src/models/source-vimeo';
import { sourceListBucket } from 'src/api/source-bucket';
import { sourceListVimeo } from 'src/api/source-vimeo';

interface SourceState {
  bucketData: SourceBucket[];
  vimeoData: SourceVimeo[];
  bucketLoading: boolean;
  vimeoLoading: boolean;
}

export const useSourceStore = defineStore('sourceStore', {
  state: (): SourceState => ({
    bucketData: [],
    vimeoData: [],
    bucketLoading: false,
    vimeoLoading: false,
  }),
  actions: {
    async getBucketSources() {
      if (!this.bucketData.length) {
        this.bucketLoading = true;
        const res = await sourceListBucket();
        if (res && res.data) {
          this.bucketData = res.data;
        }
        this.bucketLoading = false;
      }
    },
    async getVimeoSources() {
      if (!this.vimeoData.length) {
        this.vimeoLoading = true;
        const res = await sourceListVimeo();
        if (res && res.data) {
          this.vimeoData = res.data;
        }
        this.vimeoLoading = false;
      }
    },
  },
});
