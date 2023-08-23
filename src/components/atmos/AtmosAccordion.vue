<template>
  <div class="space-y-4">
    <details
      class="group rounded-lg bg-gray-900/70 p-6 [&_summary::-webkit-details-marker]:hidden"
      v-for="(item,index) in content" :key="index"
    >
      <summary
        class="flex cursor-pointer items-center justify-between gap-1.5"
      >
        <h2 class="font-bold text-lg max-md:text-base">
         {{ item.header }}
        </h2>

        <span class="relative h-5 w-5 shrink-0">
          <atmos-svg-icon name="icon_accordion_open" class="absolute inset-0 opacity-100 group-open:opacity-0"/>
          <atmos-svg-icon name="icon_accordion_close" class="absolute inset-0 opacity-0 group-open:opacity-100"/>
        </span>
      </summary>

      <p class="mt-4 leading-relaxed max-md:text-sm">
        {{ item.body }}
      </p>
    </details>
  </div>
</template>

<script setup>
import AtmosSvgIcon from './AtmosSvgIcon.vue';
const props = defineProps({
  content:{
    type:Array,
    required:true
  }
})

</script>
