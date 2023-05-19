<template>
  <div class="flex">
    <dark-mood-button class="hidden"/>
    <like-button class="mx-3 hidden" />
    <adjustment-button class="cursor-pointer" @click="showDropDown" />
  </div>
</template>

<script setup>
import { ref } from "vue";
import AdjustmentButton from "../svg/AdjustmentButton.vue";
import LikeButton from "../svg/LikeButton.vue";
import DarkMoodButton from "../svg/DarkMoodButton.vue";

const emit = defineEmits(['showDrop'])
function showDropDown() {
  emit('showDrop',null)
}
</script>
