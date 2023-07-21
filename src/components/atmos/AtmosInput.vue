<template>
  <div class="relative">
    <input
      :class="inputClass"
      :type="inputType || 'text'"
      :placeholder="inputTips"
      v-model.trim.lazy="infoValue"
    />
    <slot></slot>
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
  modelValue:{
    type: String,
    required: true
  },
  inputType:{
    type:String,
    rqueired: false
  }
});

const emit = defineEmits(['update:modelValue']);

const infoValue = computed({
  get(){
    return props.modelValue
  },
  set(value){
    emit('update:modelValue',value)
  }
})
</script>
