<template>
  <div class="mt-5 text-2xl text-left">
    <template v-for="lyric,index in lyrics" :key="lyric">
      <p class="tracking-[2px] before:border-t before:border-dashed">{{ lyric }}</p>
      <div v-if="index !== lyrics.length-1" class="line border-t border-dashed h-px my-2"></div>
    </template>
    </div>
</template>

<script setup>
const lyrics = ['闇夜を駆け抜けて 何処へむかう',
'月明かりだけがただ一つの道標',
'痛みも悲しみも拭いきれず',
'されどこの胸の炎は消させない',
'誰が為に僕たちは',
'この想いを貫いて',
'闇を裂き 陽の下で',
'光さす日まで',
'解き放たれた心に宿']
</script>

<style>

</style>