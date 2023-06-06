<template>
  <p>取得歌詞內容中</p>
  <!-- <atmos-card
    :data="'asd'"
    :id="'a'"
    :href="`/song?video=asd`"
  /> -->
</template>

<script setup>
import { onMounted, ref } from "vue";
import useSupabase from "../../stores/supabase";
import AtmosCard from "../atmos/AtmosCard.vue";

const { supabase } = useSupabase();

// onMounted(async () => {
//   let { data, error } = await supabase.from("lyrics").select();
//   console.log('%c 結果(紅) ', 'background: #EA0000; color: #ffffff',data);
// });
</script>
