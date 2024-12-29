<template>
  <v-btn
    :variant="'outlined'"
    :color="'primary'"
    class="button-outline text-sm sm:text-base rounded-xl"
    :width="130"
    height="50"
  >
    <p class="text-text">{{ button.name }}</p>
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
  position: relative;
  border: 2px solid;
  border-radius: 1rem;
  transition: background-color 0.3s ease, color 0.3s ease;
}
</style>
