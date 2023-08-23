<template>
  <div class="flex max-md:flex-row flex-col items-center">
    <atmos-svg-icon name="icon_tooth" class="max-md:mr-2 max-md:mb-0 mb-2 cursor-pointer" @click="showDropDown"/>
    <slot name="otherConfigure"></slot>
  </div>
</template>

<script setup>
import AtmosSvgIcon from "./AtmosSvgIcon.vue";

const emit = defineEmits(["showDrop"]);

function showDropDown() {
  emit("showDrop");
}
</script>
