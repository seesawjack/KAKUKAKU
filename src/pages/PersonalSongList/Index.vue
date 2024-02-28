<template>
    <div class="w-full max-w-[600px] max-sm:px-5 mx-auto">
        <div v-if="songList">
            <div class="w-full">
                <form @submit.prevent="searchSongs">
                    <atmos-input class="w-full max-sm:text-sm mb-5" :inputTips="'請輸入歌曲名稱'"
                        :inputClass="'resize-none bg-[transparent] border border-solid rounded-3xl py-2 px-5 w-full outline-none'"
                        v-model.trim="searchSongName">
                        <template #icon>
                            <atmos-svg-icon name="icon_search" class="absolute right-3 top-2" :class="hasSearchText"
                                @click="searchSongs" />
                        </template>
                    </atmos-input>
                </form>
                <p v-if="songList?.length > 0" class="text-left mb-5">
                    {{ searchedTips }}
                </p>
                <atmos-card class="max-sm:ml-0 ml-2 mb-5 group" :class="`dropdown-${item.video_id}`"
                    v-for="item in songList" :key="item.id" :id="item.video_id" :url="item.video_img" :title="item.title"
                    :href="`/KAKUKAKU/song/item?song_id=${item.video_id}&user=${userInfo.user_metadata?.name}`"
                    :isAdded="true" :disappear="deletedSong.indexOf(item.video_id) > -1">
                    <template #configure>
                        <div class="w-[22.5px] relative">
                            <atmos-svg-icon name="icon_more" @click="showDropDown(item.video_id)"
                                class="hidden group-hover:block cursor-pointer max-md:block" :class="[
                                    { '!block': clickClassName === item.video_id },
                                    { 'group-hover': !deletedSong },
                                ]" />
                            <atmos-drop-down class="top-4 right-3 py-1 px-2" :show="clickClassName === item.video_id">
                                <button class="w-full py-1 rounded-md hover:bg-slate-800"
                                    @click="toDeleteSong(item.video_id)">
                                    刪除此歌曲
                                </button>
                            </atmos-drop-down>
                        </div>
                    </template>
                </atmos-card>
                <atmos-pagination v-if="totalSongCount > 10" :nowPage="page + 1" :totalPages="totalPages"
                    @search="pageChagne" />
            </div>
        </div>
        <atmos-not-found v-else :tips="searchError.message" />
    </div>
</template>
  
<script setup>
import { ref, computed, onMounted, onUnmounted } from "vue";
import { useRoute } from "vue-router";
import { useGlobalStore } from "@/stores/index";
import { useAuthStore } from "@/stores/auth";
import { useLyricStore } from "@/stores/song";
import { useSupabase } from "@/composables/useSupabase";

import AtmosCard from "@/components/atmos/AtmosCard.vue";
import AtmosInput from "@/components/atmos/AtmosInput.vue";
import AtmosNotFound from "@/components/atmos/AtmosNotFound.vue";
import AtmosDropDown from "@/components/atmos/AtmosDropDown.vue";
import AtmosPagination from "@/components/atmos/AtmosPagination.vue";
import AtmosSvgIcon from "@/components/atmos/AtmosSvgIcon.vue";

const route = useRoute();

const { userInfo, isLoggedIn } = useAuthStore();
const { loadingState } = useGlobalStore();
const {
    songPageOption: { selected },
} = useLyricStore();
const {
    sbRequest,
    getSearchedSongList,
    getSearchedRecomSongList,
    deleteSong,
    deleteSongContent,
    handlePageChange,
    handleRecoPageChange,
    getSongList,
    getRecoSongList
} = useSupabase();

const songList = ref([]);
const searchSongName = ref("");
const deletedSong = ref([]);
const searchError = ref({ state: "", message: "" });
const isSearch = ref(false);
const showRecommender = ref(false);
const totalSongCount = ref(0);
const totalPages = ref(0);
const clickClassName = ref("");
const page = ref(0);

//輸入框左下方提示文字
const searchedTips = computed(() => {
    return `${searchSongName.value ? '符合搜尋結果' : '已建立'} ${totalSongCount.value} 首`
});

//搜尋結果錯誤訊息
function searchIsError({ state, message }) {
    searchError.value.state = state;
    searchError.value.message = message;
}
//搜尋歌曲
async function searchSongs() {
    page.value = 0;
    
    const res = await sbRequest(getSearchedSongList, {
        userId: userInfo.id,
        name: searchSongName.value,
    });

    if (res?.data) {
        searchIsError({ state: 2, message: "搜尋不到對應歌曲，請重新搜尋" });
    }

    songList.value = res?.data;
    totalSongCount.value = res?.count;
    totalPages.value = Math.ceil(res?.count / 10);
}

//根據搜尋框內是否含有效文字而顯示對應樣式
const hasSearchText = computed(() => {
    return searchSongName.value ? "cursor-pointer" : "opacity-40";
});

//刪除歌曲
async function toDeleteSong(id) {
    //歌曲清單刪除該歌曲
    await sbRequest(deleteSong, { videoId: id });
    //歌詞內容清單刪除該歌曲的歌詞
    await sbRequest(deleteSongContent, { videoId: id });

    totalSongCount.value -= 1;
    deletedSong.value.push(id);
    songList.value = songList.value.filter((song) => song.video_id !== id);
}


function showDropDown(id) {
    clickClassName.value = clickClassName.value === id ? "" : id;
}

//在顯示刪除歌詞的狀態下按網頁中其他位置，會取消顯示刪除歌詞的狀態
const notClickDropdwonSelf = () => {
    if (!event.target.closest(`.dropdown-${clickClassName.value}`)) {
        clickClassName.value = "";
    }
    return;
};

//分頁
const getPagination = (page, size) => {
    const limit = size ? +size : 3;
    const from = page ? page * limit : 0;
    const to = page ? from + size - 1 : size - 1;

    return { from, to };
};

async function pageChagne(value) {
    let songData = {};
    page.value += value ? 1 : -1;

    const { from, to } = getPagination(page.value, 10);
    const { data } = await sbRequest(handlePageChange, {
        userId: userInfo.id,
        from: from,
        to: to,
    });

    songData.data = data;

    songList.value = songData.data;
}


//初始化資料
function pageDataInit() {
    isSearch.value = false;
    searchSongName.value = "";
}

//頁面載入所有已建立歌曲
async function loadingLyricList() {
    loadingState(true);
    if (isLoggedIn()) {
        const res = await sbRequest(getSongList, {
            userId: userInfo.id,
        });
        songList.value = res?.data;
        totalSongCount.value = res?.count;
        totalPages.value = Math.ceil(res?.count/ 10);
    }
    if (!songList.value) {
        searchIsError({
            state: 1,
            message: "您尚未新增歌曲",
        });
    }
    loadingState(false);
}
loadingLyricList();


onMounted(async () => {
    document.addEventListener("click", notClickDropdwonSelf);
});

onUnmounted(() => {
    document.body.removeEventListener("click", notClickDropdwonSelf);
});
</script>
  