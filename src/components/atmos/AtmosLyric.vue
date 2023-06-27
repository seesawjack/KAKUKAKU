<template>
  <div class="lyric mt-5 text-left bg-slate-950/60 px-3 py-2 rounded-xl" :class="[font, className]">
    <template v-for="(lyric, index) in lyrics" :key="index">
      <div class="group relative lyric">
        <p class="init tracking-[2px] test-ly" ref="initLyric" :contenteditable="index === +nowId" v-html="lyric"></p>
        <p class="hiragana" v-html="hiraganaLyrics[index]"></p>
        <p class="romaji" v-html="romajiLyrics[index]"></p>
        <div class="cursor-pointer absolute h-5  top-3 right-0 ">
          <edit-icon class="hidden group-hover:block" @click="editHiragana(index)"
            :class="{ 'isShow': index === +nowId }" />
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

const nowId = ref(-1);
const editedLyric = ref([]);
const initLyric = ref([]);

function editHiragana(index) {
  if (editedLyric.value.indexOf(index) < 0) {
    editedLyric.value.push(index);
  }
  nowId.value = nowId.value === index ? -1 : index;
  if (nowId.value === -1) {
    editedLyric.value.map(editIndex => {
      // editLyric(initLyric.value[editIndex].innerHTML, editIndex)
      editLyric({
        lyric: {
          mix: initLyric.value[editIndex].innerHTML,
          pure: initLyric.value[editIndex].innerText.replace(/[^\u3040-\u309F]/g, '')
        },
        index: editIndex
      })
    })
  }
  // emits('edit', e);
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

.isShow {
  display: block !important;
  color: rgb(129, 177, 255);
}
</style>