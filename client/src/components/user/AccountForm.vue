<script setup lang="ts">
import type { Reader } from '@/openapi';
import { useAuthStore } from '@/stores/auth';
import { computed } from 'vue';

const authStore = useAuthStore();
const profile = computed(() => authStore.profile as Reader);
</script>

<template>
    <UCard>
        <template #header>
            <h3 class="text-base font-semibold leading-6">
                Thông tin tài khoản
            </h3>
            <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Thông tin tài khoản và đăng nhập
            </p>
        </template>

        <div class="grid gap-6">
            <UFormField label="Mã độc giả">
                <p class="text-sm font-medium">{{ profile.code }}</p>
            </UFormField>
            <UFormField label="Email">
                <p class="text-sm">{{ profile.email }}</p>
            </UFormField>
        </div>
    </UCard>
</template>
