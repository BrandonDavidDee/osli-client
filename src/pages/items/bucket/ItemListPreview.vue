<template>
  <q-card
    square
    flat
    bordered
    class="q-ma-xs"
  >
    <q-card-section
      :class="item.title ? 'bg-grey-3 q-pb-xs q-pt-xs' : 'bg-grey-3'"
    >
      <div v-if="useRouter">
        <router-link :to="{ name: 'item-detail-bucket', params: { itemId: item.id }}">
          <div
            v-if="item.title"
            class="text-overline"
          >
            {{ item.title }}
          </div>
          <div class="text-caption">
            {{ item.file_name }}
          </div>
        </router-link>
      </div>
      <div
        v-else
        @click="itemSelect(item.id)"
      >
        <div
          v-if="item.title"
          class="text-overline"
        >
          {{ item.title }}
        </div>
        <div class="text-caption">
          {{ item.file_name }}
        </div>
      </div>
    </q-card-section>
    <div v-if="mediaUrl">
      <q-card-section
        v-if="itemType === 'image'"
        class="text-center cursor-pointer"
        @click="itemSelect(item.id)"
      >
        <ImageDetail :src-url="mediaUrl" />
      </q-card-section>
      <q-card-section
        v-else-if="itemType === 'video'"
        class="text-center cursor-pointer"
        @click="itemSelect(item.id)"
      >
        <VideoDetail :src-url="mediaUrl" />
      </q-card-section>
      <q-card-section
        v-else
        class="text-center cursor-pointer"
        @click="itemSelect(item.id)"
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
import { ItemBucket } from 'src/models/item-bucket';
import { useRouter } from 'vue-router';
import ImageDetail from 'src/components/ImageDetail.vue';
import VideoDetail from 'src/components/VideoDetail.vue';

export default defineComponent({
  components: { ImageDetail, VideoDetail },
  props: {
    item: {
      type: Object as PropType<ItemBucket>,
      required: true,
    },
    useRouter: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['selected'],
  setup(props, { emit }) {
    const router = useRouter();

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

    function itemSelect(itemId: number) {
      if (props.useRouter) {
        router.push({ name: 'item-detail-bucket', params: { itemId } });
      } else {
        emit('selected', itemId);
      }
    }
    return {
      isImage,
      itemType,
      unknown,
      mediaUrl,
      itemSelect,
    };
  },
});
</script>
