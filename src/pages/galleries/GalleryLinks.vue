<template>
  <div>
    <q-toolbar class="bg-grey-9 text-white">
      <q-btn
        dense
        icon="arrow_back"
        color="white"
        text-color="black"
        size="sm"
        :to="{name: 'gallery-detail', params: { galleryId }}"
      />
      <q-toolbar-title>
        Gallery Links: {{ data?.title }}
      </q-toolbar-title>
    </q-toolbar>
    <div class="q-pa-md">
      <q-markup-table
        flat
        square
        bordered
        dense
      >
        <thead>
          <tr>
            <th
              class="text-right"
              colspan="6"
            >
              <q-btn
                icon="add"
                size="sm"
                flat
                @click="newLink"
              />
            </th>
          </tr>
          <tr>
            <th class="text-left">
              Status
            </th>
            <th class="text-left">
              Title
            </th>
            <th class="text-left">
              Expires On
            </th>
            <th class="text-left">
              View Count
            </th>
            <th class="text-left">
              Created By
            </th>
            <th />
          </tr>
        </thead>
        <tbody>
          <tr v-if="!data?.links.length">
            <td
              colspan="4"
              class="text-caption text-grey-7"
            >
              No Links
            </td>
          </tr>
          <tr
            v-for="link in data?.links"
            :key="link.id"
            :class="!link.is_active ? 'bg-grey-3 text-grey-8' : ''"
          >
            <td>
              <q-badge
                v-if="link.is_active"
                color="green"
              >
                Active
              </q-badge>
            </td>
            <td
              class="cursor-pointer"
              @click="selectLink(link)"
            >
              {{ link.title || 'No Title' }}
            </td>
            <td>
              {{ link.expiration_date || 'No Expiration' }}
            </td>
            <td>
              {{ link.view_count }}
            </td>
            <td>
              {{ link.created_by?.username }}
              <div>{{ getDateTimeDisplay(link.date_created) }}</div>
            </td>
            <td>
              <q-btn-group flat>
                <q-btn
                  size="sm"
                  icon="edit"
                  round
                  @click="selectLink(link)"
                />
                <q-btn
                  size="sm"
                  icon="content_copy"
                  round
                  @click="copyLink(link.link)"
                />
                <q-btn
                  size="sm"
                  icon="link"
                  round
                  @click="openLink(link.link)"
                />

                <q-btn
                  size="sm"
                  icon="delete"
                  round
                  disable
                />
              </q-btn-group>
            </td>
          </tr>
        </tbody>
      </q-markup-table>
    </div>

    <DialogMaster
      v-model="dialog"
      close-header
    >
      <template
        v-if="selected"
        #content="{ closeDialog }"
      >
        <q-form @submit.prevent="onSubmit(closeDialog)">
          <q-card-section>
            <q-input
              v-model="selected.title"
              filled
              hint="Optional - Overrides Gallery Title"
              color="black"
              class="q-mb-md"
              label="Title"
            />
            <q-card
              v-if="selected.id > 0"
              flat
              bordered
              square
            >
              <q-card-section class="text-subtitle2">
                Public Link
              </q-card-section>
              <q-separator />
              <q-card-section
                class="cursor-pointer"
                @click="copyLink(selected?.link)"
              >
                {{ selected.link }}
              </q-card-section>
            </q-card>
            <q-checkbox
              v-model="selected.is_active"
              class="q-mt-md"
              color="black"
              label="Is Active"
            />
          </q-card-section>
          <q-separator />
          <q-card-actions align="right">
            <q-btn
              label="Close"
              flat
              @click="closeDialog"
            />
            <q-btn
              color="green"
              label="Save"
              type="submit"
            />
          </q-card-actions>
        </q-form>
      </template>
    </DialogMaster>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from 'vue';
import { copyToClipboard, openURL } from 'quasar';
import { galleryLinks, galleryLinkCreate, galleryLinkUpdate } from 'src/api/galleries';
import { Gallery, GalleryLink } from 'src/models/gallery';
import { getDateTimeDisplay } from 'src/services/date-master';
import { positiveNotification, negativeNotification } from 'src/services/notify';
import DialogMaster from 'src/components/DialogMaster.vue';

export default defineComponent({
  components: { DialogMaster },
  props: {
    galleryId: {
      type: [Number, String],
      required: true,
    },
  },
  setup(props) {
    const data = ref<Gallery>();
    const dialog = ref(false);
    const selected = ref<GalleryLink>();

    async function fetchData() {
      const res = await galleryLinks(props.galleryId);
      if (res && res.data) {
        data.value = res.data;
      }
    }

    function selectLink(v: GalleryLink) {
      selected.value = v;
      dialog.value = true;
    }

    function copyLink(link: string | undefined) {
      if (link) {
        copyToClipboard(link)
          .then(() => {
            positiveNotification('Copied link to Clipboard');
          })
          .catch(() => {
            negativeNotification('Error Copying Link');
          });
      }
    }

    function openLink(link: string | undefined) {
      if (link) {
        openURL(link);
      }
    }

    async function createNew() {
      if (selected.value) {
        const res = await galleryLinkCreate(props.galleryId, selected.value);
        if (res && res.status === 200) {
          positiveNotification('Created!');
          // TODO: return object and unshift
          fetchData();
        }
      }
    }

    async function updateExisting() {
      if (selected.value) {
        const res = await galleryLinkUpdate(props.galleryId, selected.value);
        if (res && res.status === 200) {
          positiveNotification('Updated!');
        }
      }
    }

    function onSubmit(closeDialog: () => void) {
      if (selected.value && selected.value.id === 0) {
        createNew();
      } else {
        updateExisting();
      }
      closeDialog();
    }

    function newLink() {
      const model: GalleryLink = {
        id: 0,
        title: null,
        link: '',
        expiration_date: null,
        view_count: 0,
        date_created: null,
        created_by: null,
        is_active: true,
      };
      selected.value = model;
      dialog.value = true;
    }

    watch(
      () => props.galleryId,
      () => {
        fetchData();
      },
      { immediate: true },
    );

    return {
      data,
      dialog,
      getDateTimeDisplay,
      selectLink,
      selected,
      onSubmit,
      copyLink,
      openLink,
      newLink,
    };
  },
});
</script>
