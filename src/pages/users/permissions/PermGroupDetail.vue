<template>
  <q-card
    flat
    bordered
    square
    class="q-mb-sm"
  >
    <q-card-section class="bg-grey-3 text-subtitle2">
      {{ permGroup.label }}
    </q-card-section>
    <q-separator />
    <q-card-section>
      <q-list
        bordered
        separator
      >
        <q-item-label
          header
          class="bg-grey-3"
        >
          Included Permissions
        </q-item-label>
        <q-separator />
        <q-item
          v-for="p in permGroup.permissions"
          :key="p.name"
        >
          <q-item-section>
            <q-item-label>{{ p.description }}</q-item-label>
            <q-item-label caption>
              {{ p.name }}
            </q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-card-section>
    <q-card-actions align="right">
      <q-btn
        label="Add"
        size="sm"
        flat
        @click="$emit('add')"
      />
    </q-card-actions>
  </q-card>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { PermissionGroup } from 'src/models/permission';

export default defineComponent({
  props: {
    permGroup: {
      type: Object as PropType<PermissionGroup>,
      required: true,
    },
  },
  emits: ['add'],
});
</script>
