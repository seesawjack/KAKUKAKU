<template>
  <particle-bg />
  <atmos-loading v-if="isLoading" />
  <the-header />
  <router-view class="pt-[56px]"></router-view>
  <the-footer />
</template>

<script setup>
import TheHeader from "./components/layouts/TheHeader.vue";
import ParticleBg from "./components/layouts/ParticleBg.vue";
import TheFooter from "./components/layouts/TheFooter.vue";
import AtmosLoading from "./components/atmos/AtmosLoading.vue";

import { onMounted, toRefs } from "vue";
import { useGlobalStore } from "./stores/index";
import { useAuthStore } from "./stores/auth";
import useSupabase from "./stores/supabase";

let { isLoading } = toRefs(useGlobalStore());

const { supabase } = useSupabase();

const authStore = useAuthStore();

onMounted(() => {
  supabase.auth.onAuthStateChange((event, session) => {
    authStore.userInfo = session?.user || null;
  });
});
</script> 

<style>
</style>
