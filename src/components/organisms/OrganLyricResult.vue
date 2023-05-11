<template>
  <div class="flex flex-col max-w-[650px] mx-auto">
    <atmos-dialog :show="!!error" title="偵測"  @close="handleError">
      <p class="text-white text-center">{{error}}</p>
    </atmos-dialog>
    <atmos-video :id="videoId" v-if="videoId"/> 
    <atmos-lyric 
    :lyrics="lyric"
    />
  </div>
</template>

<script setup>
import { ref,computed, onMounted } from 'vue'
import { useRouter,useRoute } from 'vue-router'
import AtmosVideo from "../../components/atmos/AtmosVideo.vue";
import AtmosLyric from "../../components/atmos/AtmosLyric.vue";
import AtmosDialog from "../atmos/AtmosDialog.vue"
import { useHiraganaStore } from "../../stores/hiragana";
import { useGlobalStore } from "../../stores/index";
const route = useRoute();
const router = useRouter();
const error = ref(null)
function handleError(){
  error.value = null
}

const songInfo = useGlobalStore().selectedSongInfo;

const videoId = computed(()=>{
  return route.query.video
});

onMounted(()=>{
  if(!videoId.value){
    error.value = '未找到來源'
  }
})


const hiraganaStore = useHiraganaStore();
const lyric = ref(hiraganaStore.resultLyrics);
</script>

<style>
</style>