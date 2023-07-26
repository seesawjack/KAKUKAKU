<template>
  <div class="w-full max-w-2xl">
    <div class="w-full text-start pt-14">
      <h1 class="text-2xl">關於 KAKUKAKU</h1>
      <hr class="w-full border-gray-200 dark:border-gray-500 my-3" />
      <p class="text-justify">提供使用者方便及快速的操作介面練習日文歌曲，且依據使用者回饋定期更新網站樣式及功能，期望能提供更完善的練習日文歌體驗。</p>
    </div>
    <div class="w-full text-start mt-10">
      <h1 class="text-2xl">相關問題</h1>
      <hr class="w-full border-gray-200 dark:border-gray-500 my-3" />
      <atmos-accordion :content="faq"/>
    </div>
    <div class="w-full text-start mt-10">
      <h1 class="text-2xl">版本更新紀錄</h1>
      <hr class="w-full border-gray-200 dark:border-gray-500 my-3" />
      <atmos-accordion :content="updateHistory"/>
    </div>
  </div>
</template>

<script setup>
import AtmosAccordion from "../atmos/AtmosAccordion.vue";

const faq = [
  {
    header: "若操作上有遇到狀況或是想提供改善建議，有提供相關溝通管道嗎?",
    body: "有的，可在側欄的「意見反應」中，留下您寶貴的建議。",
  },
  {
    header: "為什麼手機版有部分功能無法使用?",
    body: "因最初設計時，電腦版以編輯功能為主，手機版以適合觀看歌詞為主，故有些編輯功能在手機上是看不到的。",
  },
  {
    header: "會員資料的內容為什麼需要填寫「生日」及「日本語能力」?",
    body: "會員資料只有網站管理員看得到且會嚴密保護，以上資料可協助管理員分析用以改善網站功能。",
  },
]

const updateHistory = [
{
    header: "2023/07/28 ver1.0.0",
    body: "網頁上架。",
  }
]
</script>
