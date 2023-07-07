<template>
  <div class="flex-col items-center">
    <tooth-icon class="cursor-pointer" @click="showDropDown" />
    <slot name="otherConfigure"></slot>
  </div>
</template>

<script setup>
import ToothIcon from "../svg/ToothIcon.vue";

const emit = defineEmits(["showDrop"]);

function showDropDown() {
  emit("showDrop", null);
}
</script>
