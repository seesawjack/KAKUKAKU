<template>
  <div class="lyric mt-5 text-left bg-slate-950/60 px-3 py-2 rounded-xl" :class="[font, className]">
    <template v-for="(lyric, index) in lyrics" :key="index">
      <div class="group relative lyric">
        <p class="init tracking-[2px] test-ly" ref="initLyric" :contenteditable="index === +editId" v-html="lyric"></p>
        <p class="hiragana" v-html="hiraganaLyrics[index]"></p>
        <p class="romaji" v-html="romajiLyrics[index]"></p>
        <div class="cursor-pointer absolute h-5  top-3 right-0 ">
          <edit-icon class="hidden group-hover:block" @click="editHiragana(index)"
            :class="{ 'pen-shadow': index === +editId }" />
        </div>
        <div class="cursor-pointer absolute h-5 top-3 -left-12 ">
          <clock-icon
            :class="{ 'hidden': !selected.timeStamp, 'clock-shadow': timeStampId.indexOf(index) > -1}"
            @click="selectTimeStamp(index)" />
        </div>
      </div>
      <div v-if="index !== lyrics.length - 1" class="line border-t h-px my-4"></div>
    </template>
  </div>
</template>

<script setup>
import { ref, watch, toRefs } from "vue";
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
const { fontSize, selected } = toRefs(lyricConfiguration);

const editId = ref(-1);
const editedLyric = ref([]);
const initLyric = ref([]);

function editHiragana(index) {
  if (editedLyric.value.indexOf(index) < 0) {
    editedLyric.value.push(index);
  }
  editId.value = editId.value === index ? -1 : index;
  if (editId.value === -1) {
    editedLyric.value.map(editIndex => {
      editLyric({
        lyric: {
          mix: initLyric.value[editIndex].innerHTML,
          pure: initLyric.value[editIndex].innerText.replace(/[^\u3040-\u309F]/g, '')
        },
        index: editIndex
      })
    })
  }
}

const timeStampId = ref([]);
function selectTimeStamp(index) {
  if (timeStampId.value.indexOf(index) < 0) {
    timeStampId.value.push(index);
  }
}

const font = ref("text-xl");
watch(
  () => selected.value.fontSize,
  () => {
    font.value = fontSize.value[selected.value.fontSize].class[0];
  }
);
</script>

<style scoped>
.line {
  border-style: inset;
}

rt {
  display: none;
}

.pen-shadow{
  display: block !important;
  color: rgb(75, 150, 241);
  filter: drop-shadow(0px 0px 3px rgba(120, 192, 255, 1));
}

.clock-shadow {
  color: rgb(255, 168, 114);
  filter: drop-shadow(0px 0px 3px rgb(248,255,170,0.8));
}
</style>