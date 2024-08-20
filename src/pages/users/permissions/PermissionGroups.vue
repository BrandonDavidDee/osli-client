<template>
  <div>
    <q-card
      flat
      square
      bordered
    >
      <q-card-section class="bg-grey-3 text-subtitle2">
        Permission Groups
      </q-card-section>
      <q-card-actions align="right">
        <q-btn
          icon="add"
          size="sm"
          flat
          :disable="userDetail.is_admin"
          @click="showAvailableGroups"
        />
      </q-card-actions>
      <q-card-section>
        <div
          v-if="!userDetail.permission_groups.length"
          class="text-caption"
        >
          <div v-if="userDetail.is_admin">
            Permission groups are not needed for admin users
          </div>
          <div v-else>
            No Permission Groups
          </div>
        </div>
        <q-list
          v-if="userDetail.permission_groups.length"
          bordered
        >
          <q-item
            v-for="pg in existingGroupsSorted"
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
                  @click="$emit('removeGroup', pg.name)"
                />
              </q-btn-group>
            </q-item-section>
          </q-item>
        </q-list>
      </q-card-section>
    </q-card>
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
    <DialogMaster
      v-model="dialogPermGroups"
      close-header
      close-footer
    >
      <template #content="{ closeDialog }">
        <q-card-section
          v-if="!groupsFiltered.length"
          class="text-caption"
        >
          No available permission groups.
        </q-card-section>
        <q-card-section v-if="groupsFiltered.length">
          <PermGroupDetail
            v-for="group in groupsFiltered"
            :key="group.name"
            :perm-group="group"
            @add="addGroupToUser(group, closeDialog)"
          />
        </q-card-section>
      </template>
    </DialogMaster>
  </div>
</template>

<script lang="ts">
import {
  defineComponent, PropType, ref, computed,
} from 'vue';
import { getPermissionGroups } from 'src/api/permissions';
import { PermissionGroup } from 'src/models/permission';
import { User } from 'src/models/user';
import DialogMaster from 'src/components/DialogMaster.vue';
import PermGroupDetail from './PermGroupDetail.vue';

export default defineComponent({
  components: { DialogMaster, PermGroupDetail },
  props: {
    userDetail: {
      type: Object as PropType<User>,
      required: true,
    },
  },
  emits: ['removeGroup', 'newGroup'],
  setup(props, { emit }) {
    const dialog = ref(false);
    const dialogPermGroups = ref(false);
    const selectedGroup = ref<PermissionGroup | null>(null);
    const dataGroups = ref<PermissionGroup[]>([]);

    const existingGroupsSorted = computed(() => {
      const userCopy = JSON.parse(JSON.stringify(props.userDetail));
      return userCopy.permission_groups.sort((a: PermissionGroup, b: PermissionGroup) => ((a.name > b.name) ? 1 : -1));
    });

    const groupsFiltered = computed(() => dataGroups.value.filter((group) => {
      const exists = props.userDetail.permission_groups.find((v) => v.name === group.name);
      return !exists ? group : null;
    }));

    function selectGroup(v: PermissionGroup) {
      selectedGroup.value = v;
      dialog.value = true;
    }

    async function fetchPermissionGroups() {
      const res = await getPermissionGroups();
      if (res && res.data) {
        dataGroups.value = res.data;
      }
    }

    function showAvailableGroups() {
      if (!dataGroups.value.length) {
        fetchPermissionGroups();
      }
      dialogPermGroups.value = true;
    }

    function addGroupToUser(group: PermissionGroup, closeDialog: () => void) {
      emit('newGroup', group.name);
      closeDialog();
    }

    return {
      dialog,
      existingGroupsSorted,
      dialogPermGroups,
      selectedGroup,
      selectGroup,
      dataGroups,
      showAvailableGroups,
      addGroupToUser,
      groupsFiltered,
    };
  },
});
</script>
