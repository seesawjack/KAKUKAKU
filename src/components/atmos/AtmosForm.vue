<template>
  <section>
    <div class="container flex items-center justify-center max-md:px-6 mx-auto">
      <Form @submit="formSubmit" class="w-full" :validation-schema="validate">
        <div
          v-for="{ as, name, label, children, icon, icon2, ...attrs } in schema"
          :key="name"
          class="relative mt-6"
        >
          <p class="text-left mb-2">{{ label }}</p>
          <Field
            :as="as"
            :id="name"
            :name="name"
            v-bind="attrs"
            :ref="name"
            class="block w-full py-3 border rounded-lg dark:bg-gray-900 dark:border-gray-600 focus:border-blue-400 dark:focus:border-blue-300 focus:ring-blue-300 focus:outline-none focus:ring focus:ring-opacity-40"
            :class="{
              'pl-11': name !== 'birth' && icon?.length,
              'pl-3': name === 'birth' || !icon,
            }"
          >
            <template v-if="children && children.length">
              <component
                v-for="({ tag, text, ...childAttrs }, idx) in children"
                :key="idx"
                :is="tag"
                v-bind="childAttrs"
              >
                {{ text }}
              </component>
            </template>
          </Field>
          <atmos-svg-icon
            v-if="icon"
            :name="icon"
            class="absolute top-11 mx-3 text-gray-300 dark:text-gray-500"
          />
          <atmos-svg-icon
            v-if="icon2"
            :name="icon2"
            class="absolute right-0 top-11 mx-3 text-gray-300 dark:text-gray-500"
            :class="{ 'stroke-white': icon2 === 'icon_eye' }"
            @click="changPassworcIcon(icon2)"
          />
          <ErrorMessage
            :name="name"
            class="absolute left-0 top-15 text-sm text-red-500"
          />
        </div>
        <button
          class="w-full mt-8 text-md font-medium tracking-wide text-white capitalize transition-colors duration-300 transform border rounded-lg focus:outline-none"
          :class="{
            unclickable: !button.state,
            'hover:bg-sky-900/90': button.state,
          }"
          :disabled="!button.state"
        >
          {{ button.name }}
        </button>
      </Form>
    </div>
  </section>
</template>

<script setup>
import { ref, toRefs } from "vue";
import { Form, Field, ErrorMessage, useForm } from "vee-validate";
import { useAuthStore } from "../../stores/auth";

import AtmosSvgIcon from "./AtmosSvgIcon.vue";

const props = defineProps({
  schema: {
    type: Object,
    required: true,
  },
  validate: {
    type: Object,
    required: true,
  },
  button: {
    type: Object,
    required: true,
  },
  formType: {
    type: String,
    required: true,
  },
});

const formName = ref(props.formType);

const { formSchema } = toRefs(useAuthStore());

function changPassworcIcon(icon) {
  if (icon !== "icon_eye" && icon !== "icon_eye_close") return;
  const passwordObj = formSchema.value[formName.value].password;
  const passwordConfirmedObj =
    formSchema.value[formName.value].passwordConfirmed;
  if (icon === "icon_eye_close") {
    passwordObj.type = "text";
    passwordObj.icon2 = "icon_eye";
    if (passwordConfirmedObj) {
      passwordConfirmedObj.type = "text";
      passwordConfirmedObj.icon2 = "icon_eye";
    }
  } else {
    passwordObj.type = "password";
    passwordObj.icon2 = "icon_eye_close";
    if (passwordConfirmedObj) {
      passwordConfirmedObj.type = "password";
      passwordConfirmedObj.icon2 = "icon_eye_close";
    }
  }
}

const emits = defineEmits(["submit"]);

function formSubmit(formValue) {
  emits("submit", { info: formValue });
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
  -webkit-appearance: none;
  -moz-appearance: none;
  min-height: 3.175rem;
  min-width: 100%;
}

select {
  --tw-text-opacity: 1;
  color: rgb(156 163 175 / var(--tw-text-opacity));
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
}

.unclickable {
  --tw-bg-opacity: 1;
  cursor: not-allowed;
  background-color: rgb(71 85 105 / var(--tw-bg-opacity));
  color: darkgrey;
  font-weight: 900;
}
</style>
