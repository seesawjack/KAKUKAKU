<template>
  <div>
    <!-- 影片下的歌詞字幕 -->
    <div
      v-if="windowWidth > 768"
      class="relative overflow-hidden flex-col items-center bg-black pt-1 pb-3 min-h-[104.5px]"
      :class="[font, selected.labelType]"
    >
      <div
        class="absolute w-full left-1/2 translate-x-[-50%]"
        :class="{ 'is-recommend-state': route.query.recommend === 'true' }"
      >
        <template v-for="(lyric, index) in furiganaLyrics" :key="index">
          <div v-if="lyricsStyle(index) || lyricsStyle(index - 1)">
            <p
              class="init tracking-[2px] test-ly leading-[2.75rem]"
              :class="{ 'text-slate-400': lyricsStyle(index - 1) }"
              v-html="lyric"
            ></p>
            <p
              v-if="selected.labelType === 'all-hiragana'"
              class="hiraganatracking-[2px] test-ly leading-[2.75rem]"
              :class="{ 'text-slate-400': lyricsStyle(index - 1) }"
              v-html="hiraganaLyrics[index]"
            ></p>
          </div>
        </template>
      </div>
    </div>
    <!-- 整體歌詞 -->
    <div
      class="lyric mt-5 text-left bg-slate-950/60 px-3 py-2 rounded-xl"
      :class="[font, selected.labelType]"
    >
      <template v-for="(lyric, index) in furiganaLyrics" :key="index">
        <div
          v-if="lyric !== ''"
          class="group relative lyric"
          :class="{
            'mt-10': spaceIndex.indexOf(index) > -1,
            'is-recommend-state': route.query.recommend === 'true',
          }"
        >
          <!-- 振假名歌詞 -->
          <p
            class="init tracking-[2px] test-ly flex-wrap pr-6 hover:no-underline"
            :class="{ 'sentence-play': lyricsStyle(index) }"
            v-html="lyric"
          ></p>
          <!-- 平假名歌詞 -->
          <p
            class="hiragana flex-wrap pr-6"
            :class="{ 'sentence-play': lyricsStyle(index) }"
            v-html="hiraganaLyrics[index]"
          ></p>
          <!-- 羅馬字歌詞 -->
          <p class="romaji flex-wrap pr-6" v-html="romajiLyrics[index]"></p>
          <!-- 時間戳記icon -->
          <div
            class="cursor-pointer absolute h-5 top-3 -left-12"
            :class="{
              hidden: !selected.timeStamp,
              'clock-selected': lyricTimeStamp[index],
            }"
          >
            <clock-icon @click="selectTimeStamp(index)" />
            <span class="text-xs block translate-x-[-5px] translate-y-0">{{
              lyricTimeStamp[index]?.slice(3, 8)
            }}</span>
          </div>
          <!-- 單句循環icon -->
          <div
            class="absolute top-1/2 -translate-y-[50%] right-0 bg-slate-500/50 rounded-lg after:content-['1'] after:absolute after:top-1 after:text-xs after:left-[0.55rem] hidden"
            :class="[
              {
                '!block': selected.loopLyric,
                'top-5': index === +sentenceIndex,
              },
              loopIconStyle(index),
            ]"
            @click="seekTo(index)"
          >
            <loop-icon />
          </div>
          <!-- 振假名修改功能 -->
          <div
            class="bg-slate-800 border border-slate-50/10 rounded-lg py-3 px-2 mt-2"
            :class="{ hidden: index !== +sentenceIndex }"
          >
            <input
              type="text"
              class="w-full bg-slate-900 caret-white outline-none"
              v-model="editHiraganaWord"
            />
            <p>{{ furiganaWord }}</p>
            <div class="flex">
              <button
                class="w-full text-sm border rounded-lg py-1 px-5 mt-3 hover:bg-slate-600 mr-3"
                @click="sentenceIndex = -1"
              >
                取消
              </button>
              <button
                class="w-full text-sm border rounded-lg py-1 px-5 mt-3 hover:bg-sky-400/50"
                @click="furiganaEdit"
              >
                修改
              </button>
            </div>
          </div>
        </div>
        <br v-if="lyric == ''" />
        <div
          v-if="lyric !== ''"
          class="my-3"
          :class="{ 'lyric-line': index !== furiganaLyrics.length - 1 }"
        ></div>
      </template>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, toRefs, onMounted, onUnmounted } from "vue";
import { useRoute } from "vue-router";
import { useLyricStore } from "../../stores/song";
import { useYoutubeStore } from "../../stores/youtube";
import ClockIcon from "../svg/ClockIcon.vue";
import LoopIcon from "../svg/LoopIcon.vue";

const props = defineProps({
  furiganaLyrics: {
    type: Array,
    required: true,
  },
  hiraganaLyrics: {
    type: Array,
    required: true,
  },
  romajiLyrics: {
    type: Array,
    required: true,
  },
});

const route = useRoute();

const {
  songPageOption: { lyricsFont, selected },
  handleFuriganaEdit,
} = useLyricStore();
const { timeStampState, lyricTimeStamp, spaceIndex } = toRefs(useLyricStore());

const font = computed(() => lyricsFont[selected.fontSize].class[0]);

const windowWidth = ref(window.innerWidth);
const onWidthChange = () => (windowWidth.value = window.innerWidth);

//單句循環 icon 根據是否以下時間戳記改變 css
function loopIconStyle(index) {
  return Object.keys(lyricTimeStamp.value).indexOf(index.toString()) > -1
    ? "text-white after:text-white cursor-pointer"
    : "after:text-slate-500 cursor-not-allowed text-slate-500";
}

function selectTimeStamp(index) {
  if (!timeStampState.value) return;
  lyricTimeStamp.value[index] = timeStampState.value.slice(-1)[0];
}

//歌詞根據時間戳記改變 css
function lyricsStyle(index) {
  const theMoment = timeStampState.value.slice(-1)[0];
  const nowLyricTime = lyricTimeStamp.value[index];
  const nextIndex =
    Object.keys(lyricTimeStamp.value)?.indexOf(index.toString()) + 1;
  const nextLyricTime =
    lyricTimeStamp.value[Object.keys(lyricTimeStamp.value)[nextIndex]];

  const lastLyric = +Object.keys(lyricTimeStamp.value).slice(-1)[0];
  return (
    theMoment >= nowLyricTime &&
    (theMoment <= nextLyricTime || index === lastLyric)
  );
}

const furiganaWord = ref("");
const editHiraganaWord = ref("");
const initHiraganaWord = ref("");
const sentenceIndex = ref(-1);

const { controlVideoPlay, controlSeekTo } = useYoutubeStore();
const { isPlayVideo } = toRefs(useYoutubeStore());

//跳轉到指定影片時間
function seekTo(index) {
  controlSeekTo(lyricTimeStamp.value[index]);
  isPlayVideo.value = true;
  controlVideoPlay(isPlayVideo.value);
}
//振假名編輯
function furiganaEdit() {
  handleFuriganaEdit({
    init: initHiraganaWord.value,
    edit: editHiraganaWord.value,
    index: sentenceIndex.value,
  });
  sentenceIndex.value = -1;
}
//判斷點擊到振假名
const clickFurigana = () => {
  if (event.target.closest(".kanji-word")) {
    const text = event.target.textContent.split(/[()]/g);
    const index = event.target.dataset.index;

    furiganaWord.value = text[0];
    initHiraganaWord.value = text[1];
    editHiraganaWord.value = text[1];
    sentenceIndex.value = index;
  }
  return;
};

onMounted(() => {
  if (route.query.recommend !== "true") {
    document.addEventListener("click", clickFurigana);
  }
  document.addEventListener("resize", onWidthChange);
});

onUnmounted(() => {
  if (route.query.recommend !== "true") {
    document.removeEventListener("click", clickFurigana);
  }
  document.removeEventListener("resize", onWidthChange);
});
</script>

<style>
.lyric-line {
  border-style: inset;
  border-top-width: 1px;
  height: 1px;
}

.pen-shadow {
  display: block !important;
  color: rgb(75, 150, 241);
  filter: drop-shadow(0px 0px 3px rgba(120, 192, 255, 1));
}

.clock-selected {
  color: rgb(147, 197, 253);
  filter: drop-shadow(0px 0px 3px rgb(147, 197, 253, 0.8));
}

.kanji-word:hover {
  text-decoration: underline;
  cursor: pointer;
}

.is-recommend-state .kanji-word:hover {
  text-decoration: none;
  cursor: unset;
}
.sentence-play {
  color: #93c5fd;
  text-shadow: #075985 0 0 10px;
  font-weight: 500;
}
</style>
