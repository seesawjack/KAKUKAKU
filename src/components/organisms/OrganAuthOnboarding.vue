<template>
  <section class="mt-56">
    <div class="container mx-auto">
      <div class="flex items-center justify-center">
        <p
          class="w-2/3 pb-4 font-medium text-center text-white text-3xl capitalize border-b border-sky-400"
        >
         {{ title }}
        </p>
      </div>
      <p class="mt-10 text-lg">
        {{ subTitle }}
      </p>
      <div v-if="!isLoggedIn" class="text-lg text-gray-300">
        <p>※ 若收件匣無顯示新郵件，請至垃圾郵件尋找</p>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref,onBeforeMount } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "../../stores/auth";

const router = useRouter();
const { isLoggedIn } = useAuthStore();

const title = ref('');
const subTitle = ref('');

onBeforeMount(()=>{
  if(isLoggedIn()){
    title.value = '驗證成功';
    subTitle.value = '註冊會員成功，一分鐘後會自動替您跳轉到首頁';
    
    setTimeout(() => {
      router.push('/song/search')
    }, 1000);
    return;
  }
  title.value = '驗證您的信箱';
  subTitle.value = '我們已寄信到您的信箱，請點擊信件中的連結後即註冊成功';
})
</script>
