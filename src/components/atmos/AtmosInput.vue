<template>
  <form @submit.prevent="searchSong">
    <div class="relative max-w-xl mx-auto">
      <input
        class="resize-none bg-[transparent] border border-solid rounded-3xl py-2 px-5 w-full"
        type="text"
        :placeholder="inputTips"
        v-model.trim.lazy="searchValue"
      />
      <search-glasses
        class="absolute right-3 top-2"
        :class="{ 'opacity-40': !iconOpacity, 'cursor-pointer': iconOpacity }"
        @click="searchSong"
      />
    </div>
  </form>
</template>

<script setup>
import { ref,watch } from "vue";
import SearchGlasses from '../svg/SearchGlasses.vue';
const props = defineProps({
  inputTips: {
    type: String,
    required: true
    },
});

const iconOpacity = ref(false);
const searchValue = ref("");
const emit = defineEmits(["searchResult"]);

watch(()=>searchValue.value,()=>{
  if(searchValue.value){
    iconOpacity.value = true;
  }else{
    iconOpacity.value = false;
  }
})

function searchSong() {
  if(!searchValue.value) return ;
  emit("searchResult", searchValue.value);
}
</script>
