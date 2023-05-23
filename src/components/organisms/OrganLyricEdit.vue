<template>
  <div class="flex flex-col max-w-[510px] mx-auto mt-10">
    <div class="relative">
      <atmos-card
        v-if="showCard"
        :id="songInfo.id"
        :url="songInfo.url"
        :width="songInfo.width"
        :height="songInfo.height"
        :title="songInfo.title"
        :subTitle="songInfo.subTitle"
      />
    </div>
    <atmos-keywords/>
    <mols-edit/>
  </div>
</template>

<script setup>
import { ref,onMounted,computed } from "vue";
import { useRoute } from "vue-router";
import { useGlobalStore } from "../../stores/index";
import AtmosCard from "../atmos/AtmosCard.vue";
import AtmosKeywords from '../atmos/AtmosKeywords.vue';
import MolsEdit from '../molecules/MolsEdit.vue'

const route = useRoute();
const globalStore = useGlobalStore();
const showCard = ref(false);

const songInfo = computed(() => {
  return (
    globalStore.selectedSongInfo ||
    JSON.parse(localStorage.getItem("songHistory"))
  );
});

onMounted(() => {
  if (route.query.search) {
    return showCard.value =
      route.query.search === songInfo.value.id || false;
  }
});
</script>

<style>
</style>