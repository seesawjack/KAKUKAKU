<template>
  <div>
    <textarea
      class="resize-none bg-[transparent] border border-solid rounded-xl py-2 px-5"
      cols="53"
      rows="14"
      v-model.trim="lyric"
      placeholder="輸入 / 貼上 / 上傳歌詞"
    ></textarea>
    <div class="flex">
      <button
        class="flex-1 border border-solid rounded-xl mr-2 hover:bg-slate-600"
        @click="sendLyric"
      >
        確定
      </button>
      <label
        class="flex-1 border border-solid rounded-xl leading-10 hover:bg-slate-600 cursor-pointer"
        for="file-uploader"
      >
        <input
          type="file"
          id="file-uploader"
          data-target="file-uploader"
          accept=".txt,.doc,.docx"
          class="hidden"
          @change="uploadFile"
        />
        上傳歌詞
      </label>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

const emit = defineEmits(["getLyric", "showError"]);
const lyric = ref(null);

async function sendLyric() {
  if (!lyric.value) {
    emit("showError", true);
  } else {
    emit("getLyric", lyric.value);
  }
}

async function uploadFile(e) {
  let file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.addEventListener("load",(e)=>{
    lyric.value = e.target.result;
  },false)

  if (file) {
    reader.readAsText(file);
  }
}
</script>

<style>
</style>