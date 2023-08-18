<template>
  <textarea
    class="w-full resize-none bg-gray-900/50 border border-solid rounded-xl py-2 px-5 outline-none"
    cols="53"
    rows="14"
    v-model.trim.lazy="uploadLyrics"
    :placeholder="placeholder"
  ></textarea>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  placeholder: {
    type: String,
    required: true,
  },
  modelValue:{
    type: String,
    required: true
  },
});

const emit = defineEmits(["update:modelValue"]);

const uploadLyrics = computed({
  get() {
    return props.modelValue;
  },
  set(value) {
    emit("update:modelValue", value);
  },
});
</script>