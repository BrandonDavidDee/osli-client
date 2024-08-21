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
          @click="showDialog"
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
        <div v-else>
          <q-list
            bordered
          >
            <q-item
              v-for="perm in userDetail.permissions"
              :key="perm.name"
            >
              <q-item-section>
                {{ perm.description }}
                <q-item-label
                  v-show="perm.source_id"
                  caption
                >
                  For Source ID {{ perm.source_id }}
                </q-item-label>
              </q-item-section>
              <q-item-section side>
                <q-btn-group flat>
                  <q-btn
                    size="sm"
                    flat
                    icon="delete"
                    @click="removePermission(perm)"
                  />
                </q-btn-group>
              </q-item-section>
            </q-item>
          </q-list>
        </div>
      </q-card-section>
    </q-card>
    <DialogMaster
      v-model="dialog"
      close-footer
      close-header
    >
      <template #content="{ closeDialog }">
        <q-card-section>
          <q-card
            v-for="bs in dataBuckets"
            :key="bs.id"
            flat
            square
            bordered
          >
            <q-card-section class="bg-grey-3 text-subtitle2">
              {{ bs.title }}
            </q-card-section>
            <q-card-section>
              <q-list
                bordered
                separator
              >
                <q-item-label
                  header
                  class="bg-grey-3"
                >
                  Available Permissions
                </q-item-label>
                <q-separator />
                <q-item
                  v-for="p in data.bucket"
                  :key="p.name"
                >
                  <q-item-section>
                    <q-item-label>{{ p.description }}</q-item-label>
                    <q-item-label caption>
                      {{ p.name }}
                    </q-item-label>
                  </q-item-section>
                  <q-item-section side>
                    <q-btn-group flat>
                      <q-btn
                        size="sm"
                        flat
                        label="Add"
                        :disable="isDisabled(bs.id, p)"
                        @click="addPermission(bs.id, p, closeDialog)"
                      />
                    </q-btn-group>
                  </q-item-section>
                </q-item>
              </q-list>
            </q-card-section>
          </q-card>
        </q-card-section>
        <q-card-section>
          <q-card
            v-for="vim in dataVimeo"
            :key="vim.id"
            flat
            square
            bordered
          >
            <q-card-section class="bg-grey-3 text-subtitle2">
              {{ vim.title }}
            </q-card-section>
            <q-card-section>
              <q-list
                bordered
                separator
              >
                <q-item-label
                  header
                  class="bg-grey-3"
                >
                  Available Permissions
                </q-item-label>
                <q-separator />
                <q-item
                  v-for="p in data.vimeo"
                  :key="p.name"
                >
                  <q-item-section>
                    <q-item-label>{{ p.description }}</q-item-label>
                    <q-item-label caption>
                      {{ p.name }}
                    </q-item-label>
                  </q-item-section>
                  <q-item-section side>
                    <q-btn-group flat>
                      <q-btn
                        size="sm"
                        flat
                        label="Add"
                        :disable="isDisabled(vim.id, p)"
                        @click="addPermission(vim.id, p, closeDialog)"
                      />
                    </q-btn-group>
                  </q-item-section>
                </q-item>
              </q-list>
            </q-card-section>
          </q-card>
        </q-card-section>
        <q-card-section>
          <q-card
            flat
            square
            bordered
          >
            <q-card-section class="bg-grey-3 text-subtitle2">
              Miscellaneous
            </q-card-section>
            <q-card-section>
              <q-list
                bordered
                separator
              >
                <q-item-label
                  header
                  class="bg-grey-3"
                >
                  Available Permissions
                </q-item-label>
                <q-separator />
                <q-item
                  v-for="p in data.miscellaneous"
                  :key="p.name"
                >
                  <q-item-section>
                    <q-item-label>{{ p.description }}</q-item-label>
                    <q-item-label caption>
                      {{ p.name }}
                    </q-item-label>
                  </q-item-section>
                  <q-item-section side>
                    <q-btn-group flat>
                      <q-btn
                        size="sm"
                        flat
                        label="Add"
                        :disable="isDisabled(null, p)"
                        @click="addPermission(null, p, closeDialog)"
                      />
                    </q-btn-group>
                  </q-item-section>
                </q-item>
              </q-list>
            </q-card-section>
          </q-card>
        </q-card-section>
      </template>
    </DialogMaster>
  </div>
</template>

<script lang="ts">
import {
  defineComponent, PropType, ref, computed,
} from 'vue';
import { useSourceStore } from 'src/stores/sources';
import { getIndividualPermissions } from 'src/api/permissions';
import { Permission } from 'src/models/permission';
import { User } from 'src/models/user';
import DialogMaster from 'src/components/DialogMaster.vue';

interface IndividualPermsData {
  bucket: Permission[];
  vimeo: Permission[];
  miscellaneous: Permission[];
}

export default defineComponent({
  components: { DialogMaster },
  props: {
    userDetail: {
      type: Object as PropType<User>,
      required: true,
    },
  },
  emits: ['newScope', 'removeScope'],
  setup(props, { emit }) {
    const store = useSourceStore();
    const dialog = ref(false);

    const data = ref<IndividualPermsData>({
      bucket: [],
      vimeo: [],
      miscellaneous: [],
    });

    const dataBuckets = computed(() => store.bucketData);
    const dataVimeo = computed(() => store.vimeoData);

    async function fetchData() {
      const res = await getIndividualPermissions();
      if (res && res.data) {
        data.value = res.data;
      }
    }

    async function showDialog() {
      await store.getBucketSources();
      await store.getVimeoSources();
      await fetchData();
      dialog.value = true;
    }

    function replaceSourceId(sourceId: number, permissionName: string) {
      return permissionName.replace('{source_id}', sourceId.toString());
    }

    function isDisabled(sourceId: number | null, permission: Permission) {
      let scopeName = permission.name;
      if (sourceId) {
        scopeName = replaceSourceId(sourceId, permission.name);
      }
      return props.userDetail.scopes.includes(scopeName);
    }

    function addPermission(sourceId: number | null, permission: Permission, closeDialog: () => void) {
      let scopeName = permission.name;
      if (sourceId) {
        scopeName = replaceSourceId(sourceId, permission.name);
      }
      emit('newScope', scopeName);
      closeDialog();
    }

    function removePermission(permission: Permission) {
      let scopeName = permission.name;
      if (permission.source_id) {
        scopeName = replaceSourceId(permission.source_id, permission.name);
      }
      emit('removeScope', scopeName);
    }

    return {
      data,
      dialog,
      dataBuckets,
      dataVimeo,
      showDialog,
      addPermission,
      removePermission,
      isDisabled,
    };
  },
});
</script>
