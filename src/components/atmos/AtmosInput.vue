<template>
  <form @submit.prevent="searchSong">
    <div class="relative max-w-xl mx-auto">
      <input
      class="resize-none bg-[transparent] border border-solid rounded-3xl py-2 px-5  w-full"
      type="text"
      :placeholder="inputPh"
      v-model.lazy="searchValue"
    />
    <search-glasses class="absolute right-3 top-2" :class="{'opacity-40':!iconStyle,'cursor-pointer':iconStyle}" @click="searchSong"/>
    </div>
  </form>
</template>

<script setup>
import { ref,watch } from "vue";
import SearchGlasses from '../svg/SearchGlasses.vue'
const props = defineProps({
  inputPh: String,
});

const iconStyle = ref(false)
const emit = defineEmits(["searchResult"]);

const searchValue = ref("");

watch(()=>searchValue.value,()=>{
  if(searchValue.value){
    iconStyle.value = true;
    return;
  }
  iconStyle.value = false;
})
function searchSong() {
  if(!iconStyle.value){return ;}
  emit("searchResult", searchValue.value);
}
</script>
