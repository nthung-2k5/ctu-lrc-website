<script setup lang="ts">
import { ref, computed } from 'vue';
import { useAuthStore } from '@/stores/auth';
import type { Reader } from '@/openapi';
import type { NavigationMenuItem } from '@nuxt/ui';
import { useRoute } from 'vue-router';

const authStore = useAuthStore();

const route = useRoute();
const activeTab = computed(() => route.params.activeTab || 'dashboard');

const profile = computed(() => authStore.profile as Reader);
const fullName = computed(() => `${profile.value.lastName} ${profile.value.firstName}`);

const navigationLinks = ref<NavigationMenuItem[]>([
    {
        label: 'Thông tin cá nhân',
        icon: 'i-heroicons-user',
        to: '/user/profile'
    },
    {
        label: 'Thông tin mượn sách',
        icon: 'i-heroicons-book-open',
        children: [
            {
                label: 'Lịch sử mượn sách',
                icon: 'i-heroicons-archive-box',
                to: '/user/borrows'
            },
            {
                label: 'Yêu cầu giữ sách',
                icon: 'i-heroicons-clock',
                to: '/user/hold-requests'
            }
        ]
    }
]);

</script>

<template>
    <UContainer class="py-4">
        <div>
            <h2 class="text-2xl font-semibold">
                {{ fullName }} ({{ profile.code }})
            </h2>
        </div>
        <div class="flex gap-6 mt-6">
            <UNavigationMenu :items="navigationLinks" orientation="vertical" class="w-56" />
            <section class="flex-1">
                <UserProfile v-if="activeTab === 'profile'" />
                <UserBorrowHistory v-else-if="activeTab === 'borrows'" />
                <UserHoldRequests v-else-if="activeTab === 'hold-requests'" />
            </section>
        </div>
    </UContainer>
</template>
