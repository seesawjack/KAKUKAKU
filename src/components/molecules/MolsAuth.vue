<template>
  <atmos-auth>
    <template #input>
      <atmos-input
        v-for="(item, key) in formInfo[formType]"
        :key="key"
        :inputClass="'block w-full py-3 bg-white border rounded-lg pl-11 dark:bg-gray-900 dark:border-gray-600 focus:border-blue-400 dark:focus:border-blue-300 focus:ring-blue-300 focus:outline-none focus:ring focus:ring-opacity-40 mt-8'"
        :inputTips="item.tips"
        :inputType="item.type"
        v-model="item.value"
      >
        <component :is="iconType[item.icon]" class="absolute top-3"></component>
      </atmos-input>
      <div v-if="formType === 'signup'">
        <atmos-date-picker />
        <div class="relative mt-8">
          <gender-icon class="absolute top-3"/>
          <select
            v-model="custom.gender"
            class="w-full border border-gray-600 rounded-lg dark:bg-gray-900 text-gray-300 py-3 pl-11"
          >
            <option disabled value="">請選擇性別</option>
            <option>男性</option>
            <option>女性</option>
          </select>
        </div>

        <div class="relative mt-8">
          <paper-icon class="absolute top-3"/>
          <select
            v-model="custom.level"
            class="w-full border border-gray-600 rounded-lg dark:bg-gray-900 py-3 pl-11 placeholder-gray-700"
          >
            <option disabled value="">請選擇日本語能力(JLPT)</option>
            <option>無</option>
            <option>N1</option>
            <option>N2</option>
            <option>N3</option>
            <option>N4</option>
            <option>N5</option>
          </select>
        </div>
      </div>
    </template>
    <template #button>
      <div class="mt-6">
        <button
          class="w-full px-6 py-3 text-sm font-medium tracking-wide text-white capitalize transition-colors duration-300 transform border rounded-lg hover:bg-sky-900/90 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-50"
        >
          {{ formType === "signin" ? "登入" : "送出" }}
        </button>

        <div class="mt-6 text-center" v-if="formType === 'signin'">
          <a
            href="/signup"
            class="text-sm text-blue-500 hover:underline dark:text-blue-400"
          >
            申請帳號
          </a>
        </div>
      </div>
    </template>
  </atmos-auth>
</template>

<script setup>
import { ref, computed } from "vue";
import { useRoute } from "vue-router";
import { useAuthStore } from "../../stores/auth";
import AtmosAuth from "../atmos/AtmosAuth.vue";
import AtmosInput from "../atmos/AtmosInput.vue";
import AtmosDatePicker from "../atmos/AtmosDatePicker.vue";
import UserIcon from "../svg/UserIcon.vue";
import PasswordIcon from "../svg/PasswordIcon.vue";
import EmailIcon from "../svg/EmailIcon.vue";
import GenderIcon from '../svg/GenderIcon.vue';
import PaperIcon from '../svg/PaperIcon.vue'

const { formInfo } = useAuthStore();
const {
  formInfo: { custom },
} = useAuthStore();
const route = useRoute();

const iconType = {
  UserIcon,
  PasswordIcon,
  EmailIcon,
};
const selected = ref();
const formType = computed(() => {
  return route.path.replace("/", "");
});
</script>