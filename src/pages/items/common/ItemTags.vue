<template>
  <div>
    <q-card
      flat
      square
      bordered
    >
      <q-card-actions
        align="right"
        class="q-pb-none"
      >
        <q-btn
          icon="add"
          size="sm"
          flat
          :disable="loading"
          @click="showDialog"
        />
      </q-card-actions>
      <q-card-section v-if="loading">
        <q-skeleton type="text" />
      </q-card-section>
      <q-card-section
        v-else-if="!loading && item.tags.length"
        class="q-pt-none"
      >
        <q-chip
          v-for="itemTag in tagsSorted"
          :key="itemTag.id"
          color="teal"
          text-color="white"
          removable
          @remove="deleteTag(itemTag)"
        >
          {{ itemTag.tag.title }}
        </q-chip>
      </q-card-section>
      <q-card-section
        v-else
        class="text-caption text-grey-8"
      >
        No Tags
      </q-card-section>
    </q-card>
    <DialogMaster
      v-model="dialog"
      close-header
      close-footer
    >
      <template #content>
        <q-card-section>
          <q-input
            v-model="model"
            dense
            outlined
            square
            color="black"
            label="Filter Tags"
            class="q-mb-sm"
          />
          <q-chip
            v-for="(t, index) in dataFiltered"
            :key="index"
            text-color="white"
            :clickable="isClickable(t)"
            :color="getTagColor(t)"
            @click="onSelected(t)"
          >
            {{ t.title }}
          </q-chip>
        </q-card-section>
        <q-separator />
      </template>
    </DialogMaster>
  </div>
</template>

<script lang="ts">
import {
  defineComponent, PropType, ref, computed,
} from 'vue';
import {
  itemTagCreate as itemTagCreateBucket,
  itemTagDelete as itemTagDeleteBucket,
} from 'src/api/item-bucket';
import {
  itemTagCreate as itemTagCreateVimeo,
  itemTagDelete as itemTagDeleteVimeo,
} from 'src/api/item-vimeo';
import { tagList } from 'src/api/tags';
import { ItemBucket } from 'src/models/item-bucket';
import { ItemTag } from 'src/models/item';
import { ItemVimeo } from 'src/models/item-vimeo';
import { Tag } from 'src/models/tag';
import DialogMaster from 'src/components/DialogMaster.vue';

export default defineComponent({
  components: { DialogMaster },
  props: {
    loading: {
      type: Boolean,
      required: true,
    },
    sourceId: {
      type: Number,
      required: true,
    },
    item: {
      type: Object as PropType<ItemBucket | ItemVimeo>,
      required: true,
    },
    sourceType: {
      type: String,
      validator: (value: string) => ['bucket', 'vimeo'].includes(value),
      required: true,
    },
  },
  emits: ['new', 'deleted'],
  setup(props, { emit }) {
    const data = ref<Tag[]>([]);
    const dialog = ref(false);
    const model = ref();

    const tagsSorted = computed(() => {
      const copy = JSON.parse(JSON.stringify(props.item.tags));
      return copy.sort((a: ItemTag, b: ItemTag) => ((a.tag.title > b.tag.title) ? 1 : -1));
    });

    const dataFiltered = computed(() => {
      const needle = model.value ? model.value.toLowerCase() : '';
      const filtered = data.value.filter((item) => item.title.toLowerCase().includes(needle));
      return filtered.sort((a, b) => ((a.title > b.title) ? 1 : -1));
    });

    const selectedTagIds = computed(() => props.item.tags.map((v) => v.tag.id));

    function isClickable(value: Tag) {
      return !selectedTagIds.value.includes(value.id);
    }

    function getTagColor(value: Tag) {
      const isSelected = selectedTagIds.value.includes(value.id);
      return isSelected ? 'grey' : 'teal';
    }

    async function fetchTags() {
      const res = await tagList();
      if (res && res.data) {
        data.value = res.data;
      }
    }
    function showDialog() {
      if (!data.value.length) {
        fetchTags();
      }
      dialog.value = true;
    }

    async function itemTagCreate(itemId: number, payload: ItemTag) {
      if (props.sourceType === 'bucket') {
        return itemTagCreateBucket(props.sourceId, itemId, payload);
      }
      if (props.sourceType === 'vimeo') {
        return itemTagCreateVimeo(props.sourceId, itemId, payload);
      }
      throw new Error(`Unknown sourceType: ${props.sourceType}`);
    }

    async function onSelected(value: Tag) {
      const payload: ItemTag = {
        id: 0,
        tag: value,
      };
      const res = await itemTagCreate(props.item.id, payload);
      if (res && res.data && res.status === 200) {
        emit('new', res.data);
      }
    }

    async function itemTagDelete(itemId: number, itemTagId: number) {
      if (props.sourceType === 'bucket') {
        return itemTagDeleteBucket(props.sourceId, itemId, itemTagId);
      }
      if (props.sourceType === 'vimeo') {
        return itemTagDeleteVimeo(props.sourceId, itemId, itemTagId);
      }
      throw new Error(`Unknown sourceType: ${props.sourceType}`);
    }

    async function deleteTag(value: ItemTag) {
      const res = await itemTagDelete(props.item.id, value.id);
      if (res && res.status === 200) {
        emit('deleted', value.id);
      }
    }

    return {
      dataFiltered,
      deleteTag,
      dialog,
      getTagColor,
      isClickable,
      model,
      onSelected,
      showDialog,
      tagsSorted,
    };
  },
});
</script>
