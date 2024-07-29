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
        path: 'source/:sourceId',
        component: () => import('pages/sources/ItemList.vue'),
        name: 'source-items',
        props: true,
      },
      {
        path: 'item/:itemId',
        component: () => import('pages/items/ItemDetail.vue'),
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
