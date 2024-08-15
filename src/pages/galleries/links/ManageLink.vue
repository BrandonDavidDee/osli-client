<template>
  <div>
    <q-card
      flat
      bordered
      square
      class="bg-grey-2"
    >
      <q-card-section class="text-subtitle2">
        Public Link
      </q-card-section>
      <q-separator />
      <q-card-section
        class="cursor-pointer"
        @click="copyLink(galleryLink.link)"
      >
        {{ galleryLink.link }}
      </q-card-section>
      <q-card-actions align="right">
        <q-btn
          label="Edit"
          size="sm"
          flat
          :disable="isDisabled"
          @click="dialog = true"
        />
      </q-card-actions>
    </q-card>
    <DialogMaster
      v-model="dialog"
      close-header
      size="small"
    >
      <template #content="{ closeDialog }">
        <q-form
          ref="form"
          @submit="onSubmit(closeDialog)"
        >
          <q-card-section v-if="existingLink">
            <q-banner class="bg-amber">
              That link is not available
            </q-banner>
          </q-card-section>
          <q-card-section>
            <q-input
              v-model="newLink"
              label="Check Link Availability"
              filled
              color="black"
              :loading="loading"
              :rules="[urlFriendlyStringRule]"
              @update:model-value="debouncedCheckAvailability"
            />
          </q-card-section>
          <q-separator />
          <q-card-actions align="right">
            <q-btn
              label="Cancel"
              flat
              @click="closeDialog"
            />
            <q-btn
              label="Use Link"
              color="green"
              :disable="existingLink"
              type="submit"
            />
          </q-card-actions>
        </q-form>
      </template>
    </DialogMaster>
  </div>
</template>

<script lang="ts">
import {
  defineComponent, PropType, ref, computed,
} from 'vue';
import { debounce } from 'quasar';
import { galleryLinkAvailability, galleryLinkUpdate } from 'src/api/galleries';
import { warningNotification } from 'src/services/notify';
import { urlFriendlyStringRule } from 'src/services/rules';
import { GalleryLink } from 'src/models/gallery';
import { copyLink } from 'src/services/utils';
import DialogMaster from 'src/components/DialogMaster.vue';

export default defineComponent({
  components: { DialogMaster },
  props: {
    galleryId: {
      type: [Number, String],
      required: true,
    },
    galleryLink: {
      type: Object as PropType<GalleryLink>,
      required: true,
    },
    userId: {
      type: Number as PropType<number | null>,
      required: true,
    },
  },
  emits: ['updated'],
  setup(props, { emit }) {
    const dialog = ref(false);
    const newLink = ref();
    const existingLink = ref(false);
    const loading = ref(false);
    const form = ref();

    const isDisabled = computed(() => {
      if (!props.galleryLink.created_by) { return true; }
      return props.galleryLink.created_by.id !== props.userId;
    });

    const debouncedCheckAvailability = debounce(async () => {
      if (form.value) {
        // Validate first so we don't do the check on an invalid string
        const isValid = await form.value.validate();
        if (isValid && newLink.value) {
          loading.value = true;
          const res = await galleryLinkAvailability(newLink.value);
          if (res) {
            existingLink.value = res.data;
          }
          loading.value = false;
        }
      }
    }, 500);

    async function onSubmit(closeDialog: () => void) {
      if (newLink.value) {
        const payload = JSON.parse(JSON.stringify(props.galleryLink));
        payload.link = newLink.value;
        const res = await galleryLinkUpdate(props.galleryId, payload, true);
        if (res && res.status === 200) {
          emit('updated', res.data);
          warningNotification('Link has been updated!');
        }
      }
      closeDialog();
    }

    return {
      copyLink,
      dialog,
      newLink,
      isDisabled,
      debouncedCheckAvailability,
      loading,
      existingLink,
      urlFriendlyStringRule,
      onSubmit,
      form,
    };
  },
});
</script>
