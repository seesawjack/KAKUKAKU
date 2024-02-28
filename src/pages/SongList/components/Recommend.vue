<template>
    <div class="w-full max-w-[600px] max-sm:px-5 mx-auto">
        <div v-if="initState">
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
                <template v-if="songList.length">
                    <p class="text-left mb-5">
                        {{ searchedTips }}
                    </p>
                    <atmos-card class="max-sm:ml-0 ml-2 mb-5 group" :class="`dropdown-${item.video_id}`"
                        v-for="item in songList" :key="item.id" :id="item.video_id" :url="item.video_img"
                        :title="item.title" :href="`/KAKUKAKU/song/item?song_id=${item.video_id}&recommend=true`"
                        :isAdded="true" :disappear="deletedSong.indexOf(item.video_id) > -1" :sub-title="item.recommend.recommender
                            ? '推薦人:' + item.recommend.recommender
                            : ''">
                    </atmos-card>
                    <atmos-pagination v-if="totalSongCount > 10" :nowPage="page + 1" :totalPages="totalPages"
                        @search="pageChange" />
                </template>
                <p v-else>搜尋不到對應歌曲，請重新搜尋</p>
            </div>
        </div>
        <atmos-not-found v-else :tips="searchError.message" />
    </div>
</template>
  
<script setup>
import { ref, computed } from "vue";
import { useGlobalStore } from "@/stores/index";
import { useSupabase } from "@/composables/useSupabase";

import AtmosCard from "@/components/atmos/AtmosCard.vue";
import AtmosInput from "@/components/atmos/AtmosInput.vue";
import AtmosNotFound from "@/components/atmos/AtmosNotFound.vue";
import AtmosPagination from "@/components/atmos/AtmosPagination.vue";
import AtmosSvgIcon from "@/components/atmos/AtmosSvgIcon.vue";

const { loadingState } = useGlobalStore();
const {
    sbRequest,
    getSearchedRecomSongList,
    handleRecoPageChange,
    getRecoSongList
} = useSupabase();

const songList = ref([]);
const searchSongName = ref("");
const deletedSong = ref([]);
const searchError = ref({ state: "", message: "" });
const showRecommender = ref(false);
const initState = ref(true);
const searchedTips = ref("");

//搜尋結果錯誤訊息
function searchIsError({ state, message }) {
    searchError.value.state = state;
    searchError.value.message = message;
}
//搜尋歌曲
async function searchSongs() {
    page.value = 0;

    const res = await sbRequest(getSearchedRecomSongList, {
        name: searchSongName.value,
    });

    songList.value = res?.data;
    totalSongCount.value = res?.count;
    totalPages.value = Math.ceil(res?.count / 10);
    searchedTips.value = `${searchSongName.value ? '符合搜尋結果': '已推薦'} ${res?.count} 首`;
}

//根據搜尋框內是否含有效文字而顯示對應樣式
const hasSearchText = computed(() => {
    return searchSongName.value ? "cursor-pointer" : "opacity-40";
});

//分頁
const getPagination = (page, size) => {
    const limit = size ? +size : 3;
    const from = page ? page * limit : 0;
    const to = page ? from + size - 1 : size - 1;

    return { from, to };
};

const page = ref(0);
async function pageChange(value) {
    loadingState(true);
    page.value += value ? 1 : -1;
    const { from, to } = getPagination(page.value, 10);
    const res = await sbRequest(handleRecoPageChange, {
        from: from,
        to: to,
    });
    songList.value = res?.data;
    loadingState(false);
}
const totalSongCount = ref(0);
const totalPages = ref(0);

//頁面載入所有已建立歌曲
async function loadingLyricList() {

    loadingState(true);
    const res = await sbRequest(getRecoSongList);
    if (!res?.data) {
        initState.value = false
        searchIsError({
            state: 1,
            message: "歌曲功能有誤，請聯絡網站管理員",
        });
    }
    songList.value = res?.data;
    totalSongCount.value = res?.count;
    totalPages.value = Math.ceil(res?.count / 10);
    showRecommender.value = true;
    searchedTips.value = `已推薦 ${res?.count} 首`;
    loadingState(false);

}
loadingLyricList();
</script>
  