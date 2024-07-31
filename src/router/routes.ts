import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/login',
    component: () => import('layouts/LoginLayout.vue'),
    name: 'login',
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
        component: () => import('pages/items/vimeo/VimeoItemsList.vue'),
        name: 'item-list-vimeo',
        props: true,
      },
      {
        path: 'bucket/:sourceId/items/:itemId',
        component: () => import('pages/items/bucket/ItemDetail.vue'),
        name: 'item-detail-bucket',
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
