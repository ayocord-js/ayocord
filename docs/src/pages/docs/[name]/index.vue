<template>
  <GuideLayout>
    
  </GuideLayout>
</template>

<script lang="ts" setup>
import { useRoute } from "vue-router";
import GuideLayout from "../../../layouts/GuideLayout.vue";

const { name } = useRoute().params;
console.log(name);
</script>

<style></style>
