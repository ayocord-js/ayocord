<template>
  <v-app-bar class="text-text gradient flex justify-between" color="primary">
    <div class="flex items-center gap-4">
      <RouterLink :to="Routes.main">
        <Logo width="65" />
      </RouterLink>
      <div class="flex gap-3">
        <v-btn class="btn-gray">Documentation</v-btn>
        <v-btn class="btn-gray">Source</v-btn>
      </div>
    </div>
    <div>
      idk
    </div>
  </v-app-bar>
</template>

<script lang="ts" setup>
import Logo from "../components/Icons/Logo.vue";
import { Routes } from "../utils";
</script>

<style scoped>
.gradient {
  background: linear-gradient(90deg, #66c0ff, #3d7399);
}

.btn-gray {
  background-color: #000; /* Серый цвет */
  opacity: 20%;
  color: white;
  border-radius: 8px;
}
</style>
