<template>
  <particle-bg />
  <the-header />
  <router-view class="pt-[56px]"></router-view>
  <the-footer />
</template>

<script setup>
import TheHeader from "./components/layouts/TheHeader.vue";
import ParticleBg from "./components/layouts/ParticleBg.vue";
import TheFooter from "./components/layouts/TheFooter.vue";

import { useAuthStore } from "./stores/auth";
import useSupabase from "./stores/supabase";
import { onMounted } from "vue";

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
