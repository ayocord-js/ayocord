<template>
  <v-btn
    :variant="'outlined'"
    :color="'primary'"
    class="button-outline text-sm sm:text-base rounded-xl"
    :width="130"
    height="50"
  >
    {{ button.name }}
  </v-btn>
</template>

<script lang="ts" setup>
defineProps({
  button: {
    type: Object,
    required: true,
  },
});
</script>

<style scoped>
.button-outline {
  border-color: linear-gradient(90deg, #66c0ff, #3d7399) !important;
}
</style>
