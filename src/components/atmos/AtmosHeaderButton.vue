<template>
  <div class="flex items-center">
    <div v-if="userInfo.name" class="flex mr-3 border rounded py-1 px-2">
      <user-icon class="mx-0 mr-2" />
      {{ userInfo.name }}
    </div>
    <dark-mood-button class="hidden" />
    <like-button class="mx-3 hidden" />
    <adjustment-button class="cursor-pointer" @click="showDropDown" />
  </div>
</template>

<script setup>
import AdjustmentButton from "../svg/AdjustmentButton.vue";
import LikeButton from "../svg/LikeButton.vue";
import DarkMoodButton from "../svg/DarkMoodButton.vue";
import UserIcon from "../svg/UserIcon.vue";
import { useAuthStore } from "../../stores/auth";
import { storeToRefs } from "pinia";

const authStore = useAuthStore();
const { userInfo } = storeToRefs(authStore);

const emit = defineEmits(["showDrop"]);

function showDropDown() {
  emit("showDrop", null);
}
</script>
