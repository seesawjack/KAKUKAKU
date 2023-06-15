<template>
  <div class="flex items-center">
    <tooth-icon class="cursor-pointer" @click="showDropDown" />
  </div>
</template>

<script setup>
import ToothIcon from "../svg/ToothIcon.vue";

const emit = defineEmits(["showDrop"]);

function showDropDown() {
  emit("showDrop", null);
}
</script>
