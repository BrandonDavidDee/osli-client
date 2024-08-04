<template>
  <div v-if="mediaUrl">
    <div
      v-if="itemType === 'image'"
      class="text-center cursor-pointer"
      @click="dialogImage = true"
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
      class="text-center cursor-pointer"
      @click="dialogVideo = true"
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

    <DialogMaster v-model="dialogImage">
      <template #content="{ closeDialog }">
        <q-card-section>
          <q-img
            :src="mediaUrl"
            loading="lazy"
          >
            <template #error>
              <div class="absolute-full flex flex-center bg-grey-8 text-white">
                Error
              </div>
            </template>
          </q-img>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn
            label="Close"
            flat
            @click="closeDialog"
          />
        </q-card-actions>
      </template>
    </DialogMaster>

    <DialogMaster v-model="dialogVideo">
      <template #content="{ closeDialog }">
        <q-card-section>
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
        </q-card-section>
        <q-card-actions align="right">
          <q-btn
            label="Close"
            flat
            @click="closeDialog"
          />
        </q-card-actions>
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

export default defineComponent({
  components: { DialogMaster },
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
