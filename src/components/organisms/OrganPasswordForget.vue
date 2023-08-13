<template>
    <section>
        <div class="container mx-auto">
            <div class="flex items-center justify-center mt-6">
                <p class="w-2/3 pb-4 font-medium text-center text-white text-xl capitalize border-b border-sky-400">
                    請輸入信箱
                </p>
            </div>
            <p class="mt-10">請輸入您註冊時的信箱，我們會發送更新密碼的連結到您的信箱</p>
            <div class="text-sm text-left text-gray-300">
                <p>※ 若收件匣無顯示新郵件，請至垃圾郵件尋找</p>
                <p>※ 更新密碼郵件有時間限制，若十分鐘內未點擊連結請重新申請</p>
            </div>



            <atmos-form :form-type="'passwordForget'" :schema="formSchema['passwordForget']"
                :validate="validate['passwordForget']" :button="buttonState" @submit="handleSubmit" />
        </div>
    </section>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useAuthStore } from '../../stores/auth';
import { useRoute } from "vue-router";
import useSupabase from "../../stores/supabase";
import { useGlobalStore } from '../../stores';

import AtmosForm from '../atmos/AtmosForm.vue';

const route = useRoute();
const { formSchema, validate } = useAuthStore();
const { loadingState, isError } = useGlobalStore();
const { supabase } = useSupabase();

const buttonState = ref({ state: true, name: "下一步" })

async function handleSubmit(form) {
    loadingState(true);
    const { data, error } = await supabase.auth.resetPasswordForEmail(form.info.email, {
        redirectTo: 'http://localhost:5173/account/update-password',
    });
    if (error) {
        isError({ showError: true, message: "目前系統運載繁重，請稍後再試" });
        buttonState.value = { state: false, name: '請稍後再試' }
        loadingState(false);
        return;
    }
    loadingState(false);
    buttonState.value = { state: false, name: '已送出，請到信箱確認信件' }
}
</script>