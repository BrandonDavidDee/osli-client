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
    <DialogMaster
      v-model="dialog"
      close-header
      close-footer
    >
      <template #content>
        <q-card-actions align="right">
          <TagCreate
            :existing-tags="data"
            @new="onNewTag"
          />
        </q-card-actions>
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
      </template>
    </DialogMaster>
  </div>
</template>

<script lang="ts">
import {
  defineComponent, ref, watch, computed,
} from 'vue';
import { Tag } from 'src/models/tag';
import { tagList } from 'src/api/tags';
import { useSearchStore } from 'stores/search';
import DialogMaster from 'src/components/DialogMaster.vue';
import TagCreate from 'src/components/TagCreate.vue';

export default defineComponent({
  components: { DialogMaster, TagCreate },
  setup() {
    const store = useSearchStore();

    const data = ref<Tag[]>([]);
    const dialog = ref(false);
    const model = ref();

    async function fetchData() {
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
          fetchData();
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

    function onNewTag(value: Tag) {
      data.value.push(value);
    }

    return {
      model,
      data,
      selectedTags,
      dataFiltered,
      onSelected,
      getTagColor,
      onNewTag,
      selectedTagIds,
      label,
      dialog,
    };
  },
});
</script>
