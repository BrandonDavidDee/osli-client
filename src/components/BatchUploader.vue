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
      @failed="onFailure"
    />
  </div>
</template>

<script>
import { defineComponent, computed } from 'vue';
import { useAuthStore } from 'src/stores/auth';
import { warningNotification, negativeNotification } from 'src/services/notify';
import { getBatchUploadUrl } from 'src/api/item-bucket';

export default defineComponent({
  props: {
    encryptionKey: {
      type: String,
      required: true,
    },
    sourceId: {
      type: [Number, String],
      required: true,
    },
  },
  emits: ['uploaded', 'error'],
  setup(props, { emit }) {
    const store = useAuthStore();
    const accessToken = computed(() => store.accessToken);
    const url = computed(() => getBatchUploadUrl(props.sourceId, props.encryptionKey));

    function enforceExtension(files) {
      return files.filter((file) => file.name.includes('.'));
    }

    function onRejected() {
      warningNotification('Only 10 files allowed, and they must have an extension');
    }

    function onUploaded() {
      emit('uploaded');
    }

    function onFailure(e) {
      let msg = 'Error!';
      try {
        const response = JSON.parse(e.xhr.response);
        msg = response.detail;
      } catch (err) {
        msg = 'Error Uploading!';
      }
      negativeNotification(msg);
      emit('error');
    }

    return {
      enforceExtension,
      url,
      accessToken,
      onRejected,
      onUploaded,
      onFailure,
    };
  },
});
</script>
