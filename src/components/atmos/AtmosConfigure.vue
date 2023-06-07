<template>
  <div class="flex items-center">
    <adjustment-button class="cursor-pointer" @click="showDropDown" />
  </div>
</template>

<script setup>
import AdjustmentButton from "../svg/AdjustmentButton.vue";

const emit = defineEmits(["showDrop"]);

function showDropDown() {
  emit("showDrop", null);
}
</script>
