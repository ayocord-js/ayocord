<template>
  <div
    class="flex flex-col items-center justify-center h-screen select-none no-copy text-center"
  >
    <div class="flex gap-5 font-bold text-[11rem] sm:text-[10rem] md:text-[15rem]">
      <p>4</p>
      <Logo class="w-[250px]" />
      <p>4</p>
    </div>
    <div
      class="flex font-bold font-roboto flex-col items-center gap-[20px] mt-6"
    >
      <p class="text-2xl">This page does not exist</p>
      <v-btn
        @click="redirectToMain"
        color="primary"
        width="200"
        height="40"
        text="Go back"
      ></v-btn>
    </div>
  </div>
</template>

<script lang="ts" setup>
import Logo from "../components/Icons/Logo.vue";
import router from "../plugins/router";
import { Routes } from "../utils";

const redirectToMain = () => {
  router.push(Routes.main);
};
</script>

<style></style>
