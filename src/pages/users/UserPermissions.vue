<template>
  <div>
    <div class="row">
      <div class="col q-pa-sm">
        <q-list
          v-if="userDetail.permission_groups"
          bordered
        >
          <q-item
            v-for="pg in userDetail.permission_groups"
            :key="pg.name"
          >
            <q-item-section>
              {{ pg.label }}
              <q-item-label caption>
                {{ pg.description }}
              </q-item-label>
            </q-item-section>
            <q-item-section side>
              <q-btn-group flat>
                <q-btn
                  size="sm"
                  flat
                  icon="visibility"
                  @click="selectGroup(pg)"
                />
                <q-btn
                  size="sm"
                  flat
                  icon="delete"
                />
              </q-btn-group>
            </q-item-section>
          </q-item>
        </q-list>
      </div>
    </div>
    <DialogMaster
      v-model="dialog"
      close-footer
      close-header
    >
      <template
        v-if="selectedGroup"
        #content
      >
        <q-card-section
          class="bg-grey-3 text-subtitle2"
        >
          {{ selectedGroup.label }}
        </q-card-section>
        <q-card-section class="text-caption">
          {{ selectedGroup.description }}
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
              v-for="p in selectedGroup.permissions"
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
      </template>
    </DialogMaster>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, ref } from 'vue';
import { User } from 'src/models/user';
import { PermissionGroup } from 'src/models/permission';
import DialogMaster from 'src/components/DialogMaster.vue';

export default defineComponent({
  components: { DialogMaster },
  props: {
    userDetail: {
      type: Object as PropType<User>,
      required: true,
    },
  },
  setup() {
    const dialog = ref(false);
    const selectedGroup = ref<PermissionGroup | null>(null);

    function selectGroup(v: PermissionGroup) {
      selectedGroup.value = v;
      dialog.value = true;
    }

    return {
      dialog,
      selectedGroup,
      selectGroup,
    };
  },
});
</script>
