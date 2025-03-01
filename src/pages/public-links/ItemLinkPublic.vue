<template>
  <ErrorNotFound
    v-if="notFound"
    public
  />
  <div v-if="!notFound && data">
    <div class="text-h6 q-ma-md text-grey-9">
      {{ data.title }}
    </div>
    <q-separator />
    <div class="q-pa-lg">
      <ImageDetail
        v-if="data.item_bucket && mediaUrl"
        :src-url="mediaUrl"
      />
      <VimeoPlayer
        v-if="data.item_vimeo"
        :video-id="data.item_vimeo.video_id"
        :width="data.item_vimeo.width"
        :height="data.item_vimeo.height"
      />
    </div>
  </div>
</template>

<script lang="ts">
import {
  defineComponent, ref, watch, computed,
} from 'vue';
import { useMeta } from 'quasar';
import { itemLinkDetail } from 'src/api/public-item-links';
import { ItemBucket } from 'src/models/item-bucket';
import { ItemVimeo } from 'src/models/item-vimeo';
import VimeoPlayer from 'src/components/VimeoPlayer.vue';
import ImageDetail from 'src/components/ImageDetail.vue';
import ErrorNotFound from '../ErrorNotFound.vue';

interface PublicItemLink {
  title: string | null;
  source_type: string;
  item_bucket: ItemBucket | null;
  item_vimeo: ItemVimeo | null;
}

export default defineComponent({
  components: { VimeoPlayer, ErrorNotFound, ImageDetail },
  props: {
    link: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const notFound = ref(false);
    const title = ref('Item');
    // TODO: ^^ title is NOT a required field for an item in the api, must accommodate
    const websiteTitle = computed(() => {
      const siteTitle = process.env.COMPANY_NAME;
      return (typeof siteTitle === 'string' && siteTitle) || null;
    });
    useMeta(() => ({
      title: websiteTitle.value ? `${websiteTitle.value} | ${title.value}` : title.value,
    }));
    const data = ref<PublicItemLink>();

    const mediaUrl = computed(() => {
      if (!data.value) { return null; }
      if (!data.value.item_bucket) { return null; }
      if (!data.value.item_bucket.source.media_prefix) { return null; }
      return `${data.value.item_bucket.source.media_prefix}/${data.value.item_bucket.file_path}`;
    });

    async function fetchData() {
      const res = await itemLinkDetail(props.link);
      if (res && res.data && res.status === 200) {
        notFound.value = false;
        data.value = res.data;
        if (data.value && data.value.title) {
          title.value = data.value.title;
        }
      } else {
        notFound.value = true;
      }
    }

    watch(
      () => props.link,
      () => fetchData(),
      { immediate: true },
    );

    return {
      data,
      notFound,
      mediaUrl,
    };
  },
});
</script>
