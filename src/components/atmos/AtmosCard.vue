<template>
  <div class="flex items-center" :class="{ 'disappear': disappear }">
    <component :is="href ? 'a' : 'div'" @click="songSelected" :href="href"
      class="flex max-md:justify-normal justify-center text-left w-full">
      <div class="w-full max-w-[120px] relative">
        <p v-if="!href" class="text-xs absolute top-[-30px] bg-red-500 rounded-md p-1">
          已選歌曲
        </p>
        <div class="w-full relative before:block before:pb-[56.25%] overflow-hidden">
          <picture>
            <source :srcset="songDetail.url" :media="`(min-width: ${songDetail.width}px)`" :width="songDetail.width"
              :height="songDetail.height" />
            <img :srcset="songDetail.url" :width="songDetail.width" :height="songDetail.height" :alt="songDetail.title"
              class="img-to-cover transition-transform group-hover:scale-[125%]" />
          </picture>
        </div>
      </div>
      <div class="w-full max-sm:max-w-[190px] max-w-[500px] transition-all hover:bg-slate-300/[0.2] pl-5">
        <p class="line-clamp">{{ songDetail.title }}</p>
        <div v-if="songDetail.subTitle" class="text-xs text-slate-500 leading-5">
          <p>{{ songDetail.subTitle }}</p>
        </div>
      </div>
    </component>
    <slot name="configure"></slot>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useLyricStore } from "../../stores/song";

const { handleSongSelected } = useLyricStore();

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
  disappear: Boolean
});

const songDetail = computed(() => {
  return {
    id: props.id,
    url: props.data?.thumbnails.medium.url || props.url,
    width: props.data?.thumbnails.default.width || props.width || 120,
    height: props.data?.thumbnails.default.height || props.height || 90,
    title: props.data?.title || props.title,
    subTitle: props.data?.channelTitle || props.subTitle,
  }
});

function songSelected() {
  if (!props.href || props.isAdded) return;
  handleSongSelected(songDetail.value);
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

.disappear {
  display: none;
}
</style>