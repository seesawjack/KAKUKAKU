<template>
    <div class="inline-flex items-center justify-center gap-3">
        <a v-if="page !== 1" href="#"
            class="inline-flex h-8 w-8 items-center justify-center text-white rtl:rotate-180 bg-gray-900/50 border border-white rounded hover:bg-slate-600"
            @click="pageChange(false)">
            <span class="sr-only">Next Page</span>
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd"
                    d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                    clip-rule="evenodd" />
            </svg>
        </a>

        <p class="text-md text-white">
            {{ page }}
            <span class="mx-0.25">/</span>
            {{ totalPages }}
        </p>

        <a 
        v-if="page !== totalPages"
        href="#"
            class="inline-flex h-8 w-8 items-center justify-center text-white rtl:rotate-180 bg-gray-900/50 border border-white rounded hover:bg-slate-600"
            @click="pageChange(true)">
            <span class="sr-only">Next Page</span>
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd"
                    d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                    clip-rule="evenodd" />
            </svg>
        </a>
    </div>
</template>

<script setup>
import { ref,toRefs,watch } from "vue";
import { useYoutubeStore } from "../../stores/youtube";

const props = defineProps({
    nowPage:{
        type: Number,
        required: true
    },
    totalPages: {
        type: Number,
        required: true
    }
})

const page = ref(props.nowPage);
const emit = defineEmits(["search"]);

const { isReasearch } = toRefs(useYoutubeStore());

function pageChange(value) {
    page.value += value ? 1 : -1;
    emit("search", value);
}

watch(isReasearch,()=>{
    page.value = isReasearch.value ? 1 : page.value;
})
</script>