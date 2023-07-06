<template>
  <div class="lyric mt-5 text-left bg-slate-950/60 px-3 py-2 rounded-xl" :class="[font, className]">
    <template v-for="(lyric, index) in lyrics" :key="index">
      <div class="group relative lyric">
        <p class="init tracking-[2px] test-ly"
          :class="{ 'font-medium text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-violet-400 [text-shadow:_0_0_10px_#075985] caret-white	': lyricDisplay(index) }"
          ref="initLyric" v-html="lyric">
        </p>
        <p class="hiragana" v-html="hiraganaLyrics[index]"></p>
        <p class="romaji" v-html="romajiLyrics[index]"></p>
        <!-- <div class="cursor-pointer absolute h-5 top-3 right-0 ">
          <edit-icon class="hidden group-hover:block" @click="editHiragana(index)"
            :class="{ 'pen-shadow': index === +editId }" />
        </div> -->
        <div class="cursor-pointer absolute h-5 top-3 -left-12 "
          :class="{ 'hidden': !selected.timeStamp, 'clock-selected': lyricTimeStamp[index] }">
          <clock-icon @click="selectTimeStamp(index)" />
          <span class="text-xs block translate-x-[-5px] translate-y-0">{{ lyricTimeStamp[index]?.slice(3, 8) }}</span>
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
      <div v-if="index !== lyrics.length - 1" class="line border-t h-px my-4"></div>
    </template>
  </div>
</template>

<script setup>
import { ref, watch, toRefs, onMounted } from "vue";
import { useLyricStore } from "../../stores/lyric";
import EditIcon from "../svg/EditIcon.vue";
import ClockIcon from "../svg/ClockIcon.vue";

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
const { timeStampState, lyricTimeStamp } = toRefs(useLyricStore());
const { fontSize, selected } = toRefs(lyricConfiguration);

// const editedLyric = ref([]);
// const initLyric = ref([]);

// function editHiragana(index) {
//   if (editedLyric.value.indexOf(index) < 0) {
//     editedLyric.value.push(index);
//   }
//   editId.value = editId.value === index ? -1 : index;
//   if (editId.value === -1) {
//     editedLyric.value.map(editIndex => {
//       editLyric({
//         lyric: {
//           mix: initLyric.value[editIndex].innerHTML,
//           pure: initLyric.value[editIndex].innerText.replace(/[^\u3040-\u309F]/g, '')
//         },
//         index: editIndex
//       })
//     })
//   }
// }

function selectTimeStamp(index) {
  if (!timeStampState.value) return;

  if (Object.keys(lyricTimeStamp.value).indexOf(index) < 0) {
    lyricTimeStamp.value[index] = timeStampState.value.slice(-1)[0];
  }
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

function editHiragana() {
  editLyric({ init: initHiragana.value, edit: clickHiragana.value, index: editId.value })
  editId.value = -1
}

onMounted(() => {
  document.addEventListener("click", () => {
    if (event.target.closest('.hanji-word')) {
      const text = event.target.textContent.split(/[()]/g);
      const index = event.target.dataset.index;
      clickHanji.value = text[0];
      clickHiragana.value = text[1];
      initHiragana.value = text[1];
      editId.value = index;

    }
    return;
  });
});
</script>

<style scoped>
.line {
  border-style: inset;
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