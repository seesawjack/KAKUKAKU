<template>
  <atmos-popup v-if="closePopup" :title="popupTitle" :content="popupContent" @agree="handleAgree"
    @disagree="handleDisagree" />
  <atmos-loading v-if="isLoading" />
  <atmos-dialog :show="errorMessage?.showError" :title="errorMessage?.message" @close="closeDialog" />

  <the-header />
  <router-view class="max-sm:pt-8 pt-14 max-md:mt-7"></router-view>
  <the-footer />
  <background-animate />
</template>

<script setup>
import { ref, computed, onMounted, toRefs } from "vue";
import { useRouter } from "vue-router";
import { useGlobalStore } from "./stores/index";
import { useAuthStore } from "./stores/auth";
import { useRequestStore } from "./stores/request";

import TheHeader from "./components/layouts/TheHeader.vue";
import BackgroundAnimate from "./components/layouts/BackgroundAnimate.vue";
import TheFooter from "./components/layouts/TheFooter.vue";
import AtmosLoading from "./components/atmos/AtmosLoading.vue";
import AtmosDialog from "./components/atmos/AtmosDialog.vue";
import AtmosPopup from "./components/atmos/AtmosPopup.vue";

const { isLoading } = toRefs(useGlobalStore())
const { isError } = useGlobalStore();

const { supabase } = useRequestStore();

const { userInfo } = toRefs(useAuthStore());
const { errorMessage } = toRefs(useGlobalStore());

const router = useRouter();

const closePopup = ref(true);
const popupTitle = "網站使用規範";
const popupContent = `
  <ul class="list-disc pl-3">
    <li>此網站僅供日文學習使用，歌曲和歌詞的版權屬於唱片公司。</li>
    <li>網站目的在於日文教學，非分享歌曲，喜歡請支持購買原版。</li>
    <li>請僅在本站學習使用歌曲，切勿透過其他工具下載，本站不提供下載連結。</li>
  </ul>`

function handleAgree() {
  closePopup.value = false;
  localStorage.setItem('cybernorms', true);
}
function handleDisagree() {
  router.back();
}

function closeDialog() {
  isError({ showError: false, message: "" });
  return;
}

onMounted(() => {
  supabase.auth.onAuthStateChange((event, session) => {
    if (event == "SIGNED_IN") {
      userInfo.value = session?.user || null;
    }
  });

  closePopup.value = localStorage.getItem('cybernorms') ? false : true;
});
</script>

