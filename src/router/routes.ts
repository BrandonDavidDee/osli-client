import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/login',
    component: () => import('layouts/LoginLayout.vue'),
    name: 'login',
  },
  {
    path: '/share',
    component: () => import('layouts/PublicLayout.vue'),
    children: [
      {
        path: 'gallery/:link',
        component: () => import('pages/public-links/GalleryLinkPublic.vue'),
        name: 'gallery-link-public',
        props: true,
      },
      {
        path: 'item/:link',
        component: () => import('pages/public-links/ItemLinkPublic.vue'),
        name: 'item-link-public',
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
        props: (route) => ({
          sourceId: route.params.sourceId,
          isRoute: true,
        }),
      },
      {
        path: 'vimeo/:sourceId/items',
        component: () => import('pages/items/vimeo/ItemList.vue'),
        name: 'item-list-vimeo',
        props: (route) => ({
          sourceId: route.params.sourceId,
          isRoute: true,
        }),
      },
      {
        path: 'bucket/:sourceId/items/:itemId',
        component: () => import('pages/items/bucket/ItemDetail.vue'),
        name: 'item-detail-bucket',
        props: true,
      },
      {
        path: 'bucket/:sourceId/items/:itemId/links',
        component: () => import('pages/items/common/ItemLinks.vue'),
        name: 'item-links-bucket',
        props: (route) => ({
          sourceId: route.params.sourceId,
          itemId: route.params.itemId,
          sourceType: 'bucket',
        }),
      },
      {
        path: 'vimeo/:sourceId/items/:itemId',
        component: () => import('pages/items/vimeo/ItemDetail.vue'),
        name: 'item-detail-vimeo',
        props: true,
      },
      {
        path: 'vimeo/:sourceId/items/:itemId/links',
        component: () => import('pages/items/common/ItemLinks.vue'),
        name: 'item-links-vimeo',
        props: (route) => ({
          sourceId: route.params.sourceId,
          itemId: route.params.itemId,
          sourceType: 'vimeo',
        }),
      },
      {
        path: 'galleries',
        component: () => import('pages/galleries/GalleryList.vue'),
        name: 'gallery-list',
      },
      {
        path: 'galleries/:galleryId',
        component: () => import('pages/galleries/detail/GalleryDetail.vue'),
        name: 'gallery-detail',
        props: true,
      },
      {
        path: 'galleries/:galleryId/links',
        component: () => import('src/pages/galleries/links/GalleryLinks.vue'),
        name: 'gallery-links',
        props: true,
      },
      {
        path: 'me/profile',
        component: () => import('pages/me/MyProfile.vue'),
        name: 'my-profile',
      },
      {
        path: 'me/links',
        component: () => import('pages/me/MyLinks.vue'),
        name: 'my-links',
      },
      {
        path: 'me/saved',
        component: () => import('pages/me/MySavedItems.vue'),
        name: 'my-saved',
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
