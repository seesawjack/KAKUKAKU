<template>
  <div v-if="resultData.items?.length">
    <div
      class="max-w-[512px] mx-auto border border-transparent transition-all ml-25 flex justify-center text-left mb-5 group cursor-pointer hover:bg-slate-300/[0.2]"
      v-for="item in resultData.items"
      :key="item.id.videoId"
    >
      <div class="w-full max-w-[120px] relative mx-auto md:mx-0">
        <div
          class="w-full relative before:block before:pb-[56%] overflow-hidden"
        >
          <picture>
            <source
              :srcset="item.snippet.thumbnails.medium.url"
              media="(min-width: 120px)"
              :width="item.snippet.thumbnails.medium.width"
              :height="item.snippet.thumbnails.medium.height"
            />
            <img
              :src="item.snippet.thumbnails.medium.url"
              :width="item.snippet.thumbnails.medium.width"
              :height="item.snippet.thumbnails.medium.height"
              :alt="item.snippet.title"
              class="img-to-cover transition-transform group-hover:scale-[125%]"
            />
          </picture>
        </div>
      </div>
      <div class="w-full max-w-[390px] pl-5">
        <p class="line-clamp">{{ item.snippet.title }}</p>
        <div class="text-xs text-slate-500 leading-5">
          <p>{{ item.snippet.channelTitle }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  resultData: Object,
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
.line-clamp{
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    display: -webkit-box;
    overflow: hidden;
}
</style>
