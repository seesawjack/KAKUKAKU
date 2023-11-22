<template>
    <section class="px-5">
        <div class="container mx-auto">
            <div class="flex items-center justify-center mt-6">
                <p class="w-2/3 pb-4 font-medium text-white text-xl capitalize border-b border-sky-400">
                    請輸入信箱
                </p>
            </div>
            <p class="mt-10 text-base text-left">請輸入您註冊時的信箱，我們會發送更新密碼的連結到您的信箱</p>
            <div class="text-sm text-left text-gray-300 mt-2">
                <p>※ 若收件匣無顯示新郵件，請至垃圾郵件尋找</p>
                <p>※ 更新密碼郵件有時間限制，若十分鐘內未點擊連結請重新申請</p>
            </div>



            <atmos-form :form-type="'passwordForget'" :schema="formSchema['passwordForget']"
                :validate="validate['passwordForget']" :button="buttonState" @submit="handleSubmit" />
        </div>
    </section>
</template>

<script setup>
import { ref } from 'vue';
import { useAuthStore } from '../../stores/auth';
import { useSupabase } from '../../composables/useSupabase';

import AtmosForm from '../atmos/AtmosForm.vue';

const { formSchema, validate } = useAuthStore();
const { sbRequest,sendPasswordResetEmail } = useSupabase();

const buttonState = ref({ state: true, name: "下一步" })

async function handleSubmit(form) {
    await sbRequest(sendPasswordResetEmail,{email:form.info.email});
    buttonState.value = { state: false, name: '已送出，請到信箱確認信件' }
}
</script>