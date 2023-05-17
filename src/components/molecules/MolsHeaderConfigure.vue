<template>
  <div>
    <atmos-header-button @show-drop="showDropDown"/>
    <atmos-drop-down v-if="isShow">
      <div>
        <p class="text-left">文字大小</p>
        <div class="flex justify-between items-end mt-3">
          <p class="border text-2xl leading-9 w-10 h-10 rounded-lg">大</p>
          <p class="border text-lg leading-[2.4rem] w-10 h-10 rounded-lg">中</p>
          <p class="border text-base leading-[2.4rem] w-10 h-10 rounded-lg">
            小
          </p>
        </div>
      </div>

      <hr class="border-gray-200 dark:border-gray-500 my-3" />

      <div>
        <p class="text-left">標註形式</p>
        <div class="flex justify-between items-end mt-3">
          <p class="border px-3 py-1 rounded-lg">平假名</p>
          <p class="border px-3 py-1 rounded-lg">羅馬字</p>
        </div>
      </div>

      <hr class="border-gray-200 dark:border-gray-500 my-3" />

      <div>
        <label
          class="w-full relative inline-flex justify-between items-center cursor-pointer"
        >
          <input type="checkbox" value="" class="sr-only peer" />
          <div
            class="w-11 h-6 bg-gray-200 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-gray-300"
          ></div>
          <span
            class="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300"
            >全平假名</span
          >
        </label>
      </div>
    </atmos-drop-down>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import AtmosDropDown from "../atmos/AtmosDropDown.vue";
import AtmosHeaderButton from "../atmos/AtmosHeaderButton.vue";

const isShow = ref(false)
function showDropDown(value){
    isShow.value = !isShow.value
}
</script>
