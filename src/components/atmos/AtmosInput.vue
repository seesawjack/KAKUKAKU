<template>
  <div class="relative max-w-xl mx-auto">
    <input
      :class="inputClass"
      type="text"
      :placeholder="inputTips"
      v-model.trim.lazy="searchValue"
    />
    <slot></slot>
  </div>
</template>

<script setup>
import { ref, toRefs, watch } from "vue";
import SearchGlasses from "../svg/SearchGlasses.vue";
import { useSearchStore } from "../../stores/search/";

const { searchSong } = toRefs(useSearchStore());
const props = defineProps({
  inputTips: {
    type: String,
    required: true,
  },
  inputClass: {
    type: String,
    required: true,
  },
});

const searchValue = ref("");

watch(
  () => searchValue.value,
  () => {
    searchSong.value = searchValue.value || "";
  }
);
</script>
