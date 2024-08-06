<template>
  <div>
    <q-uploader
      :url="url"
      :headers="[{name: 'Authorization', value: `Bearer ${accessToken}`}]"
      label="Batch upload"
      accept="image/*"
      multiple
      batch
      style="width: 100%;"
      :filter="enforceExtension"
      color="teal"
      square
      flat
      field-name="files"
      max-files="10"
      @rejected="onRejected"
      @uploaded="onUploaded"
    />
  </div>
</template>

<script>
import { defineComponent, computed, ref } from 'vue';
import { useAuthStore } from 'src/stores/auth';
import { warningNotification } from 'src/services/notify';
import { getBatchUploadUrl } from 'src/api/item-bucket';

export default defineComponent({
  props: {
    sourceId: {
      type: [Number, String],
      required: true,
    },
  },
  emits: ['uploaded'],
  setup(props, { emit }) {
    const store = useAuthStore();
    const accessToken = computed(() => store.accessToken);
    const encryptionKey = ref(''); // prompt user for this, then store in state
    const url = computed(() => getBatchUploadUrl(props.sourceId, encryptionKey.value));

    function enforceExtension(files) {
      return files.filter((file) => file.name.includes('.'));
    }

    function onRejected() {
      warningNotification('Only 10 files allowed, and they must have an extension');
    }

    function onUploaded() {
      emit('uploaded');
    }

    return {
      enforceExtension,
      url,
      accessToken,
      onRejected,
      onUploaded,
    };
  },
});
</script>
