<template>
  <section>
    <atmos-dialog :show="isError" :title="errorMessage" @close="showDialog" />
    <div class="container flex items-center justify-center px-6 mx-auto">
      <form class="w-full max-w-md" @submit.prevent="sendAuth">
        <!-- sign in & sign up href -->
        <div class="flex items-center justify-center mt-6">
          <a
            href="/signin"
            class="w-1/3 pb-4 font-medium text-center text-gray-500 capitalize border-b"
            :class="[isSigninpage ? isSigninClass : '']"
          >
            登入
          </a>

          <a
            href="/signup"
            class="w-1/3 pb-4 font-medium text-center text-gray-600 capitalize border-b"
            :class="[!isSigninpage ? isSigninClass : '']"
          >
            註冊
          </a>
        </div>
        <!-- 輸入框群組 -->
        <slot name="input"></slot>
        <!-- 按鈕群組 -->
        <slot name="button"></slot>
      </form>
    </div>
  </section>
</template>

<script setup>
import { ref, computed } from "vue";
import { useRoute } from "vue-router";
import { useAuthStore } from "../../stores/auth";
import AtmosDialog from "../atmos/AtmosDialog.vue";

const route = useRoute();
const {
  formInfo: { signin, signup },
} = useAuthStore();
const isSigninClass = ref("border-b-2 border-blue-500 text-white");
const isSigninpage = computed(() => {
  return route.path.indexOf("signin") !== -1;
});
const isError = ref(false);
const errorMessage = ref("");
function showDialog(value) {
  isError.value = value ? true : false;
}

function sendAuth() {
  if (isSigninpage.value) {
    const signinInfo = {
      email: signin.email.value,
      password: signin.password.value,
    };
    Object.values(signinInfo).map((input,index)=>{
      if(!input){
        isError.value = true;
        errorMessage.value = '帳號或密碼為空';
      }
      // if(index === 2 ){
      // }
      
      console.log('%c 結果(藍) ', 'background: #009393; color: #ffffff',/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,30}$/g.test(input));
    })
  } else {
    const signupInfo = {
      name: signup.userName.value,
      email: signup.email.value,
      password: signup.password.value,
      checkPassword: signup.checkPassword.value,
    };
    console.log(
      "%c 結果(綠) ",
      "background: #006400; color: #ffffff",
      signupInfo
    );
  }
}
</script>
