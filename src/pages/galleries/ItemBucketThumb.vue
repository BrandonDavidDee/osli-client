<template>
  <div v-if="mediaUrl">
    <div
      v-if="itemType === 'image'"
      class="text-center cursor-pointer"
      @click="dialogImage = true"
    >
      <ImageDetail
        :src-url="mediaUrl"
        :ratio="1"
      />
    </div>
    <div
      v-else-if="itemType === 'video'"
      class="text-center cursor-pointer"
      @click="dialogVideo = true"
    >
      <VideoDetail :src-url="mediaUrl" />
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

    <DialogMaster
      v-model="dialogImage"
      close-header
      close-footer
    >
      <template #content>
        <q-card-section>
          <ImageDetail :src-url="mediaUrl" />
        </q-card-section>
      </template>
    </DialogMaster>

    <DialogMaster
      v-model="dialogVideo"
      close-header
      close-footer
    >
      <template #content>
        <q-card-section>
          <VideoDetail :src-url="mediaUrl" />
        </q-card-section>
      </template>
    </DialogMaster>
  </div>
</template>

<script lang="ts">
import {
  defineComponent, PropType, computed, ref,
} from 'vue';
import { ItemBucket } from 'src/models/item-bucket';
import DialogMaster from 'src/components/DialogMaster.vue';
import ImageDetail from 'src/components/ImageDetail.vue';
import VideoDetail from 'src/components/VideoDetail.vue';

export default defineComponent({
  components: { DialogMaster, ImageDetail, VideoDetail },
  props: {
    item: {
      type: Object as PropType<ItemBucket>,
      required: true,
    },
  },
  setup(props) {
    const dialogImage = ref(false);
    const dialogVideo = ref(false);

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
      const filePath = props.item.file_path;

      if (!mimeType) { return unknown; }
      if (filePath.includes('HEIC')) { return unknown; }
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
      dialogImage,
      dialogVideo,
    };
  },
});
</script>
