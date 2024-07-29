<template>
  <Teleport to="body">
    <q-dialog
      v-model="localValue"
      :full-width="screen.lt.md || size === 'full'"
    >
      <q-card :style="cardStyle">
        <slot
          name="content"
          :close-dialog="closeDialog"
        >
          <q-card-section>Default Content</q-card-section>
        </slot>
      </q-card>
    </q-dialog>
  </Teleport>
</template>

<script lang="ts">
import {
  defineComponent, ref, computed, watch,
} from 'vue';
import { useQuasar } from 'quasar';

export default defineComponent({
  props: {
    modelValue: {
      type: Boolean,
      default: false,
    },
    size: {
      type: String,
      validator: (value: string) => ['large', 'small', 'full'].includes(value),
      default: 'large',
    },
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const showDialog = ref(true);
    const $q = useQuasar();
    const screen = computed(() => $q.screen);
    const localValue = ref(props.modelValue);

    watch(localValue, () => {
      emit('update:modelValue', localValue.value);
    });

    watch(() => props.modelValue, (newVal) => {
      localValue.value = newVal;
    });

    const cardStyle = computed(() => {
      if (screen.value.gt.sm && props.size === 'large') {
        return 'width: 800px; max-width: 80vw;';
      }
      if (screen.value.gt.sm && props.size === 'small') {
        return 'width: 500px; max-width: 50vw;';
      }
      return '';
    });
    const closeDialog = () => {
      localValue.value = false;
    };

    return {
      showDialog,
      screen,
      localValue,
      cardStyle,
      closeDialog,
    };
  },
});
</script>
