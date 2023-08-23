<template>
    <svg aria-hidden="true" class="w-6 h-6">
        <use :href="symbolId" :fill="color"/>
    </svg>
</template>

<script setup>
import { computed } from 'vue'
const props = defineProps({
    name: {
        type: String,
        required: true,
    },
    prefix: {
        type: String,
        default: 'icon',
    },
    color: {
        type: String,
        default: '#333',
    },
})
const symbolId = computed(() => `#${props.name}`);

</script>