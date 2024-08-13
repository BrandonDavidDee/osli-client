<template>
  <q-card
    square
    flat
    bordered
    class="q-ma-xs"
  >
    <div v-if="mediaUrl">
      <q-card-section
        v-if="itemType === 'image'"
        class="text-center"
      >
        <ImageDetail :src-url="mediaUrl" />
      </q-card-section>
      <q-card-section
        v-else-if="itemType === 'video'"
        class="text-center"
      >
        <VideoDetail :src-url="mediaUrl" />
      </q-card-section>
      <q-card-section
        v-else
        class="text-center"
      >
        <q-icon
          name="mdi-file-question"
          color="grey"
          size="4rem"
        />
      </q-card-section>
    </div>
  </q-card>
</template>

<script lang="ts">
import { defineComponent, PropType, computed } from 'vue';
import { ItemBucket } from 'src/models/item-bucket';
import ImageDetail from 'src/components/ImageDetail.vue';
import VideoDetail from 'src/components/VideoDetail.vue';
// TODO: add a download button ?

export default defineComponent({
  components: { ImageDetail, VideoDetail },
  props: {
    item: {
      type: Object as PropType<ItemBucket>,
      required: true,
    },
  },
  setup(props) {
    const unknown = 'unknown';
    const isImage = computed(() => {
      if (!props.item.mime_type) { return false; }
      return props.item.mime_type.includes('image');
    });
    const mediaUrl = computed(() => {
      if (!props.item.source.media_prefix) { return null; }
      return `${props.item.source.media_prefix}/${props.item.file_path}`;
    });
    const itemType = computed(() => {
      const mimeType = props.item.mime_type;

      if (!mimeType) { return unknown; }
      if (mimeType.includes('pdf')) { return 'pdf'; }
      try {
        const splits = mimeType.split('/');
        return splits[0];
      } catch (err) {
        return undefined;
      }
    });

    return {
      isImage,
      itemType,
      unknown,
      mediaUrl,
    };
  },
});
</script>
