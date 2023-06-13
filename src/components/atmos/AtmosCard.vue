<template>
  <div class="group flex items-center">
    <component
      :is="href ? 'a' : 'div'"
      @click="selected"
      :href="href"
      class="flex justify-center text-left w-full"
    >
      <div class="w-full max-w-[120px] relative mx-auto md:mx-0">
        <p
          v-if="!href"
          class="text-xs absolute top-[-30px] bg-red-500 rounded-md p-1"
        >
          已選歌曲
        </p>
        <div
          class="w-full relative before:block before:pb-[56%] overflow-hidden"
        >
          <picture>
            <source
              :srcset="songDetail.url"
              :media="`(min-width: ${songDetail.width}px)`"
              :width="songDetail.width"
              :height="songDetail.height"
            />
            <img
              :srcset="songDetail.url"
              :width="songDetail.width"
              :height="songDetail.height"
              :alt="songDetail.title"
              class="img-to-cover transition-transform group-hover:scale-[125%]"
            />
          </picture>
        </div>
      </div>
      <div
        class="w-full max-w-[500px] pl-5 transition-all hover:bg-slate-300/[0.2]"
      >
        <p class="line-clamp">{{ songDetail.title }}</p>
        <div class="text-xs text-slate-500 leading-5">
          <p>{{ songDetail.subTitle }}</p>
        </div>
      </div>
    </component>
    <div v-if="isAdded" class="w-[22.5px] relative">
      <more-icon
        @click="showDropDown(songDetail.id)"
        class="hidden group-hover:block cursor-pointer"
        :class="{ isShow: isShow }"
      />
      <atmos-drop-down class="top-4 right-3" :show="isShow">
        <p>刪除</p>
      </atmos-drop-down>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from "vue";
import { useLyricStore } from "../../stores/lyric";
import MoreIcon from "../svg/MoreIcon.vue";
import AtmosDropDown from "../atmos/AtmosDropDown.vue";

const { selectedSong } = useLyricStore();

const props = defineProps({
  data: Object,
  id: String,
  url: String,
  width: Number,
  height: Number,
  title: String,
  subTitle: String,
  href: String,
  isAdded: Boolean,
});

const songDetail = reactive({
  id: props.id,
  url: props.data?.thumbnails.medium.url || props.url,
  width: props.data?.thumbnails.default.width || props.width || 120,
  height: props.data?.thumbnails.default.height || props.height || 90,
  title: props.data?.title || props.title,
  subTitle: props.data?.channelTitle || props.subTitle,
});

function selected() {
  if (!props.href || props.isAdded) return;
  selectedSong(songDetail);
}

function deleteSong(value) {}

const isShow = ref(false);
const clickClassName = ref("");

function showDropDown(value) {
  isShow.value = !isShow.value;
  clickClassName.value = value;
}
</script>

<style scoped>
.img-to-cover {
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  object-fit: cover;
  position: absolute;
}
.transition-transform {
  transition-duration: 0.2s;
  transition-property: transform;
  transition-timing-function: cubic-bezier(0.42, 0, 0.58, 1);
}
.line-clamp {
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  display: -webkit-box;
  overflow: hidden;
}

.isShow {
  display: block !important;
}
</style>