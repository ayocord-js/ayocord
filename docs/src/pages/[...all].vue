<template>
  <div
    class="flex justify-center items-center flex-col select-none no-copy cursor-default h-screen"
  >
    <div class="flex items-center text-[10rem] text-text flex-col space-y-4">
      <div class="flex items-center">
        <p>4</p>
        <Logo class="max-w-[140px] w-[200px]" />
        <p>4</p>
      </div>

      <v-btn
        @click="navigateTo(Routes.main)"
        color="primary"
        class="rounded-xl text-text border-none"
      >
        Go back
      </v-btn>
    </div>
  </div>
</template>

<script lang="ts" setup>
import Logo from "../components/Icons/Logo.vue";
import { Routes } from "../utils";
import { navigateTo } from "../utils/navigateTo";
</script>

<style></style>
