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
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="absolute inset-0 opacity-100 group-open:opacity-0"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="2"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>

          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="absolute inset-0 opacity-0 group-open:opacity-100"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="2"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </span>
      </summary>

      <p class="mt-4 leading-relaxed max-md:text-sm">
        {{ item.body }}
      </p>
    </details>
  </div>
</template>

<script setup>
const props = defineProps({
  content:{
    type:Array,
    required:true
  }
})

</script>
