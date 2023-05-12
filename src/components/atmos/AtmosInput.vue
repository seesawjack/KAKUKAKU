<template>
  <form @submit.prevent="searchSong">
    <div class="relative max-w-xl mx-auto">
      <input
      class="resize-none bg-[transparent] border border-solid rounded-3xl py-2 px-5  w-full"
      type="text"
      :placeholder="inputPh"
      v-model="searchValue"
    />
    <search-glasses class="absolute right-3 top-2 opacity-40"/>
    </div>
  </form>
</template>

<script setup>
import { ref } from "vue";
import SearchGlasses from '../svg/SearchGlasses.vue'
const props = defineProps({
  inputPh: String,
});
const emit = defineEmits(["searchResult"]);

const searchValue = ref("");

function searchSong() {
  emit("searchResult", searchValue.value);
}
</script>
