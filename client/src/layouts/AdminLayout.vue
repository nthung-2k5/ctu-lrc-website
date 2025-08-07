<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { useRouter } from 'vue-router';
import { LogOut, Home } from 'lucide-vue-next';
import type { Staff } from '@/openapi';

const authStore = useAuthStore();
const router = useRouter();

const user = computed(() => authStore.profile as Staff);

// Update screen width for mobile warning
onMounted(() => {
    const updateScreenWidth = () => {
        const element = document.getElementById('screen-width');
        if (element) {
            element.textContent = window.innerWidth.toString();
        }
    };

    updateScreenWidth();
    window.addEventListener('resize', updateScreenWidth);
});

const handleLogout = async () => {
    await authStore.logout();
    router.push('/');
};
</script>

<template>
    <!-- Mobile Warning Screen (below lg breakpoint) -->
    <div class="lg:hidden h-screen bg-gray-50 flex items-center justify-center p-6">
        <div class="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
            <!-- CTU Logo -->
            <div class="mb-6">
                <img src="/CTULogo.svg" alt="CTU" class="size-16 mx-auto" />
            </div>

            <!-- Warning Icon -->
            <div class="mb-4">
                <div class="size-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto">
                    <svg class="size-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 19.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                </div>
            </div>

            <!-- Warning Message -->
            <h2 class="text-xl font-bold text-gray-900 mb-4">
                Màn hình quá nhỏ
            </h2>
            <p class="text-gray-600 mb-6">
                Trang quản trị yêu cầu màn hình lớn hơn để hiển thị đầy đủ chức năng.
                Vui lòng sử dụng máy tính hoặc tablet lớn để truy cập.
            </p>

            <!-- Action Buttons -->
            <div class="space-y-3">
                <UButton label="Về trang chính" icon="i-heroicons-home" @click="router.push('/')" block>
                    <Home class="mr-2 size-4" />
                    Về trang chính
                </UButton>
                <UButton label="Đăng xuất" @click="handleLogout" variant="outline" block>
                    <LogOut class="mr-2 size-4" />
                </UButton>
            </div>

            <!-- Technical Info -->
            <div class="mt-6 pt-4 border-t text-xs text-gray-500">
                <p>Yêu cầu độ phân giải tối thiểu: 1024px</p>
                <p>Độ phân giải hiện tại: <span id="screen-width"></span>px</p>
            </div>
        </div>
    </div>

    <!-- Desktop Admin Layout (lg breakpoint and above) -->
    <div class="hidden lg:flex h-screen bg-default">
        <!-- Sidebar -->
        <div class="sticky w-56 bg-elevated/25 flex flex-col border-r border-default">
            <!-- Sidebar Header -->
            <div class="flex items-center justify-between h-16 px-6">
                <div class="flex items-center space-x-2">
                    <img src="/CTULogo.svg" alt="CTU" class="w-full" />
                </div>
            </div>

            <USeparator />

            <UNavigationMenu :items="[
                { label: 'Tổng quan', icon: 'i-lucide-layout-dashboard', to: '/admin' },
                { label: 'Quản lý sách', icon: 'i-lucide-book-open', to: '/admin/books' },
                ...[authStore.isAdmin ? { label: 'Quản lý người dùng', icon: 'i-lucide-users', to: '/admin/users' } : {}],
                { label: 'Quản lý nhà xuất bản', icon: 'i-lucide-book-open', to: '/admin/publishers' },
                { label: 'Mượn trả sách', icon: 'i-lucide-clipboard-list', to: '/admin/lending' }
            ]" orientation="vertical" class="flex-1 px-4 py-6" />

            <USeparator />

            <div class="p-4">
                <div class="flex items-center py-2 mb-2">
                    <div class="ml-3 flex-1 min-w-0">
                        <p class="text-sm font-medium text-gray-900 truncate">
                            {{ user.name || 'Admin' }}
                        </p>
                        <p class="text-xs text-gray-500 truncate">
                            {{ user.username || 'admin@ctu.edu.vn' }}
                        </p>
                    </div>
                    <UBadge variant="solid" class="ml-2">{{ user.role === 'admin' ? 'Admin' : 'Nhân viên' }}</UBadge>
                </div>

                <UButton label="Đăng xuất" @click="handleLogout" variant="ghost" color="error" block
                    icon="i-lucide-log-out" />
            </div>
        </div>

        <!-- Page Content -->
        <main class="flex-1 overflow-auto">
            <slot />
        </main>
    </div>
</template>
