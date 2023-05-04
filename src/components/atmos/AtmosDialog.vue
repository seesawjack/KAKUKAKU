<template>
  <teleport to="body">
    <div v-if="show" @click="closeModal" class="backdrop"></div>
    <transition name="dialog">
      <dialog class="relative" open v-if="show">
        <CloseButton class="absolute z-50 top-2 right-2 hover:stroke-white hover:fill-slate-400" @click="closeModal"/>
        <header v-if="title" class="relative before:absolute before:bottom-0 before:left-1/2 before:translate-x-[-50%] before:w-2/3 before:h-[1px] before:bg-white">
          <slot name="header">
            <h2 class="text-center">{{ title }}</h2>
          </slot>
        </header>
        <section class="p-10">
          <slot></slot>
        </section>
      </dialog>
    </transition>
  </teleport>
</template>

<script setup>
import CloseButton from '../svg/CloseButton.vue'
const props = defineProps({
  show: {
    type: Boolean,
    required: true,
  },
  title: {
    type: String,
    required: false,
  }
});
const emit = defineEmits(["close"]);

function closeModal() {
  emit("close");
}
</script>

<style scoped>
.backdrop {
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  width: 100%;
  background-color: rgba(0, 0, 0, 0.509);
  z-index: 10;
}
dialog {
  position: fixed;
  top: 50%;
  left: 50%;
  width: 30%;
  transform: translate(-50%, -50%);
  z-index: 100;
  border-radius: 12px;
  border: 1px solid #fff;
  box-shadow: 0 0px 8px rgba(255, 255, 255, 0.445);
  padding: 0;
  margin: 0;
  overflow: hidden;
}
header {
  width: 100%;
  padding: 1rem;
}
header h2 {
  margin: 0;
}

.dialog-enter-from,
.dialog-leave-to {
  opacity: 0;
  top: 20%;
}
.dialog-enter-active,
.dialog-leave-active {
  transition: all 0.3s ease-in-out;
}
.dialog-enter-to,
.dialog-leave-from {
  opacity: 1;
  top: 50%;
}
@media (min-width: 768px) {
  dialog {
    width: 300px;
  }
}
</style>