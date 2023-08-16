<template>
  <particle-bg />
  <atmos-loading v-if="isLoading"/>
  <atmos-dialog
    :show="errorMessage?.showError"
    :title="errorMessage?.message"
    @close="closeDialog"
  />
  <the-header />
  <router-view class="max-sm:pt-8 pt-14"></router-view>
  <the-footer />
</template>

<script setup>
import TheHeader from "./components/layouts/TheHeader.vue";
import ParticleBg from "./components/layouts/ParticleBg.vue";
import TheFooter from "./components/layouts/TheFooter.vue";
import AtmosLoading from "./components/atmos/AtmosLoading.vue";
import AtmosDialog from "./components/atmos/AtmosDialog.vue";

import { onMounted, toRefs } from "vue";
import { useGlobalStore } from "./stores/index";
import { useAuthStore } from "./stores/auth";
import { useRequestStore } from "./stores/request";

const { isError,isLoading } = useGlobalStore();

const { supabase } = useRequestStore();

const { userInfo } = toRefs(useAuthStore());
const { errorMessage } = toRefs(useGlobalStore());

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
});
</script>

<style></style>
