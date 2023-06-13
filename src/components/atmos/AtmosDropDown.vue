<template>
  <transition name="dropdown">
    <div 
      v-if="show"
      class="absolute z-40 text-sm w-48 py-2 px-3 mt-2 origin-top-right rounded-md shadow-xl dark:bg-gray-700/80"
    >
      <slot></slot>
    </div>
  </transition>
</template>

<script setup>
const props = defineProps({
  show:{
    type: Boolean,
    required: true
  }
})
</script>

<style scoped>
.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-20%);
}
.dropdown-enter-active,
.dropdown-leave-active {
  transition: all 0.3s ease-in-out;
}
.dropdown-enter-to,
.dropdown-leave-from {
  opacity: 1;
  transform: translateY(0);
}
</style>