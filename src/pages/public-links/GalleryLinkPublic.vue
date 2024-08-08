<template>
  <ErrorNotFound v-if="notFound" />
  <div v-if="!notFound && data">
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
import ItemBucketThumb from 'src/pages/galleries/ItemBucketThumb.vue';
import ItemVimeoThumb from 'src/pages/galleries/ItemVimeoThumb.vue';
import ErrorNotFound from '../ErrorNotFound.vue';

export default defineComponent({
  components: { ItemVimeoThumb, ItemBucketThumb, ErrorNotFound },
  props: {
    link: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const notFound = ref(false);
    const title = ref('Gallery');
    // ^^ title is a required field for a gallery in the api
    const websiteTitle = computed(() => {
      const siteTitle = process.env.COMPANY_NAME;
      return (typeof siteTitle === 'string' && siteTitle) || null;
    });
    useMeta(() => ({
      title: websiteTitle.value ? `${websiteTitle.value} | ${title.value}` : title.value,
    }));
    const data = ref<Gallery>();

    async function fetchData() {
      const res = await galleryLinkDetail(props.link);
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
    };
  },
});
</script>
