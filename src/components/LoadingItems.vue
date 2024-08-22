<template>
  <div
    class="row"
  >
    <div
      v-for="item in 12"
      :key="item"
      class="col-xs-12 col-sm-6 col-md-4 col-lg-3 col-xl-2"
    >
      <q-card
        square
        flat
        bordered
        class="q-ma-xs"
      >
        <q-item>
          <q-item-section>
            <q-item-label>
              <q-skeleton type="text" />
            </q-item-label>
            <q-item-label caption>
              <q-skeleton type="text" />
            </q-item-label>
          </q-item-section>
        </q-item>

        <q-skeleton
          height="200px"
          square
        />
      </q-card>
    </div>
  </div>
</template>
