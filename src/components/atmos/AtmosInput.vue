<template>
  <div class="relative">
    <input :class="[inputClass,{'border border-red-500 move':errorMessage}]" :type="inputType || 'text'" :placeholder="inputTips" v-model.trim.lazy="infoValue" />
    <slot name="icon"></slot>
    <p v-if="errorMessage" class="text-sm text-red-500 my-2">{{ errorMessage }}</p>
  </div>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  inputTips: {
    type: String,
    required: true,
  },
  inputClass: {
    type: String,
    required: true,
  },
  modelValue: {
    type: String,
    required: true
  },
  inputType: {
    type: String,
    rqueired: false
  },
  errorMessage: {
    type: String,
    required: false
  }
});

const emit = defineEmits(['update:modelValue']);

const infoValue = computed({
  get() {
    return props.modelValue
  },
  set(value) {
    emit('update:modelValue', value)
  }
})
</script>

<style scoped>
.move {
  animation: catmove 0.3s linear ;
}

@keyframes catmove {
  0% {
    transform: translateX(0px);
  }
  25% {
    transform: translateX(-3px);
  }
  50% {
    transform: translateX(3px);
  }
  75% {
    transform: translateX(-5px);
  }
  100% {
    transform: translateX(0px);
  }
}
</style>
