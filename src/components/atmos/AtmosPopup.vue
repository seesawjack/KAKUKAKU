<template>
    <teleport to="body">
        <div class="fixed top-0 overflow-hidden w-full h-screen bg-slate-900/70 z-[100] max-md:px-4">
            <div
                class="max-w-xl w-full mx-auto translate-y-full max-md:translate-y-1/2 rounded-lg bg-white py-8 px-4 shadow-2xl">
                <h2 class="text-lg font-bold text-gray-950 text-center">{{ title }}</h2>

                <p v-if="content" class="mt-2 text-sm text-gray-500 text-justify" v-html="content">
                </p>
                <slot name="inputContent"></slot>

                <div class="mt-4 flex justify-center gap-2">
                    <button type="button" class="rounded bg-green-50 px-4 py-2 text-sm font-medium text-green-600"
                        @click="handelClick(true)">
                        {{ button[0] }}
                    </button>

                    <button type="button" class="rounded bg-gray-50 px-4 py-2 text-sm font-medium text-gray-600"
                        @click="handelClick(false)">
                        {{ button[1] }}
                    </button>
                </div>
            </div>
        </div>
    </teleport>
</template>

<script setup>

const props = defineProps({
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: false
    },
    button: {
        type: Array,
        default: ["同意", "不同意"]
    }
})

const emits = defineEmits(["buttonClick"]);
function handelClick(clickType){
    emits("buttonClick",clickType)
}
</script>