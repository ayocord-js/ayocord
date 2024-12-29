<template>
  <div
    class="flex items-center text-text font-bold select-none no-copy cursor-default justify-center h-screen px-4 sm:px-0"
  >
    <Logo class="hidden sm:block" width="350" />

    <div
      class="flex flex-col items-center justify-center text-center gap-4 sm:gap-6"
    >
      <div>
        <h2
          class="text-3xl sm:text-5xl font-semibold text-primary glowing-text"
        >
          Ayocord
        </h2>
        <p class="text-lg sm:text-xl">Simplify development with ayocord.</p>
      </div>

      <div class="flex cursor-pointer flex-wrap justify-center gap-4 sm:gap-6">
        <v-btn
          v-for="(button, index) in buttons"
          :key="index"
          variant="outlined"
          color="primary"
          class="button-outline text-text text-sm sm:text-base rounded-xl"
          :width="130"
          height="50"
        >
          {{ button.name }}
        </v-btn>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import Logo from "../components/Icons/Logo.vue";

const buttons = [
  { name: "Docs", link: "/docs" },
  { name: "Guide", link: "/docs" },
  { name: "Source", link: "/docs" },
];
</script>

<style scoped>
.button-outline {
  border-color: #66c0ff !important;
}

.glowing-text {
  color: #66c0ff;
  text-shadow: 0 0 2px #66c0ff, 0 0 5px #66c0ff, 0 0 8px #66c0ff;
}
</style>
