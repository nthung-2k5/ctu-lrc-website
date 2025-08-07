<script setup lang="ts">
import { useAuthStore } from '@/stores/auth';
import type { FormSubmitEvent } from '@nuxt/ui';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import * as z from 'zod';

const authStore = useAuthStore();
const router = useRouter();
const loading = ref(false);

const schema = z.object({
    identifier: z.string().email('Email không hợp lệ'),
    password: z.string().min(8, 'Mật khẩu phải có ít nhất 8 ký tự'),
});

type Schema = z.output<typeof schema>;

const state = ref<Partial<Schema>>({
    identifier: undefined,
    password: undefined
});

const onSubmit = async (event: FormSubmitEvent<Schema>) => {
    loading.value = true;
    const success = await authStore.loginAsReader(event.data);
    loading.value = false;

    if (success) {
        router.push('/');
    }
};
</script>

<template>
    <UForm :schema :state @submit="onSubmit" class="space-y-4">
        <UFormField label="Email" name="email">
            <UInput v-model="state.identifier" placeholder="email@example.com" autocomplete="email" class="w-full" />
        </UFormField>

        <UFormField label="Mật khẩu" name="password">
            <UInput v-model="state.password" type="password" placeholder="••••••••" autocomplete="current-password"
                class="w-full" />
        </UFormField>

        <UButton label="Đăng nhập" type="submit" block loading-auto />

        <div class="text-sm text-center text-gray-600 dark:text-gray-400">
            Chưa có tài khoản?
            <UButton label="Đăng ký ngay" variant="link" class="p-0 ml-1" @click="$router.push('/register')" />
        </div>
    </UForm>
</template>

<style scoped></style>