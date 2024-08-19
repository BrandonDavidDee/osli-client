<template>
  <div class="fullscreen bg-black text-white text-center q-pa-md flex flex-center">
    <div>
      <div
        style="font-size: 30vh"
      >
        403
      </div>

      <div
        class="text-h2"
        style="opacity:.4"
      >
        Oops. Not Authorized
      </div>

      <q-btn
        class="q-mt-xl"
        color="white"
        text-color="black"
        unelevated
        label="Go Home"
        no-caps
        :to="{name: 'home'}"
      />
    </div>
  </div>
</template>
