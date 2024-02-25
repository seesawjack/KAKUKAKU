<template>
  <section class="!mt-56 px-5">
    <div class="container mx-auto">
      <div class="flex items-center justify-center">
        <p
          class="w-2/3 pb-4 font-medium text-white text-2xl capitalize border-b border-sky-400"
        >
          {{ title }}
        </p>
      </div>
      <p class="mt-10 text-lg max-md:text-base">
        {{ subTitle }}
      </p>
      <div v-if="!isLoggedIn" class="text-lg text-gray-300">
        <p>※ 若收件匣無顯示新郵件，請至垃圾郵件尋找</p>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRoute } from 'vue-router';
import { useAuthStore } from "@/stores/auth";

const { isLoggedIn } = useAuthStore();
const route = useRoute();

const loggedIn = computed(() => {
  return isLoggedIn();
});
const title = ref("");
const subTitle = ref("");

onMounted(() => {
  if (route.path.indexOf('register-success')>-1 && loggedIn) {
    title.value = "驗證成功";
    subTitle.value = "註冊會員成功，歡迎使用本網站會員相關功能";
  } else {
    title.value = "驗證您的信箱";
    subTitle.value = "我們已寄信到您的信箱，請點擊信件中的連結後即註冊成功";
  }
});
</script>
