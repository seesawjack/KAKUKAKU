<template>
    <PersonalSong v-if="isPersonalPage"/>
    <RecommendSong v-else/>
</template>

<script setup>
import { computed } from "vue";
import { useRoute } from "vue-router";

import PersonalSong from './components/Personal.vue';
import RecommendSong from './components/Recommend.vue';

const route = useRoute();
const isPersonalPage = computed(() => {
    return route.path.includes('personal');
})
</script>