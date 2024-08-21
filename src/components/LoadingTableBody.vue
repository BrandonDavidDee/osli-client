<template>
  <tbody v-if="loading">
    <tr
      v-for="item in rows"
      :key="item"
    >
      <td
        v-for="tableData in columns"
        :key="tableData"
      >
        <q-skeleton type="text" />
      </td>
    </tr>
  </tbody>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  props: {
    loading: {
      type: Boolean,
      required: true,
    },
    columns: {
      type: Number,
      required: true,
    },
    rows: {
      type: Number,
      required: true,
    },
  },
});
</script>
