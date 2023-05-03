<template>
  <router-link v-if="!useAlone" class="flex justify-center text-left" :to="`/SongList/${id.videoId || id.channelId}`">
    <div class="w-full max-w-[120px] relative mx-auto md:mx-0">
      <div class="w-full relative before:block before:pb-[56%] overflow-hidden">
        <picture>
          <source
            :srcset="data?.thumbnails.medium.url || url"
            :media="`(min-width: ${data?.thumbnails.default.width || width}px)`"
            :width="data?.thumbnails.default.width || width"
            :height="data?.thumbnails.default.height || height"
          />
          <img
            :srcset="data?.thumbnails.medium.url || url"
            :width="data?.thumbnails.default.width || width"
            :height="data?.thumbnails.default.height || height"
            :alt="data?.title"
            class="img-to-cover transition-transform group-hover:scale-[125%]"
          />
        </picture>
      </div>
    </div>
    <div class="w-full max-w-[390px] pl-5">
      <p class="line-clamp">{{ data?.title || title }}</p>
      <div class="text-xs text-slate-500 leading-5">
        <p>{{ data?.channelTitle || subTitle }}</p>
      </div>
    </div>
  </router-link>
  <div v-else class="flex justify-center text-left">
    <div class="w-full max-w-[120px] relative mx-auto md:mx-0">
      <p class="text-xs absolute top-[-30px] bg-red-500 rounded-md p-1">
        已選歌曲
      </p>
      <div class="w-full relative before:block before:pb-[56%] overflow-hidden">
        <picture>
          <source
            :srcset="data?.thumbnails.medium.url || url"
            :media="`(min-width: ${data?.thumbnails.default.width || width}px)`"
            :width="data?.thumbnails.default.width || width"
            :height="data?.thumbnails.default.height || height"
          />
          <img
            :srcset="data?.thumbnails.medium.url || url"
            :width="data?.thumbnails.default.width || width"
            :height="data?.thumbnails.default.height || height"
            :alt="data?.title"
            class="img-to-cover transition-transform group-hover:scale-[125%]"
          />
        </picture>
      </div>
    </div>
    <div class="w-full max-w-[390px] pl-5">
      <p class="line-clamp">{{ data?.title || title }}</p>
      <div class="text-xs text-slate-500 leading-5">
        <p>{{ data?.channelTitle || subTitle }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  data: Object,
  url: String,
  width: Number,
  height: Number,
  title: String,
  subTitle: String,
  useAlone: Boolean,
  id: Object
});
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
</style>