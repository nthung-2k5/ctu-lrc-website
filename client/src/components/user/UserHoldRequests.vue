<script setup lang="ts">
import { ref, onMounted } from 'vue';
import type { HoldRequest } from '@/openapi';
import api, { ReaderApi } from '@/api';
import { useRouter } from 'vue-router';
import { add } from "date-fns";

const holdRequests = ref<HoldRequest[]>([]);
const router = useRouter();

const loadData = async () => {
    try {
        // Get hold requests from API
        holdRequests.value = (await ReaderApi.getHoldRequests()).data;
    } catch (error) {
        console.error('Failed to load hold requests:', error);
    }
};

onMounted(loadData);

async function cancelHoldRequest(bookId: string) {
    try {
        await api.reader.cancelHoldRequest({ bookId });
        loadData();
    } catch (error) {
        console.error('Failed to cancel hold request:', error);
    }
}

function viewBookDetails(bookId: string) {
    router.push(`/books/${bookId}`);
}

function navigateToBooks() {
    router.push('/books');
}
</script>

<template>
    <div class="space-y-6">
        <!-- Header -->
        <div>
            <h2 class="text-3xl font-bold tracking-tight">Yêu cầu giữ sách</h2>
            <p class="text-gray-500 dark:text-gray-400">
                Quản lý các yêu cầu giữ sách của bạn
            </p>
        </div>

        <!-- Loading State -->
        <!-- <div v-if="isLoading" class="flex items-center justify-center py-8">
            <div class="text-gray-500 dark:text-gray-400">Đang tải danh sách yêu cầu giữ sách...</div>
        </div> -->

        <!-- Content -->
        <div class="space-y-6">
            <!-- Info Card -->
            <UCard class="border-blue-200 bg-blue-50 dark:bg-blue-900 dark:border-blue-800">
                <div class="flex items-start space-x-3">
                    <span class="text-2xl">ℹ️</span>
                    <div class="space-y-1">
                        <h4 class="text-sm font-medium text-blue-900 dark:text-blue-100">Thông tin về yêu cầu giữ sách
                        </h4>
                        <p class="text-sm text-blue-700 dark:text-blue-200">
                            Khi bạn yêu cầu giữ sách, hệ thống sẽ ưu tiên cho bạn mượn sách đó khi có sẵn.
                            Yêu cầu giữ sách có thời hạn 24 giờ kể từ ngày tạo.
                        </p>
                    </div>
                </div>
            </UCard>

            <!-- Active Hold Requests -->
            <UCard>
                <template #header>
                    <div class="flex items-center gap-2">
                        <span>⏰</span>
                        <h3 class="text-base font-semibold leading-6 text-gray-900 dark:text-white">
                            Yêu cầu đang chờ
                        </h3>
                        <UBadge variant="outline">{{ holdRequests.length }}</UBadge>
                    </div>
                    <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        Danh sách các yêu cầu giữ sách còn hiệu lực
                    </p>
                </template>

                <div v-if="holdRequests.length === 0" class="text-center py-8 text-gray-500 dark:text-gray-400">
                    <div class="space-y-2">
                        <div class="text-4xl">📭</div>
                        <div>Bạn hiện không có yêu cầu giữ sách nào.</div>
                        <UButton variant="outline" @click="navigateToBooks">
                            Tìm kiếm sách để đặt giữ
                        </UButton>
                    </div>
                </div>
                <div v-else class="overflow-x-auto">
                    <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead class="bg-gray-50 dark:bg-gray-800">
                            <tr>
                                <th
                                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    Sách</th>
                                <th
                                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    Ngày yêu cầu</th>
                                <th
                                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    Hạn giữ sách</th>
                                <th
                                    class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    Thao tác</th>
                            </tr>
                        </thead>
                        <tbody class="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                            <tr v-for="hold in holdRequests" class="hover:bg-gray-50 dark:hover:bg-gray-800">
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <div class="space-y-1">
                                        <div class="font-medium hover:text-blue-600 cursor-pointer"
                                            @click="viewBookDetails(hold.book.id)">
                                            {{ hold.book.title }}
                                        </div>
                                        <div class="text-sm text-gray-500 dark:text-gray-400">
                                            {{ hold.book.author }}
                                        </div>
                                    </div>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                                    {{ new Date(hold.holdDate).toLocaleDateString('vi-VN') }}
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    {{ add(new Date(hold.holdDate), { days: 1 }).toLocaleDateString('vi-VN') }}
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap text-right">
                                    <UButton variant="outline" size="sm" @click="cancelHoldRequest(hold.book.id)" color="error">
                                        Hủy yêu cầu
                                    </UButton>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </UCard>
        </div>
    </div>
</template>
