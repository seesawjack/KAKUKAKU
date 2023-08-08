<template>
  <section>
    <div class="container flex items-center justify-center px-6 mx-auto">
      <Form @submit="onSubmit" class="w-full" :validation-schema="validate">
        <div v-for="{ as, name, children, icon, ...attrs } in schema" :key="name" class="relative">
          <Field :as="as" :id="name" :name="name" v-bind="attrs" :ref="name"
            class="block w-full py-3 border rounded-lg dark:bg-gray-900 dark:border-gray-600 focus:border-blue-400 dark:focus:border-blue-300 focus:ring-blue-300 focus:outline-none focus:ring focus:ring-opacity-40 mt-8"
            :class="{ 'pl-11': name !== 'birth' && icon?.length, 'pl-3': name === 'birth' || !icon }">
            <template v-if="children && children.length">
              <component v-for="({ tag, text, ...childAttrs }, idx) in children" :key="idx" :is="tag" v-bind="childAttrs">
                {{ text }}
              </component>
            </template>
          </Field>
          <component :is="iconGroup[icon]" class="absolute top-3 mx-3 text-gray-300 dark:text-gray-500" />
          <ErrorMessage :name="name" class="absolute left-0 top-15 text-sm text-red-500" />
        </div>
        <button
          class="w-full mt-8 text-md font-medium tracking-wide text-white capitalize transition-colors duration-300 transform border rounded-lg hover:bg-sky-900/90 focus:outline-none"
          :class="{'unclickable':!button.state}"
          :disabled="!button.state">
          {{ button.name }}
        </button>
      </Form>
    </div>
  </section>
</template>

<script setup>
import { computed } from "vue";
import { Form, Field, ErrorMessage, useForm } from "vee-validate";
import { useRoute } from "vue-router";

import UserIcon from "../svg/UserIcon.vue";
import PasswordIcon from "../svg/PasswordIcon.vue";
import EmailIcon from "../svg/EmailIcon.vue";
import GenderIcon from "../svg/GenderIcon.vue";
import PaperIcon from "../svg/PaperIcon.vue";
import CalenderIcon from "../svg/CalenderIcon.vue";

const route = useRoute();

const props = defineProps({
  schema: {
    type: Object,
    required: true,
  },
  validate: {
    type: Object,
    required: true,
  },
  button:{
    type: Object,
    required: true
  }
});

const iconGroup = {
  'UserIcon': UserIcon,
  'PasswordIcon': PasswordIcon,
  'EmailIcon': EmailIcon,
  'GenderIcon': GenderIcon,
  'PaperIcon': PaperIcon,
  'CalenderIcon': CalenderIcon
}

const emits = defineEmits(["submit"]);

function onSubmit(formValue) {
  emits("submit", { info: formValue })
}
</script>

<style scoped>
input[type="date"]::-webkit-calendar-picker-indicator {
  color: rgba(0, 0, 0, 0);
  opacity: 0;
  display: block;
  background: none;
  width: 20px;
  height: 20px;
  border-width: thin;
  position: relative;
  z-index: 10;
  margin-right: 10px;
}

input[type="date"] {
  display: flex;
  flex-direction: row-reverse;
  --tw-text-opacity: 1;
  color: rgb(156 163 175 / var(--tw-text-opacity));
}

select {
  --tw-text-opacity: 1;
  color: rgb(156 163 175 / var(--tw-text-opacity));
}

.unclickable {
  --tw-bg-opacity: 1;
  cursor: not-allowed;
  background-color: rgb(71 85 105 / var(--tw-bg-opacity));
  color: darkgrey;
  font-weight: 900;
}
</style>