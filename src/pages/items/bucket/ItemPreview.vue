<template>
  <q-card
    square
    flat
    bordered
    class="q-ma-xs"
  >
    <q-card-section class="bg-grey-3 text-caption">
      <router-link :to="{ name: 'item-detail-bucket', params: { itemId: item.id }}">
        {{ item.file_name }}
      </router-link>
    </q-card-section>
    <div v-if="mediaUrl">
      <q-card-section
        v-if="itemType === 'image'"
        class="text-center"
      >
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
      <q-card-section
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
    <q-card-section class="text-caption text-grey-7">
      <q-badge color="blue">
        {{ itemType }}
      </q-badge>
    </q-card-section>
  </q-card>
</template>

<script lang="ts">
import { defineComponent, PropType, computed } from 'vue';
import { Item } from 'src/models/item';

export default defineComponent({
  props: {
    item: {
      type: Object as PropType<Item>,
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
