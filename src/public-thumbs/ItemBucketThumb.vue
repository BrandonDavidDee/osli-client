<template>
  <div v-if="mediaUrl">
    <div
      v-if="itemType === 'image'"
      class="text-center"
    >
      <q-img
        :src="mediaUrl"
        loading="lazy"
        :ratio="1"
      >
        <template #error>
          <div class="absolute-full flex flex-center bg-grey-8 text-white">
            Error
          </div>
        </template>
      </q-img>
    </div>
    <div
      v-else-if="itemType === 'video'"
      class="text-center"
    >
      <video
        height="100%"
        width="100%"
        controls
      >
        <source
          :src="mediaUrl"
          type="video/mp4"
        >
        Your browser does not support the video tag.
      </video>
    </div>
    <div
      v-else
      class="text-center"
    >
      <q-icon
        name="mdi-file-question"
        color="grey"
        size="4rem"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, computed } from 'vue';
import { ItemBucket } from 'src/models/item-bucket';

export default defineComponent({
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
