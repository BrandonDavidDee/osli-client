<template>
  <div>
    <q-card
      flat
      square
      bordered
    >
      <q-card-section class="bg-grey-3 text-subtitle2">
        Individual Permissions
      </q-card-section>
      <q-card-actions align="right">
        <q-btn
          icon="add"
          size="sm"
          flat
          :disable="userDetail.is_admin"
        />
      </q-card-actions>
      <q-card-section>
        <div
          v-if="!userDetail.permissions.length"
          class="text-caption"
        >
          <div v-if="userDetail.is_admin">
            Permissions are not needed for admin users
          </div>
          <div v-else>
            No Permissions
          </div>
        </div>
      </q-card-section>
    </q-card>
  </div>
</template>

<script lang="ts">
import {
  defineComponent, PropType,
} from 'vue';
import { User } from 'src/models/user';

export default defineComponent({
  props: {
    userDetail: {
      type: Object as PropType<User>,
      required: true,
    },
  },
});
</script>
