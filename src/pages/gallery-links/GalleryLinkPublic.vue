<template>
  <div v-if="data">
    <div class="text-h6 q-ma-md text-grey-9">
      {{ data.title }}
    </div>
    <q-separator />
    <div
      class="row"
    >
      <div
        v-for="item in data?.items"
        :key="item.id"
        class="col-xs-12 col-sm-6 col-md-4 col-lg-3 col-xl-2"
      >
        <q-card flat>
          <q-card-section>
            <ItemBucketThumb
              v-if="item.item_bucket"
              :item="item.item_bucket"
            />
            <ItemVimeoThumb
              v-if="item.item_vimeo"
              :item="item.item_vimeo"
            />
          </q-card-section>
        </q-card>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {
  defineComponent, ref, watch, computed,
} from 'vue';
import { useMeta } from 'quasar';
import { galleryLinkDetail } from 'src/api/gallery-links';
import { Gallery } from 'src/models/gallery';
import ItemBucketThumb from 'src/public-thumbs/ItemBucketThumb.vue';
import ItemVimeoThumb from 'src/public-thumbs/ItemVimeoThumb.vue';

export default defineComponent({
  components: { ItemVimeoThumb, ItemBucketThumb },
  props: {
    link: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const title = ref('Gallery');
    // ^^ title is a required field for a gallery in the api
    const websiteTitle = computed(() => {
      const siteTitle = process.env.SITE_TITLE;
      return (typeof siteTitle === 'string' && siteTitle) || null;
    });
    useMeta(() => ({
      title: websiteTitle.value ? `${websiteTitle.value} | ${title.value}` : title.value,
    }));
    const data = ref<Gallery>();

    async function fetchData() {
      const res = await galleryLinkDetail(props.link);
      if (res && res.data) {
        data.value = res.data;
        if (data.value && data.value.title) {
          title.value = data.value.title;
        }
      }
    }

    watch(
      () => props.link,
      () => fetchData(),
      { immediate: true },
    );

    return {
      data,
    };
  },
});
</script>
