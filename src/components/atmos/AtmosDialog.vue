<template>
  <teleport to="body">
    <div v-if="show" @click="closeModal" class="backdrop z-0"></div>
    <transition name="dialog">
      <div v-if="show" class="absolute top-0 w-full text-white bg-gradient-to-r from-rose-600 from-50% to-rose-400 bg-opacity-30 border-b border-slate-50 z-10">
        <div
          class="container flex items-center justify-between px-6 py-2 mx-auto"
        >
          <div class="flex">
            <svg viewBox="0 0 40 40" class="w-6 h-6 fill-current">
              <path
                d="M20 3.36667C10.8167 3.36667 3.3667 10.8167 3.3667 20C3.3667 29.1833 10.8167 36.6333 20 36.6333C29.1834 36.6333 36.6334 29.1833 36.6334 20C36.6334 10.8167 29.1834 3.36667 20 3.36667ZM19.1334 33.3333V22.9H13.3334L21.6667 6.66667V17.1H27.25L19.1334 33.3333Z"
              ></path>
            </svg>

            <p class="mx-3">{{ title }}</p>
          </div>

          <button
            class="p-1 transition-colors duration-300 transform rounded-md hover:bg-opacity-25 hover:bg-gray-600 focus:outline-none"
            @click="closeModal"
          >
            <svg
              class="w-5 h-5"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M6 18L18 6M6 6L18 18"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>
    </transition>
  </teleport>
</template>

<script setup>
import CloseButton from "../svg/CloseButton.vue";
const props = defineProps({
  show: {
    type: Boolean,
    required: true,
  },
  title: {
    type: String,
    required: false,
  },
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
  top: -20%;
}
.dialog-enter-active,
.dialog-leave-active {
  transition: all 0.3s ease-in-out;
}
.dialog-enter-to,
.dialog-leave-from {
  opacity: 1;
  top: 0px;
}
@media (min-width: 768px) {
  dialog {
    width: 300px;
  }
}
</style>