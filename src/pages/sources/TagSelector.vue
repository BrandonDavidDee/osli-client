<template>
  <div class="q-pa-xs">
    <q-chip
      :color="selectedTagIds.length ? 'teal' : 'grey'"
      text-color="white"
      clickable
      @click="dialog = true"
    >
      {{ label }}
    </q-chip>
    <q-dialog v-model="dialog">
      <q-card>
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
            :color="getTagColor(t)"
            text-color="white"
            clickable
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
  defineComponent, ref, watch, computed,
} from 'vue';
import { Tag } from 'src/models/tag';
import { tagList } from 'src/api/tags';
import { useSearchStore } from 'stores/search';

export default defineComponent({
  setup() {
    const model = ref();
    const data = ref<Tag[]>([]);
    const dialog = ref(false);
    const store = useSearchStore();

    async function fetchTags() {
      const res = await tagList();
      if (res && res.data) {
        data.value = res.data;
      }
    }

    const selectedTags = computed(() => store.selectedTags);
    const selectedTagIds = computed(() => store.selectedTagIds);
    const label = computed(() => {
      const len = selectedTags.value.length;
      if (len === 0) {
        return 'No Tag Selected';
      }
      if (len === 1) {
        const last = selectedTags.value[0];
        return last.title;
      }
      return `${len} Tags Selected`;
    });

    const dataFiltered = computed(() => {
      const needle = model.value ? model.value.toLowerCase() : '';
      const filtered = data.value.filter((item) => item.title.toLowerCase().includes(needle));
      return filtered.sort((a, b) => ((a.title > b.title) ? 1 : -1));
    });

    watch(
      dialog,
      (val) => {
        if (val && !data.value.length) {
          fetchTags();
        }
      },
    );

    function onSelected(value: Tag) {
      const isSelected = selectedTags.value.find((v) => v.id === value.id);
      if (isSelected) {
        store.removeTag(value);
      } else {
        store.addTag(value);
      }
    }

    function getTagColor(value: Tag) {
      const isSelected = selectedTags.value.find((v) => v.id === value.id);
      return isSelected ? 'grey' : 'teal';
    }

    return {
      model,
      data,
      selectedTags,
      dataFiltered,
      onSelected,
      getTagColor,
      selectedTagIds,
      label,
      dialog,
    };
  },
});
</script>
