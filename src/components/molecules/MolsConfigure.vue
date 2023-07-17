<template>
  <div>
    <atmos-configure class="dropdown" @show-drop="showDropDown">
      <template #otherConfigure>
        <div class="my-3 cursor-pointer" @click="stopVideo">
          <play-video-icon v-if="!isPlayVideo" />
          <pause-video-icon v-else />
        </div>
        <div class="my-3 cursor-pointer" @click="lockVideo">
          <lock-open-icon class="translate-x-[2px]  w-[22px]" v-if="!isLock" />
          <lock-close-icon class="is-lock w-[22px]"  v-else />
        </div>
        <div class="flex items-center my-3 h-6 cursor-pointer" @click="screenToChange">
          <div class="border-2 h-4 round-sm w-[20px]" :class="{'is-dramaMode':selected.dramaMode}"></div>
        </div>
      </template>
    </atmos-configure>
    <atmos-drop-down class="dropdown -top-2 left-8 py-2 px-3" :show="isShow">
      <!-- 歌詞選項 -->
      <div v-if="route.path === '/song'">
        <!-- ▼單選 文字大小 -->
        <div>
          <p class="text-left">文字大小</p>
          <div class="flex justify-between items-end mt-3">
            <label :for="font.id" v-for="(font, index) in fontSize" :key="index"
              class="border cursor-pointer hover:bg-slate-500 w-10 h-10 rounded-lg" :class="[
                font.class,
                {
                  'bg-slate-900': font.id === fontSelect,
                  'text-blue-400': font.id === fontSelect,
                },
              ]">
              <input type="radio" hidden :id="font.id" :value="font.id" v-model="fontSelect" />
              <p>
                {{ font.name }}
              </p>
            </label>
          </div>
        </div>
        <hr class="border-gray-200 dark:border-gray-500 my-3" />
        <!-- ▼下拉式選單 標註形式 -->
        <div>
          <p class="text-left">標註形式</p>
          <select v-model="selectedLabelType" class="w-full mt-2 p-1 bg-slate-500 rounded-md">
            <option value="all-hiragana">全平假名</option>
            <option value="only-hanji">漢字(無標註發音)</option>
            <option value="hanji-rubi" selected>漢字(有標註發音)</option>
            <option value="plus-romaji">羅馬字</option>
          </select>
        </div>
        <hr class="border-gray-200 dark:border-gray-500 my-3" />
        <!-- ▼開關 時間戳記 -->
        <div>
          <label for="timeStamp" class="w-full relative inline-flex justify-between items-center cursor-pointer">
            <input type="checkbox" id="timeStamp" v-model="timeStamp" class="sr-only peer" />
            <div
              class="w-11 h-6 bg-gray-200 rounded-full peer dark:bg-gray-500 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-gray-300">
            </div>
            <span class="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300">時間戳記</span>
          </label>
        </div>
        <hr class="border-gray-200 dark:border-gray-500 my-3" />
        <!-- ▼開關 單句循環 -->
        <div>
          <label for="loopLyric" class="w-full relative inline-flex justify-between items-center cursor-pointer">
            <input type="checkbox" id="loopLyric" v-model="loopLyric" class="sr-only peer" />
            <div
              class="w-11 h-6 bg-gray-200 rounded-full peer dark:bg-gray-500 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-gray-300">
            </div>
            <span class="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300">單句循環</span>
          </label>
        </div>
      </div>
    </atmos-drop-down>
  </div>
</template>

<script setup>
import { ref, toRefs, watch, onMounted, onBeforeUnmount } from "vue";
import { useLyricStore } from "../../stores/lyric";
import { useRoute } from "vue-router";
import { useYoutubeStore } from "../../stores/youtube";

import AtmosDropDown from "../atmos/AtmosDropDown.vue";
import AtmosConfigure from "../atmos/AtmosConfigure.vue";
import PlayVideoIcon from "../svg/PlayVideoIcon.vue";
import PauseVideoIcon from "../svg/PauseVideoIcon.vue";
import LockCloseIcon from "../svg/LockCloseIcon.vue";
import LockOpenIcon from "../svg/LockOpenIcon.vue";

const route = useRoute();
const {
  lyricConfiguration: { fontSize, selected },
  selectedFontStyle,
} = useLyricStore();

const { controlVideoPlay,changeScreen } = useYoutubeStore();
const { isPlayVideo } = toRefs(useYoutubeStore());

const selectedLabelType = ref('hanji-rubi')

function stopVideo() {
  isPlayVideo.value = !isPlayVideo.value
  controlVideoPlay(isPlayVideo.value)
}

const isLock = ref(false);
function lockVideo() {
  isLock.value = !isLock.value;
  selected.fixedVideo = isLock.value;
}

const isShow = ref(false);
function showDropDown() {
  isShow.value = !isShow.value;
}
const fontSelect = ref("middle");
const timeStamp = ref(false);
const loopLyric = ref(false);

function screenToChange(){
  selected.dramaMode = !selected.dramaMode
  changeScreen(selected.dramaMode)
}

watch(fontSelect, () => {
  selectedFontStyle(fontSelect.value);
});


watch(selectedLabelType, () => {
  selected.labelType = selectedLabelType.value;
});


watch(timeStamp, () => {
  selected.timeStamp = timeStamp.value;
});

watch(loopLyric, () => {
  selected.loopLyric = loopLyric.value
})

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

<style scoped>
.is-lock {
  color: rgb(147, 197, 253);
  filter: drop-shadow(0px 0px 3px rgb(147, 197, 253, 0.8));
}

.is-dramaMode{
  border-color: rgb(147, 197, 253);
  filter: drop-shadow(0px 0px 3px rgb(147, 197, 253, 0.8));
}
</style>
