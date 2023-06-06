<template>
  <div
    class="lyric mt-5 text-left bg-slate-950/60 px-3 py-2 rounded-xl"
    :class="[font, className]"
  >
    <template v-for="(lyric, index) in lyrics" :key="index">
      <div class="tracking-[2px]" v-html="lyric"></div>
      <div
        v-if="index !== lyrics.length - 1"
        class="line border-t h-px my-4"
      ></div>
    </template>
  </div>
</template>

<script setup>
import { ref, watch,toRefs } from "vue";
import { useLyricStore } from "../../stores/lyric";

const props = defineProps({
  lyrics: {
    type: Array,
    required: true,
  },
  className: {
    type: Array,
    required: true,
  },
});

const lyricStore = useLyricStore();
const { lyricConfiguration } = lyricStore;
const { fontSize, selected } = toRefs(lyricConfiguration);
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
</style>