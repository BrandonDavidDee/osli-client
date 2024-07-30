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
        path: 'source/s3/:sourceS3Id',
        component: () => import('pages/items_s3/ItemList.vue'),
        name: 's3-item-list',
        props: true,
      },
      {
        path: 'source/vimeo/:sourceVimeoId',
        component: () => import('pages/items_vimeo/VimeoItemsList.vue'),
        name: 'vimeo-item-list',
        props: true,
      },
      {
        path: 'source/s3/items/:itemId',
        component: () => import('pages/items_s3/ItemDetail.vue'),
        name: 'item-detail',
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
