import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/login',
    component: () => import('layouts/LoginLayout.vue'),
    name: 'login',
  },
  {
    path: '/public',
    component: () => import('layouts/PublicLayout.vue'),
    children: [
      {
        path: 'gallery-link/:link',
        component: () => import('pages/gallery-links/GalleryLinkPublic.vue'),
        name: 'gallery-link-public',
        props: true,
      },
    ],
  },
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        component: () => import('pages/sources/SourcesList.vue'),
        name: 'home',
      },
      {
        path: 'bucket/:sourceId/items',
        component: () => import('pages/items/bucket/ItemList.vue'),
        name: 'item-list-bucket',
        props: true,
      },
      {
        path: 'vimeo/:sourceId/items',
        component: () => import('pages/items/vimeo/ItemList.vue'),
        name: 'item-list-vimeo',
        props: true,
      },
      {
        path: 'bucket/:sourceId/items/:itemId',
        component: () => import('pages/items/bucket/ItemDetail.vue'),
        name: 'item-detail-bucket',
        props: true,
      },
      {
        path: 'vimeo/:sourceId/items/:itemId',
        component: () => import('pages/items/vimeo/ItemDetail.vue'),
        name: 'item-detail-vimeo',
        props: true,
      },
      {
        path: 'galleries',
        component: () => import('pages/galleries/GalleryList.vue'),
        name: 'gallery-list',
      },
      {
        path: 'galleries/:galleryId',
        component: () => import('pages/galleries/GalleryDetail.vue'),
        name: 'gallery-detail',
        props: true,
      },
    ],
  },
  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;
