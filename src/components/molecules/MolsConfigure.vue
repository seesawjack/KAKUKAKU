<template>
  <div>
    <atmos-configure class="dropdown" @show-drop="showDropDown">
      <template #otherConfigure>
        <!-- 播放音樂 -->
        <div class="group relative max-md:mx-2 my-2 cursor-pointer" @click="stopVideo">
          <span
            class="max-md:!hidden hidden w-20 absolute top-[2px] left-7 text-sm bg-slate-600 rounded-xl group-hover:inline">{{
              isPlayVideo ? '取消播放' : '播放音樂' }}</span>
          <atmos-svg-icon :name="!isPlayVideo ? 'icon_play_video' : 'icon_pause_video'"
            :class="{ 'is-click': isPlayVideo }" />
        </div>
        <!-- 更換影片 -->
        <div v-if="!isRecommendListPage" class="group relative max-md:hidden max-md:mx-2 my-2  pr-1 cursor-pointer" @click="chagneVideo">
          <span
            class="max-md:!hidden hidden w-20 absolute top-[2px] left-7 text-sm bg-slate-600 rounded-xl group-hover:inline">更換影片</span>
          <atmos-svg-icon name="icon_song_change" class="translate-x-[2px] w-[22px]" />
        </div>
        <!-- 鎖定影片 -->
        <div class="group relative max-md:mx-2 my-2 cursor-pointer" @click="lockVideo">
          <span
            class="max-md:!hidden hidden w-20 absolute top-[2px] left-7 text-sm bg-slate-600 rounded-xl group-hover:inline">{{
              isLock ? '取消固定' : '固定影片' }}</span>
          <atmos-svg-icon :name="!isLock ? 'icon_lock_open' : 'icon_lock_close'"
            :class="{ 'translate-x-[2px] w-[22px]': !isLock, 'is-click w-[22px]': isLock }" />
        </div>
        <!-- 調整螢幕長寬 -->
        <div class="group relative max-md:hidden flex items-center max-md:mx-2 my-2 h-6 cursor-pointer"
          @click="changeScreen">
          <span
            class="max-md:!hidden hidden w-20 absolute top-[2px] left-7 text-sm bg-slate-600 rounded-xl group-hover:inline">{{
              selected.dramaMode ? '正常模式' : '劇院模式' }}</span>
          <div class="border-2 h-4 round-sm w-[20px]" :class="{ 'is-dramaMode': selected.dramaMode }"></div>
        </div>
        <!-- 推薦音歌曲 -->
        <div v-if="!isRecommendListPage" class="group relative max-md:hidden max-md:mx-2 my-2 cursor-pointer"
          @click="recommendSong">
          <span
            class="max-md:!hidden hidden w-20 absolute top-[2px] left-7 text-sm bg-slate-600 rounded-xl group-hover:inline">{{
              selected.isRecommend.state ? '已推薦歌曲' : '推薦歌曲' }}</span>
          <atmos-svg-icon name="icon_recommend" class="translate-x-[2px] w-[22px]"
            :class="{ 'is-click': selected.isRecommend.state }" />
        </div>
      </template>
    </atmos-configure>
    <atmos-drop-down class="dropdown max-md:top-10 -top-2 max-md:-left-[5.6rem] left-8 py-2 px-3" :show="isShow">
      <!-- 歌詞選項 -->
      <div v-if="route.path.indexOf('song/item') > 0">
        <!-- ▼單選 文字大小 -->
        <div>
          <p class="text-left">文字大小</p>
          <div class="flex justify-between items-end mt-3">
            <label :for="font.id" v-for="(font, index) in lyricsFont" :key="index"
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
        <!-- ▼下拉式選單 歌詞形式 -->
        <div>
          <p class="text-left">歌詞形式</p>
          <select v-model="selectedLabelType" class="w-full mt-2 p-1 bg-slate-500 rounded-md outline-none">
            <option value="all-hiragana">全平假名</option>
            <option value="only-kanji">漢字(無標註發音)</option>
            <option value="kanji-rubi" selected>漢字(有標註發音)</option>
            <option value="plus-romaji">羅馬字</option>
          </select>
        </div>
        <hr class="max-md:hidden border-gray-200 dark:border-gray-500 my-3" />
        <!-- ▼開關 時間戳記 -->
        <div v-if="!isRecommendListPage" class="max-md:hidden">
          <label for="timeStamp" class="w-full relative inline-flex justify-between items-center cursor-pointer">
            <input type="checkbox" id="timeStamp" v-model="timeStamp" class="sr-only peer" />
            <div
              class="w-11 h-6 bg-gray-200 rounded-full peer dark:bg-gray-500 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-gray-300">
            </div>
            <span class="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300">時間戳記</span>
          </label>
          <hr class="max-md:hidden border-gray-200 dark:border-gray-500 my-3" />
        </div>
        <!-- ▼開關 單句重播 -->
        <div class="max-md:hidden">
          <label for="loopLyric" class="w-full relative inline-flex justify-between items-center cursor-pointer">
            <input type="checkbox" id="loopLyric" v-model="loopLyric" class="sr-only peer" />
            <div
              class="w-11 h-6 bg-gray-200 rounded-full peer dark:bg-gray-500 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-gray-300">
            </div>
            <span class="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300">單句重播</span>
          </label>
        </div>
      </div>
    </atmos-drop-down>
    <atmos-popup v-if="showPopup" title="請貼上新的影片連結" :content="popupText" :button="buttonText"
      @buttonClick="handlePopupClick">
      <template #inputContent>
        <atmos-input id="songName" class="w-full max-sm:text-sm mx-auto my-3" :inputTips="'請輸入影片連結'"
          :inputClass="'w-full block py-3 pl-3 text-black rounded-lg bg-gray-300 '" :error-message="errorMsg"
          v-model.trim="videoURL" />
      </template>
    </atmos-popup>
  </div>
</template>

<script setup>
import { ref, toRefs, computed, watch, onMounted, onUnmounted } from "vue";
import { useLyricStore } from "../../stores/song";
import { useRoute } from "vue-router";
import { useYoutubeStore } from "../../stores/youtube";
import { useRegexStore } from "../../stores/regex";

import AtmosDropDown from "../atmos/AtmosDropDown.vue";
import AtmosConfigure from "../atmos/AtmosConfigure.vue";
import AtmosSvgIcon from "../atmos/AtmosSvgIcon.vue";
import AtmosInput from "../atmos/AtmosInput.vue";
import AtmosPopup from "../atmos/AtmosPopup.vue";

const route = useRoute();
const {
  songPageOption: { lyricsFont, selected }
} = useLyricStore();

const { songIdRegex } = useRegexStore();

const isRecommendListPage = computed(() => {
  return route.query.recommend === "true" ? true : false;
});

const { controlVideoPlay, changeVideoId } = useYoutubeStore();
const { isPlayVideo } = toRefs(useYoutubeStore());

const selectedLabelType = ref("kanji-rubi");

function stopVideo() {
  isPlayVideo.value = !isPlayVideo.value;
  controlVideoPlay(isPlayVideo.value);
}

const showPopup = ref(false);
const popupText = `
  <ul class="list-disc pl-3">
    <li>更換影片連結後，還需要下滑到頁面底部點擊「儲存修改/確認修改」按鈕才成功。</li>
    <li>由於新影片時間長度不一定與原影片吻合，故已設定的時間戳記有可能會不符合影片時間進度</li>
  </ul>`;
const buttonText = ['確定', '取消'];
const videoURL = ref('');
const errorMsg = ref('')
function chagneVideo() {
  showPopup.value = true
}

function handlePopupClick(clickType) {
  if (clickType) {
    const result = songIdRegex(videoURL.value);
    if (!result) {
      errorMsg.value = '無法解析影片連結，請確認輸入內容是否正確';
      return;
    }
    changeVideoId(result);
  }
  showPopup.value = false;
  errorMsg.value = ''

}

const isLock = ref(false);
function lockVideo() {
  isLock.value = !isLock.value;
  selected.fixedVideo = isLock.value;
}

function recommendSong() {
  selected.isRecommend.state = !selected.isRecommend.state;
}

const isShow = ref(false);
function showDropDown() {
  isShow.value = !isShow.value;
}
const fontSelect = ref("middle");
const timeStamp = ref(false);
const loopLyric = ref(false);

function changeScreen() {
  selected.dramaMode = !selected.dramaMode;
}

watch(fontSelect, () => {
  selected.fontSize = fontSelect.value
});

watch(selectedLabelType, () => {
  selected.labelType = selectedLabelType.value;
});

watch(timeStamp, () => {
  selected.timeStamp = timeStamp.value;
});

watch(loopLyric, () => {
  selected.loopLyric = loopLyric.value;
});

const notClickDropdown = () => {
  if (!event.target.closest(".dropdown")) {
    isShow.value = false;
  }
};

onMounted(() => {
  document.addEventListener("click", notClickDropdown);
});

onUnmounted(() => {
  document.body.removeEventListener("click", notClickDropdown);
});
</script>

<style scoped>
.is-click {
  color: rgb(147, 197, 253);
  filter: drop-shadow(0px 0px 3px rgb(147, 197, 253, 0.8));
}

.is-dramaMode {
  border-color: rgb(147, 197, 253);
  filter: drop-shadow(0px 0px 3px rgb(147, 197, 253, 0.8));
}
</style>
