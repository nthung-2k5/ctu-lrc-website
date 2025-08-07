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
    identifier: z.string({ error: 'Vui lòng nhập tên đăng nhập' }),
    password: z.string().min(8, 'Mật khẩu phải có ít nhất 8 ký tự'),
});

type Schema = z.output<typeof schema>;

const state = ref<Partial<Schema>>({
    identifier: undefined,
    password: undefined
});

const onSubmit = async (event: FormSubmitEvent<Schema>) => {
    loading.value = true;
    const success = await authStore.loginAsStaff(event.data);
    loading.value = false;

    if (success) {
        router.push('/');
    }
};
</script>

<template>
    <UForm :schema :state @submit="onSubmit" class="space-y-4">
        <UFormField label="Tên đăng nhập" name="username">
            <UInput v-model="state.identifier" type="text" placeholder="username" autocomplete="username"
                class="w-full" />
        </UFormField>

        <UFormField label="Mật khẩu" name="password">
            <UInput v-model="state.password" type="password" placeholder="••••••••"
                autocomplete="current-password" class="w-full" />
        </UFormField>

        <UButton label="Đăng nhập" type="submit" block loading-auto />
    </UForm>
</template>

<style scoped></style>