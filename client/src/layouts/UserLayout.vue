<script setup lang="ts">
import CTULogo from '/CTULogo.svg?url';
import { computed, ref } from 'vue';

import type { NavigationMenuItem } from '@nuxt/ui';
import { useAuthStore } from '@/stores/auth';
import type { Reader } from '@/openapi';
import { useRouter } from 'vue-router';

const authStore = useAuthStore();
const router = useRouter();
const isAuthenticated = computed(() => authStore.isReader);
const user = computed(() => authStore.profile as Reader | null);

const handleLogout = async () => {
    await authStore.logout();
    router.go(0);
};

const headerMenuItems = ref<NavigationMenuItem[][]>([
    [
        {
            label: 'Trang chủ',
            to: '/',
            icon: 'i-heroicons-home',
            activeClass: 'text-primary'
        },
        {
            label: 'Thư viện sách',
            to: '/books',
            icon: 'i-heroicons-book-open',
            activeClass: 'text-primary'
        },
        {
            slot: 'search',
        }
    ],
    (isAuthenticated.value ? [
        {
            label: user.value ? `${user.value.lastName} ${user.value.firstName}` : 'Tài khoản',
            to: '/user/profile',
            icon: 'i-heroicons-user-circle',
            visible: isAuthenticated.value
        },
        {
            label: 'Đăng xuất',
            onSelect: handleLogout,
            icon: 'i-heroicons-arrow-right-on-rectangle',
            visible: isAuthenticated.value
        }
    ] : [
        {
            label: 'Đăng nhập',
            to: '/login',
            visible: !isAuthenticated.value
        },
        {
            label: 'Đăng ký',
            to: '/register',
            visible: !isAuthenticated.value
        }
    ])
]);

</script>

<template>
    <!-- Top Header -->
    <header class="bg-default/75 backdrop-blur border-b border-default h-16 sticky top-0 z-50 w-full">
        <UContainer class="flex items-center justify-between gap-3 h-full">
            <RouterLink to="/">
                <img :src="CTULogo" class="h-10" alt="CTU Logo">
            </RouterLink>
            <UNavigationMenu variant="link" :items="headerMenuItems" class="hidden lg:flex flex-1">
                <!-- <template #search>
                    <SearchCommand />
                </template> -->
            </UNavigationMenu>
        </UContainer>
    </header>

    <!-- Main Content Area -->
    <main>
        <slot />
    </main>

    <!-- Footer -->
    <footer class="bg-gray-900 text-white">
        <div class="container mx-auto px-4 py-12">
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <!-- CTU Info -->
                <div class="space-y-4">
                    <div class="flex items-center space-x-2">
                        <img :src="CTULogo" class="h-8" alt="CTU Logo">
                        <span class="font-bold text-lg">CTU Library</span>
                    </div>
                    <p class="text-gray-300 text-sm">
                        Thư viện Đại học Cần Thơ - Trung tâm tri thức và học tập hàng đầu tại ĐBSCL
                    </p>
                    <div class="text-sm text-gray-400">
                        <p>Đại học Cần Thơ</p>
                        <p>Khu II, đường 3/2, P. Ninh Kiều, TP. Cần Thơ</p>
                        <p>Email: library@ctu.edu.vn</p>
                        <p>Điện thoại: (0292) 3831301</p>
                    </div>
                </div>

                <!-- Quick Links -->
                <div class="space-y-4">
                    <h4 class="font-semibold text-lg">Liên kết nhanh</h4>
                    <ul class="space-y-2 text-sm">
                        <li>
                            <RouterLink to="/" class="text-gray-300 hover:text-white transition-colors">
                                Trang chủ
                            </RouterLink>
                        </li>
                        <li>
                            <RouterLink to="/books" class="text-gray-300 hover:text-white transition-colors">
                                Thư viện sách
                            </RouterLink>
                        </li>
                        <li v-if="!isAuthenticated">
                            <RouterLink to="/login" class="text-gray-300 hover:text-white transition-colors">
                                Đăng nhập
                            </RouterLink>
                        </li>
                        <li v-if="!isAuthenticated">
                            <RouterLink to="/register" class="text-gray-300 hover:text-white transition-colors">
                                Đăng ký
                            </RouterLink>
                        </li>
                    </ul>
                </div>

                <!-- Operating Hours -->
                <div class="space-y-4">
                    <h4 class="font-semibold text-lg">Giờ mở cửa</h4>
                    <div class="text-sm text-gray-300 space-y-1">
                        <div class="flex justify-between">
                            <span>Thứ 2 - Thứ 6:</span>
                            <span>7:00 - 21:00</span>
                        </div>
                        <div class="flex justify-between">
                            <span>Thứ 7:</span>
                            <span>8:00 - 17:00</span>
                        </div>
                        <div class="flex justify-between">
                            <span>Chủ nhật:</span>
                            <span>8:00 - 17:00</span>
                        </div>
                    </div>
                    <div class="pt-4">
                        <h5 class="font-medium text-sm mb-2">Theo dõi chúng tôi</h5>
                        <div class="flex space-x-3">
                            <UButton to="#" variant="ghost" icon="i-simple-icons-twitter" size="xs" color="neutral"
                                class="text-gray-300 hover:text-white" />
                            <UButton to="#" variant="ghost" icon="i-simple-icons-facebook" size="xs" color="neutral"
                                class="text-gray-300 hover:text-white" />
                            <UButton to="#" variant="ghost" icon="i-simple-icons-youtube" size="xs" color="neutral"
                                class="text-gray-300 hover:text-white" />
                        </div>
                    </div>
                </div>
            </div>

            <!-- Bottom Footer -->
            <USeparator class="my-8" />
            <div class="flex flex-col md:flex-row justify-between items-center">
                <p class="text-sm text-gray-400">
                    © {{ new Date().getFullYear() }} Đại học Cần Thơ. Tất cả quyền được bảo lưu.
                </p>
                <div class="flex space-x-6 mt-4 md:mt-0">
                    <UButton to="#" variant="link" size="xs" class="text-gray-400 hover:text-white">
                        Chính sách bảo mật
                    </UButton>
                    <UButton to="#" variant="link" size="xs" class="text-gray-400 hover:text-white">
                        Điều khoản sử dụng
                    </UButton>
                    <UButton to="#" variant="link" size="xs" class="text-gray-400 hover:text-white">
                        Hỗ trợ
                    </UButton>
                </div>
            </div>
        </div>
    </footer>
</template>

<style scoped></style>