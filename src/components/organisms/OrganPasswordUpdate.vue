<template>
    <section>
        <div class="container mx-auto w-full">
            <div class="w-full flex items-center justify-center mt-6">
                <p class="w-2/3 pb-4 font-medium text-center text-white text-3xl capitalize border-b border-sky-400">
                    更新密碼
                </p>
            </div>
            <atmos-form :schema="formSchema['passwordUpdate']" :validate="validate['passwordUpdate']" :button="buttonState"
                @submit="handleSubmit" :form-type="'passwordUpdate'"/>
        </div>
    </section>
</template>

<script setup>
import { ref,computed } from 'vue';
import { useAuthStore } from '../../stores/auth';
import { useRoute } from "vue-router";
import useSupabase from "../../stores/supabase";
import { useGlobalStore } from '../../stores';

import AtmosForm from '../atmos/AtmosForm.vue';

const route = useRoute();
const { formSchema, validate } = useAuthStore();
const { loadingState } = useGlobalStore();
const { supabase } = useSupabase();

const buttonState = ref({ state: true, name: "確認送出" })

async function handleSubmit(form) {
    loadingState(true);
    await supabase.auth.updateUser({ password: form.info.password })
    loadingState(false);
    buttonState.value = { state: false, name: '已送出' }
}
</script>