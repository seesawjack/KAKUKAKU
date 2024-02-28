<template>
    <personal-song-list v-if="isPersonalPage"/>
    <recommend-song-list v-else/>
</template>

<script setup>
import { computed } from "vue";
import { useRoute } from "vue-router";

import PersonalSongList from './components/Personal.vue';
import RecommendSongList from './components/Recommend.vue';

const route = useRoute();
const isPersonalPage = computed(() => {
    return route.path.includes('personal');
})
</script>