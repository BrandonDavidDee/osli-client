<template>
  <q-list
    bordered
  >
    <q-item
      v-for="item in 20"
      :key="item"
    >
      <q-item-section avatar>
        <q-avatar>
          <q-skeleton type="QAvatar" />
        </q-avatar>
      </q-item-section>
      <q-item-section>
        <q-skeleton type="text" />
        <q-item-label caption>
          <q-skeleton
            type="text"
            width="200px"
          />
        </q-item-label>
      </q-item-section>
      <q-item-section side>
        <q-btn-group flat>
          <q-skeleton type="QBtn" />
        </q-btn-group>
      </q-item-section>
    </q-item>
  </q-list>
</template>
