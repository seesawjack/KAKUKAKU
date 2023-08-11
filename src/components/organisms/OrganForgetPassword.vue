<template>
    <atmos-form :schema="formSchema['forgetPassword']" :validate="validate['forgetPassword']" :button="buttonState" @submit="handleSubmit"/>
</template>

<script setup>
import { computed } from 'vue';
import { useAuthStore } from '../../stores/auth';
import { useRoute } from "vue-router";

import AtmosForm from '../atmos/AtmosForm.vue';

const route = useRoute();
const { formSchema, validate } = useAuthStore();


const buttonState = computed(()=>{
  return route.path.indexOf("login") > -1 ? { state: true, name: "登入" }
    : { state: true, name: "下一步" };

})
function handleSubmit(){
    console.log('%c 打印結果(紅)','color:red;font-size:15px;background:#ddd','確認');
}
</script>