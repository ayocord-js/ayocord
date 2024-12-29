<template>
  <div
    class="flex items-center text-text font-bold select-none no-copy cursor-default justify-center h-screen px-4 sm:px-0"
  >
    <Logo class="hidden mx-10 sm:block" width="350" />

    <div
      class="flex flex-col items-center justify-center text-center sm:gap-2"
    >
      <h2 class="text-3xl sm:text-5xl font-semibold text-gradient glow-text">
        Ayocord
      </h2>
      <p class="text-lg sm:text-xl">Simplify development with ayocord.</p>
      <div class="flex cursor-pointer flex-wrap justify-center gap-1 sm:gap-1">
        <Button
          v-for="(button, index) in buttons"
          :key="index"
          :button="button"
          @click="
            navigateTo(button.link, button.name.toLowerCase() === 'source')
          "
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import Logo from "../components/Icons/Logo.vue";
import Button from "../components/Main/Button.vue";
import { Routes } from "../utils";
import { navigateTo } from "../utils/navigateTo";

const buttons = [
  { name: "Docs", link: Routes.docs },
  { name: "Guide", link: Routes.guide },
  { name: "Source", link: Routes.source },
];
</script>

<style scoped>
.text-gradient {
  background: linear-gradient(90deg, #66c0ff, #3d7399);
  background-clip: text;
  color: transparent;
}

.glow-text {
  text-shadow: 0 0 10px rgba(102, 192, 255, 0.7),
    0 0 20px rgba(102, 192, 255, 0.7);
}
</style>
