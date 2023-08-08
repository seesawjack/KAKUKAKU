<template>
  <section>
    <div class="container mx-auto">
      <div class="flex items-center justify-center mt-6">
        <p
          class="w-2/3 pb-4 font-medium text-center text-white capitalize border-b border-sky-400"
        >
          網站問題回饋
        </p>
      </div>
      <atmos-form
        :schema="formSchema['feedback']"
        :validate="validate['feedback']"
        :button="buttonState"
        @submit="handleSubmit"
      ></atmos-form>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useAuthStore } from "../../stores/auth";
import { useGlobalStore } from "../../stores";

import AtmosForm from "../atmos/AtmosForm.vue";

const { formSchema, validate, isLoggedIn, handleFeedBack } = useAuthStore();
const { isError } = useGlobalStore();

const buttonState = ref({ state: true, name: "確認送出" });

//送出意見回饋
async function handleSubmit(form) {
  const result = await handleFeedBack(form.info);
  if (result.message === "success") {
    buttonState.value = { state: false, name: "已送出" };
  } else {
    isError({ showError: true, message: result.data.toString() });
  }
}
onMounted(() => {
  if (!isLoggedIn()) {
    buttonState.value = { state: false, name: "請先登入會員" };
  }
});
</script>

<style scoped>
.atThisTab {
  border-bottom-width: 2px;
  --tw-border-opacity: 1;
  border-color: rgb(70 176 221 / var(--tw-border-opacity));
  color: rgb(255 255 255 / var(--tw-text-opacity));
}
</style>
