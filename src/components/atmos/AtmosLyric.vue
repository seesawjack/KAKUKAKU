<template>
  <div>
    <div v-if="windowWidth > 768" class="relative overflow-hidden flex-col items-center bg-black pt-1 pb-3 min-h-[104.5px]"
      :class="[font, className]">
      <div class="absolute w-full left-1/2 translate-x-[-50%]">
        <template v-for="(lyric, index) in lyrics" :key="index">
          <div v-if="lyricDisplay(index) || lyricDisplay(index - 1)">
            <p class="init tracking-[2px] test-ly leading-[2.75rem]"
              :class="{ 'text-slate-400': lyricDisplay(index - 1) }" v-html="lyric">
            </p>
            <p v-if="selected.labelType === 'all-hiragana'" class=" hiraganatracking-[2px] test-ly leading-[2.75rem]"
              :class="{ 'text-slate-400': lyricDisplay(index - 1) }" v-html="hiraganaLyrics[index]">
            </p>
          </div>
        </template>
      </div>
    </div>
    <div class="lyric mt-5 text-left bg-slate-950/60 px-3 py-2 rounded-xl" :class="[font, className]">
      <template v-for="(lyric, index) in lyrics" :key="index">
        <div class="group relative lyric"
          :class="{ 'mt-10': spaceIndex.indexOf(index) > -1, 'max-w-[830px]': !selected.dramaMode, 'max-w-[1270px]': selected.dramaMode }"
          v-if="lyric !== ''">
          <p class="init tracking-[2px] test-ly flex-wrap pr-6"
            :class="{ 'font-medium text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-violet-400 [text-shadow:_0_0_10px_#075985] caret-white	': lyricDisplay(index) }"
            ref="initLyric" v-html="lyric">
          </p>
          <p class="hiragana flex-wrap  pr-6" v-html="hiraganaLyrics[index]"
            :class="{ 'font-medium text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-violet-400 [text-shadow:_0_0_10px_#075985] caret-white	': lyricDisplay(index) }">
          </p>
          <p class="romaji flex-wrap  pr-6" v-html="romajiLyrics[index]"></p>
          <div class="cursor-pointer absolute h-5 top-3 -left-12 "
            :class="{ 'hidden': !selected.timeStamp, 'clock-selected': lyricTimeStamp[index] }">
            <clock-icon @click="selectTimeStamp(index)" />
            <span class="text-xs block translate-x-[-5px] translate-y-0">{{ lyricTimeStamp[index]?.slice(3, 8) }}</span>
          </div>
          <div
            class="absolute top-1/2 -translate-y-[50%] right-0 bg-slate-500/50 rounded-lg after:content-['1'] after:absolute after:top-1 after:text-xs after:left-[0.55rem]  hidden"
            :class="[{ '!block': selected.loopLyric }, loopIconStyle(index)]" @click="seekTo(index)">
            <loop-icon />
          </div>
          <div class="bg-slate-800 border border-slate-50/10 rounded-lg py-3 px-2 mt-2"
            :class="{ 'hidden': index !== +editId }">
            <input type="text" class="w-full bg-slate-900 caret-white outline-none" v-model="clickHiragana">
            <p>{{ clickHanji }}</p>
            <div class="flex">
              <button class="w-full text-sm border rounded-lg py-1 px-5 mt-3 hover:bg-slate-600 mr-3"
                @click="editId = -1">取消</button>
              <button class="w-full text-sm border rounded-lg py-1 px-5 mt-3 hover:bg-sky-400/50"
                @click="editHiragana">修改</button>
            </div>

          </div>
        </div>
        <br v-if="lyric == ''">
        <div v-if="lyric !== ''" class="my-3" :class="{ 'line': index !== lyrics.length - 1 }"></div>
      </template>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, toRefs, onMounted, onUnmounted } from "vue";
import { useLyricStore } from "../../stores/lyric";
import { useYoutubeStore } from "../../stores/youtube";
import ClockIcon from "../svg/ClockIcon.vue";
import LoopIcon from "../svg/LoopIcon.vue";

const props = defineProps({
  lyrics: {
    type: Array,
    required: true,
  },
  className: {
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
  }
});

const lyricStore = useLyricStore();
const { lyricConfiguration, editLyric } = lyricStore;
const { timeStampState, lyricTimeStamp, spaceIndex } = toRefs(useLyricStore());
const { fontSize, selected } = toRefs(lyricConfiguration);


function loopIconStyle(index) {
  if (Object.keys(lyricTimeStamp.value).indexOf(index.toString()) > -1) {
    return 'text-white after:text-white cursor-pointer'
  } else {
    return 'after:text-slate-500 cursor-not-allowed text-slate-500'
  }
}
function selectTimeStamp(index) {
  if (!timeStampState.value) return;

  lyricTimeStamp.value[index] = timeStampState.value.slice(-1)[0];
}

function lyricDisplay(index) {
  const theMoment = timeStampState.value.slice(-1)[0];
  const nowLyricTime = lyricTimeStamp.value[index];
  const nextIndex = Object.keys(lyricTimeStamp.value)?.indexOf(index.toString()) + 1
  const nextLyricTime = lyricTimeStamp.value[Object.keys(lyricTimeStamp.value)[nextIndex]];

  const lastLyric = +Object.keys(lyricTimeStamp.value).slice(-1)[0];
  return theMoment >= nowLyricTime
    && (theMoment <= nextLyricTime
      || index === lastLyric)
}

const font = ref("text-xl");
watch(
  () => selected.value.fontSize,
  () => {
    font.value = fontSize.value[selected.value.fontSize].class[0];
  }
);

const clickHiragana = ref('')
const initHiragana = ref('')
const clickHanji = ref('')
const editId = ref(-1);

const { controlVideoPlay, controlSeekTo } = useYoutubeStore();
const { isPlayVideo } = toRefs(useYoutubeStore());

function seekTo(index) {
  controlSeekTo(lyricTimeStamp.value[index]);
  isPlayVideo.value = true;
  controlVideoPlay(isPlayVideo.value)
}

function editHiragana() {
  editLyric({ init: initHiragana.value, edit: clickHiragana.value, index: editId.value })
  editId.value = -1
}

let windowWidth = ref(window.innerWidth);
const onWidthChange = () => windowWidth.value = window.innerWidth;

const editRubi = () => {
  if (event.target.closest('.hanji-word')) {
    const text = event.target.textContent.split(/[()]/g);
    const index = event.target.dataset.index;
    clickHanji.value = text[0];
    clickHiragana.value = text[1];
    initHiragana.value = text[1];
    editId.value = index;
  }
  return;
}

onMounted(() => {
  document.addEventListener("click", editRubi);
  document.addEventListener('resize', onWidthChange);
});

onUnmounted(() => {
  document.removeEventListener("click",editRubi);
  document.removeEventListener('resize', onWidthChange);
})
</script>

<style scoped>
.line {
  border-style: inset;
  border-top-width: 1px;
  height: 1px;
}

rt {
  display: none;
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
</style>