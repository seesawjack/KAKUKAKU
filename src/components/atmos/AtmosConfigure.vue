<template>
  <div class="flex items-center">
    <div v-if="userInfo.user_metadata?.name" class="flex mr-3 border rounded py-1 px-2">
      <user-icon class="mx-0 mr-2" />
      {{ userInfo.user_metadata?.name }}
    </div>
    <slot name="icon"></slot>
    <adjustment-button class="cursor-pointer" @click="showDropDown" />
  </div>
</template>

<script setup>
import AdjustmentButton from "../svg/AdjustmentButton.vue";
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
