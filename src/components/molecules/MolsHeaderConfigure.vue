<template>
  <div>
    <atmos-header-button @show-drop="showDropDown" />
    <atmos-drop-down :show="isShow">
      <!-- 歌詞編輯頁選項 -->
      <div v-if="router.path === '/song'">
        <!-- ▼單選 文字大小 -->
        <div>
          <p class="text-left">文字大小</p>
          <div class="flex justify-between items-end mt-3">
            <label
              :for="font.id"
              v-for="(font, index) in globalStore.lyricConfiguration.fontSize"
              :key="index"
              class="border cursor-pointer hover:bg-slate-500 w-10 h-10 rounded-lg"
              :class="[
                font.class,
                {
                  'bg-slate-900': font.id === fontSelect,
                  'text-blue-400': font.id === fontSelect,
                },
              ]"
            >
              <input
                type="radio"
                hidden
                :id="font.id"
                :value="font.id"
                v-model="fontSelect"
              />
              <p>
                {{ font.name }}
              </p>
            </label>
          </div>
        </div>
        <hr class="border-gray-200 dark:border-gray-500 my-3" />
        <!-- ▼單選 標註形式 -->
        <div>
          <p class="text-left">標註形式</p>
          <div class="flex justify-between items-end mt-3">
            <label
              :for="font.id"
              v-for="(font, index) in globalStore.lyricConfiguration.labelType"
              :key="index"
              class="border cursor-pointer hover:bg-slate-500 px-2 py-1 rounded-lg"
              :class="{
                'bg-slate-900': font.id === labelSelect,
                'text-blue-400': font.id === labelSelect,
              }"
            >
              <input
                type="radio"
                hidden
                :id="font.id"
                :value="font.id"
                v-model="labelSelect"
              />
              <p>
                {{ font.name }}
              </p>
            </label>
          </div>
        </div>
        <hr class="border-gray-200 dark:border-gray-500 my-3" />
        <!-- ▼開關 全平假名 -->
        <div>
          <label
            for="allHiragana"
            class="w-full relative inline-flex justify-between items-center cursor-pointer"
          >
            <input
              type="checkbox"
              id="allHiragana"
              v-model="allHiragana"
              class="sr-only peer"
            />
            <div
              class="w-11 h-6 bg-gray-200 rounded-full peer dark:bg-gray-500 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-gray-300"
            ></div>
            <span
              class="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300"
              >全平假名</span
            >
          </label>
        </div>
        <hr class="border-gray-200 dark:border-gray-500 my-3" />
        <!-- ▼開關 影片固定 -->
        <div>
          <label
            for="fixedVideo"
            class="w-full relative inline-flex justify-between items-center cursor-pointer"
          >
            <input
              type="checkbox"
              id="fixedVideo"
              v-model="fixedVideo"
              class="sr-only peer"
            />
            <div
              class="w-11 h-6 bg-gray-200 rounded-full peer dark:bg-gray-500 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-gray-300"
            ></div>
            <span
              class="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300"
              >影片固定</span
            >
          </label>
        </div>
        <hr class="border-gray-200 dark:border-gray-500 my-3" />
      </div>
      <!-- 基本選項 -->
      <div>
        <router-link
          to="/about"
          class="flex items-center py-3 text-sm text-gray-600 capitalize transition-colors duration-300 transform dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 dark:hover:text-white"
        >
          <the-logo class="h-5 mx-1" />
          <span class="mx-1"> 關於網站 </span>
        </router-link>
        <a
          href="#"
          class="flex items-center py-3 text-sm text-gray-600 capitalize transition-colors duration-300 transform dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 dark:hover:text-white"
        >
          <signin-button class="h-5 mx-1" />
          <span class="mx-1"> 登入 </span>
        </a>
      </div>
    </atmos-drop-down>
  </div>
</template>

<script setup>
import { ref,toRefs, watch, onMounted, onBeforeUnmount } from "vue";
import { useGlobalStore } from "../../stores/index";
import { useRoute } from "vue-router";
import AtmosDropDown from "../atmos/AtmosDropDown.vue";
import AtmosHeaderButton from "../atmos/AtmosHeaderButton.vue";
import TheLogo from "../svg/TheLogo.vue";
import SigninButton from "../svg/SigninButton.vue";

const router = useRoute();
const globalStore = useGlobalStore();
const { lyricConfiguration } = globalStore;
const { selected } = toRefs(lyricConfiguration)

const isShow = ref(false);
function showDropDown() {
  isShow.value = !isShow.value;
}
const fontSelect = ref("middle");
const labelSelect = ref("hiragana");
const allHiragana = ref(false);
const fixedVideo = ref(false);

watch(fontSelect, () => {
  globalStore.selectedFontStyle(fontSelect.value);
});

watch(labelSelect, () => {
  globalStore.selectedLabelStyle(labelSelect.value);
});

watch(allHiragana, () => {
  selected.value.allHiragana = allHiragana.value;
});

watch(fixedVideo, () => {
  selected.value.fixedVideo = fixedVideo.value;
});

onMounted(() => {
  document.addEventListener("click", () => {
    if (!event.target.closest(".dropdown")) {
      isShow.value = false;
    }
  });
});

onBeforeUnmount(() => {
  document.body.removeEventListener("click", () => {
    if (!event.target.closest(".dropdown")) {
      isShow.value = false;
    }
  });
});
</script>
