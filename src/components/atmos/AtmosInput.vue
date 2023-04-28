<template>
  <form @submit.prevent="searchSong">
    <input
      class="resize-none bg-[transparent] border border-solid rounded-3xl py-2 px-5 max-w-lg w-full"
      type="text"
      :placeholder="inputPh"
      v-model="searchValue"
    />
  </form>
</template>

<script setup>
import { ref } from "vue";
const props = defineProps({
  inputPh: String,
});
const emit = defineEmits(["searchResult"]);

const searchValue = ref("");

function searchSong() {
  emit("searchResult", searchValue.value);
}
</script>
