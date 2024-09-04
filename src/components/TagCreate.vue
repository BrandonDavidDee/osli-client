<template>
  <div>
    <q-btn
      label="New Tag"
      size="sm"
      flat
      @click="dialog = true"
    />
    <DialogMaster
      v-model="dialog"
      close-header
      size="small"
    >
      <template #content="{ closeDialog }">
        <q-form
          ref="form"
          @click="onSubmit"
        >
          <q-card-section>
            <q-input
              v-model="model"
              filled
              color="black"
              :rules="[v => !!v || 'Required', checkExistingTag, checkNoWhitespace]"
              :disable="loading"
            />
          </q-card-section>
          <q-card-actions align="right">
            <q-btn
              label="Cancel"
              flat
              :disable="loading"
              @click="closeDialog"
            />
            <q-btn
              label="Save"
              type="submit"
              color="green"
              :loading="loading"
            />
          </q-card-actions>
        </q-form>
      </template>
    </DialogMaster>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, ref } from 'vue';
import { Tag } from 'src/models/tag';
import { tagCreate } from 'src/api/tags';
import { positiveNotification } from 'src/services/notify';
import DialogMaster from './DialogMaster.vue';

export default defineComponent({
  components: { DialogMaster },
  props: {
    existingTags: {
      type: Array as PropType<Tag[]>,
      required: true,
    },
  },
  emits: ['new'],
  setup(props, { emit }) {
    const dialog = ref(false);
    const model = ref('');
    const form = ref();
    const loading = ref(false);

    const checkExistingTag = (value: string) => {
      const isDuplicate = props.existingTags.some((tag) => tag.title === value);
      return !isDuplicate || 'This tag already exists';
    };

    const checkNoWhitespace = (value: string) => value === value.trim() || 'No leading or trailing whitespace allowed';
    // ^^ This is to prevent people from bypassing duplicate detection

    async function onSubmit() {
      if (model.value) {
        loading.value = true;
        const payload = { id: 0, title: model.value };
        const res = await tagCreate(payload);
        if (res && res.status === 200 && res.data) {
          positiveNotification(`${model.value} added`);
          emit('new', res.data);
        }
        loading.value = false;
        dialog.value = false;
      }
    }

    return {
      dialog,
      form,
      loading,
      model,
      onSubmit,
      checkNoWhitespace,
      checkExistingTag,
    };
  },
});
</script>
