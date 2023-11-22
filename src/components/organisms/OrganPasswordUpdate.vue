<template>
    <section class="max-w-md w-full">
        <div class="container mx-auto">
            <div class="w-full flex items-center justify-center mt-6">
                <p class="w-2/3 pb-4 font-medium text-center text-white text-xl capitalize border-b border-sky-400">
                    更新密碼
                </p>
            </div>
            <atmos-form :schema="formSchema['passwordUpdate']" :validate="validate['passwordUpdate']" :button="buttonState"
                @submit="handleSubmit" :form-type="'passwordUpdate'"/>
        </div>
    </section>
</template>

<script setup>
import { ref } from 'vue';
import { useAuthStore } from '../../stores/auth';
import { useSupabase } from '../../composables/useSupabase';

import AtmosForm from '../atmos/AtmosForm.vue';

const { formSchema, validate } = useAuthStore();
const { sbRequest,handlePasswordReset } = useSupabase();

const buttonState = ref({ state: true, name: "確認送出" })

async function handleSubmit(form) {
    await sbRequest(handlePasswordReset,{password:form.info.password});
    buttonState.value = { state: false, name: '已送出' }
}
</script>