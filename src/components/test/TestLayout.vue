<template>
  <div>
    <!-- <div class="w-full mb-10">
    <input type="text" placeholder="請輸入您想搜尋的音樂" class="resize-none bg-[transparent] border border-solid rounded-3xl py-2 px-5 max-w-lg w-full">
  </div>
  <div class="flex justify-center text-left mb-5">
    <div class="left max-w-[120px] pr-5">
      <img src="https://i.ytimg.com/vi/Jb6Zlg30rgk/default.jpg" alt="">
    </div>
    <div class="right">
      <div class="title ">MAN WITH A MISSION×milet「絆ノ奇跡」Music Video</div>
      <div class="text-xs text-slate-500 leading-4">
        <p>mwamjapan</p>
        <p>2023-04-09T15:15:00</p>
        <p>MAN WITH A MISSION×milet「絆ノ奇跡」 『テレビアニメ「鬼滅の刃」刀鍛冶の里編』オープニング主題歌 ...",</p>
      </div>
    </div>
  </div>
   <div class="flex justify-center text-left mb-5">
    <div class="left max-w-[120px] pr-5">
      <img src="https://i.ytimg.com/vi/Jb6Zlg30rgk/default.jpg" alt="">
    </div>
    <div class="right">
      <div class="title ">MAN WITH A MISSION×milet「絆ノ奇跡」Music Video</div>
      <div class="text-xs text-slate-500 leading-4">
        <p>mwamjapan</p>
        <p>2023-04-09T15:15:00</p>
        <p>MAN WITH A MISSION×milet「絆ノ奇跡」 『テレビアニメ「鬼滅の刃」刀鍛冶の里編』オープニング主題歌 ...",</p>
      </div>
    </div>
  </div>
   <div class="flex justify-center text-left mb-5">
    <div class="left max-w-[120px] pr-5">
      <img src="https://i.ytimg.com/vi/Jb6Zlg30rgk/default.jpg" alt="">
    </div>
    <div class="right">
      <div class="title ">MAN WITH A MISSION×milet「絆ノ奇跡」Music Video</div>
      <div class="text-xs text-slate-500 leading-4">
        <p>mwamjapan</p>
        <p>2023-04-09T15:15:00</p>
        <p>MAN WITH A MISSION×milet「絆ノ奇跡」 『テレビアニメ「鬼滅の刃」刀鍛冶の里編』オープニング主題歌 ...",</p>
      </div>
    </div>
  </div>
   <div class="flex justify-center text-left mb-5">
    <div class="left max-w-[120px] pr-5">
      <img src="https://i.ytimg.com/vi/Jb6Zlg30rgk/default.jpg" alt="">
    </div>
    <div class="right">
      <div class="title ">MAN WITH A MISSION×milet「絆ノ奇跡」Music Video</div>
      <div class="text-xs text-slate-500 leading-4">
        <p>mwamjapan</p>
        <p>2023-04-09T15:15:00</p>
        <p>MAN WITH A MISSION×milet「絆ノ奇跡」 『テレビアニメ「鬼滅の刃」刀鍛冶の里編』オープニング主題歌 ...",</p>
      </div>
    </div>
  </div>
   <div class="flex justify-center text-left mb-5">
    <div class="left max-w-[120px] pr-5">
      <img src="https://i.ytimg.com/vi/Jb6Zlg30rgk/default.jpg" alt="">
    </div>
    <div class="right">
      <div class="title ">MAN WITH A MISSION×milet「絆ノ奇跡」Music Video</div>
      <div class="text-xs text-slate-500 leading-4">
        <p>mwamjapan</p>
        <p>2023-04-09T15:15:00</p>
        <p>MAN WITH A MISSION×milet「絆ノ奇跡」 『テレビアニメ「鬼滅の刃」刀鍛冶の里編』オープニング主題歌 ...",</p>
      </div>
    </div>
  </div>
  <div>
    <p class="text-xs">此網站僅供學習資源使用，版權仍歸於原創者</p>
  </div> -->
  <div class="flex flex-col items-center">
    <!-- <div class="relative w-[640px] mb-5">
      <div class="flex flex-col">
        <atmos-card 
        :url="'https://i.ytimg.com/vi/YzoNZ-ozS3o/hqdefault.jpg'"
        :width="120"
        :height="90"
        :title="'【LIVE映像】「フラッシュバッカー」/ ぼっち・ざ・ろっく！-SPECIAL STUDIO LIVE-'"
        :subTitle="'アニプレックス チャンネル'"
        :useAlone="true"/>
      </div>
    </div>
    <div>
      <textarea class="resize-none bg-[transparent] border border-solid rounded-xl py-2 px-5" name="" id="" cols="53" rows="14"></textarea>
      <div class="flex">
        <button class="flex-1 border border-solid rounded-xl mr-2">確定</button>
        <button class="flex-1 border border-solid rounded-xl">上傳歌詞</button>
      </div>
    </div> -->
    <atmos-video/>
    <atmos-lyric/>
  </div>
  </div>
</template>

<script setup>
import AtmosVideo from '../atmos/AtmosVideo.vue'
import AtmosCard from '../atmos/AtmosCard.vue'
import AtmosLyric from '../atmos/AtmosLyric.vue'
import AtmosLyricVue from '../atmos/AtmosLyric.vue'
</script>

<style>

</style>