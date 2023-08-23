<template>
  <section>
    <div class="container flex items-center justify-center max-md:px-6 mx-auto">
      <Form @submit="formSubmit" class="w-full" :validation-schema="validate">
        <div
          v-for="{ as, name, children, icon, icon2, ...attrs } in schema"
          :key="name"
          class="relative"
        >
          <Field
            :as="as"
            :id="name"
            :name="name"
            v-bind="attrs"
            :ref="name"
            class="block w-full py-3 border rounded-lg dark:bg-gray-900 dark:border-gray-600 focus:border-blue-400 dark:focus:border-blue-300 focus:ring-blue-300 focus:outline-none focus:ring focus:ring-opacity-40 mt-8"
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
          <component
            :is="iconGroup[icon]"
            class="absolute top-3 mx-3 text-gray-300 dark:text-gray-500"
          />
          <component
            v-if="icon2"
            :is="iconGroup[showPasswordIcon]"
            class="absolute right-0 top-3 mx-3 text-gray-300 dark:text-gray-500"
            :class="{ 'stroke-white': showPasswordIcon === 'EyeIcon' }"
            @click="changIcon"
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
import { ref, computed, toRefs } from "vue";
import { Form, Field, ErrorMessage, useForm } from "vee-validate";
import { useRoute } from "vue-router";
import { useAuthStore } from "../../stores/auth";

import UserIcon from "../svg/UserIcon.vue";
import PasswordIcon from "../svg/PasswordIcon.vue";
import EmailIcon from "../svg/EmailIcon.vue";
import GenderIcon from "../svg/GenderIcon.vue";
import PaperIcon from "../svg/PaperIcon.vue";
import CalenderIcon from "../svg/CalenderIcon.vue";
import EyeCloseIcon from "../svg/EyeCloseIcon.vue";
import EyeIcon from "../svg/EyeIcon.vue";

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
const iconGroup = {
  UserIcon: UserIcon,
  PasswordIcon: PasswordIcon,
  EmailIcon: EmailIcon,
  GenderIcon: GenderIcon,
  PaperIcon: PaperIcon,
  CalenderIcon: CalenderIcon,
  EyeCloseIcon: EyeCloseIcon,
  EyeIcon: EyeIcon,
};

const { formSchema } = toRefs(useAuthStore());

const iconChange = ref(false);
const showPasswordIcon = computed(() => {
  return iconChange.value ? "EyeIcon" : "EyeCloseIcon";
});

function changIcon() {
  iconChange.value = !iconChange.value;
  if (iconChange.value) {
    formSchema.value[formName.value].password.type = "text";
    if (formSchema.value[formName.value].passwordConfirmed) {
      formSchema.value[formName.value].passwordConfirmed.type = "text";
    }
  } else {
    formSchema.value[formName.value].password.type = "password";
    if (formSchema.value[formName.value].passwordConfirmed) {
      formSchema.value[formName.value].passwordConfirmed.type = "password";
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
  width: 100%;
  min-height: 3.125rem;
  height: 100%;
  display: flex;
  flex-direction: row-reverse;
  --tw-text-opacity: 1;
  color: rgb(156 163 175 / var(--tw-text-opacity));
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
