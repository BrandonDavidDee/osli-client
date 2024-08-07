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
          @click="showDialog"
        />
      </q-card-actions>
      <q-card-section
        v-if="!item.tags.length"
        class="text-caption text-grey-8"
      >
        No Tags
      </q-card-section>
      <q-card-section
        v-else
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
    </q-card>
    <q-dialog v-model="dialog">
      <q-card style="width: 800px; max-width: 80vw;">
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
        <q-card-actions align="right">
          <q-btn
            v-close-popup
            label="Close"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script lang="ts">
import {
  defineComponent, PropType, ref, computed,
} from 'vue';
import { ItemVimeo } from 'src/models/item-vimeo';
import { ItemTag } from 'src/models/item';
import { Tag } from 'src/models/tag';
import { tagList } from 'src/api/tags';
import { itemTagCreate, itemTagDelete } from 'src/api/item-vimeo';

export default defineComponent({
  props: {
    item: {
      type: Object as PropType<ItemVimeo>,
      required: true,
    },
  },
  emits: ['new', 'deleted'],
  setup(props, { emit }) {
    const model = ref();
    const data = ref<Tag[]>([]);
    const dialog = ref(false);

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

    async function deleteTag(value: ItemTag) {
      const res = await itemTagDelete(props.item.id, value.id);
      if (res && res.status === 200) {
        emit('deleted', value.id);
      }
    }

    return {
      dialog,
      dataFiltered,
      model,
      showDialog,
      getTagColor,
      isClickable,
      onSelected,
      tagsSorted,
      deleteTag,
    };
  },
});
</script>
