<template>
  <VueDatePicker
    class="mt-8 svg-size"
    input-class-name="pl-11 py-3 border placeholder-gray-300 border-gray-600 rounded-lg dark:bg-gray-900"
    v-model="custom.birth"
    :dark="true"
    :enable-time-picker="false"
    :format="format"
    :year-range="[1920, new Date().getFullYear()]"
    :day-names="['月', '火', '水', '木', '金', '土', '日']"
    placeholder="請選擇生日"
  >
    <template #input-icon>
      <calender-icon />
    </template>
  </VueDatePicker>
</template>

<script setup>
import { ref } from "vue";
import { useAuthStore } from '../../stores/auth'
import VueDatePicker from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";
import CalenderIcon from "../svg/CalenderIcon.vue";

const { formInfo:{custom}} = useAuthStore();

const format = (date) => {
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();

  return `${year}-${month}-${day}`;
};
</script>

<style scoped>
.svg-size svg {
  width: 24px;
}
</style>