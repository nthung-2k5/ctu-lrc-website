<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import type { Borrow, Book } from '@/openapi';
import { ReaderApi } from '@/api';

const isLoading = ref(true);

// Enhanced Borrow interface with book details
interface BorrowWithBook extends Borrow {
    bookDetails?: Book;
}

const borrowsWithBooks = ref<BorrowWithBook[]>([]);
const toast = useToast();

onMounted(async () => {
    await loadBorrowHistory();
});

async function loadBorrowHistory() {
    try {
        isLoading.value = true;

        // Use the dedicated API endpoint for reader borrow history
        const response = await ReaderApi.getBorrowHistory();

        if (response.data) {
            // The API should return borrow records with book details already included
            // If the API returns Borrow[] with book objects, we can use them directly
            borrowsWithBooks.value = response.data.map(borrow => ({
                ...borrow,
                bookDetails: typeof borrow.book === 'object' ? borrow.book : undefined
            }));
        } else {
            borrowsWithBooks.value = [];
        }
    } catch (error) {
        console.error('Failed to load borrow history:', error);
        toast.add({
            title: 'Lỗi',
            description: 'Không thể tải lịch sử mượn sách. Vui lòng thử lại.',
            color: 'error'
        });
    } finally {
        isLoading.value = false;
    }
}

function formatDate(dateString: string) {
    return new Date(dateString).toLocaleDateString('vi-VN');
}

function getBorrowStatus(borrow: BorrowWithBook) {
    if (borrow.returnDate) {
        return {
            label: 'Đã trả',
            variant: 'secondary' as const,
            class: 'text-gray-600'
        };
    }

    const dueDate = new Date(borrow.dueDate);
    const now = new Date();

    if (dueDate < now) {
        return {
            label: 'Quá hạn',
            variant: 'destructive' as const,
            class: 'text-red-600'
        };
    }

    const daysLeft = Math.ceil((dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

    if (daysLeft <= 3) {
        return {
            label: 'Sắp hết hạn',
            variant: 'outline' as const,
            class: 'text-yellow-600 border-yellow-300'
        };
    }

    return {
        label: 'Đang mượn',
        variant: 'default' as const,
        class: 'text-blue-600'
    };
}

function getDaysRemaining(dueDate: string) {
    const due = new Date(dueDate);
    const now = new Date();
    const diffTime = due.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
        return `Quá hạn ${Math.abs(diffDays)} ngày`;
    } else if (diffDays === 0) {
        return 'Hết hạn hôm nay';
    } else {
        return `Còn ${diffDays} ngày`;
    }
}

async function extendBorrow(_borrowId: string) {
    // In a real app, you'd call an API to extend the borrow period
    toast.add({
        title: 'Thông báo',
        description: 'Tính năng gia hạn sẽ được cập nhật sớm.',
        color: 'info'
    });
}

function viewBookDetails(bookId: string) {
    window.location.href = `/books/${bookId}`;
}

const currentBorrows = computed(() =>
    borrowsWithBooks.value.filter(b => !b.returnDate)
);

const pastBorrows = computed(() =>
    borrowsWithBooks.value.filter(b => b.returnDate)
);
</script>

<template>
    <div class="space-y-6">
        <!-- Header -->
        <div>
            <h2 class="text-3xl font-bold tracking-tight">Lịch sử mượn sách</h2>
            <p class="text-gray-500 dark:text-gray-400">
                Quản lý các sách bạn đã và đang mượn
            </p>
        </div>

        <!-- Loading State -->
        <div v-if="isLoading" class="flex items-center justify-center py-8">
            <div class="text-gray-500 dark:text-gray-400">Đang tải lịch sử mượn sách...</div>
        </div>

        <!-- Content -->
        <div v-else class="space-y-6">
            <!-- Current Borrows -->
            <UCard>
                <template #header>
                    <div class="flex items-center gap-2">
                        <span>📖</span>
                        <h3 class="text-base font-semibold leading-6 text-gray-900 dark:text-white">
                            Sách đang mượn
                        </h3>
                        <UBadge variant="outline">{{ currentBorrows.length }}</UBadge>
                    </div>
                    <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        Danh sách các sách bạn hiện đang mượn
                    </p>
                </template>

                <div v-if="currentBorrows.length === 0" class="text-center py-8 text-gray-500 dark:text-gray-400">
                    Bạn hiện không mượn sách nào.
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
                                    Ngày mượn</th>
                                <th
                                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    Hạn trả</th>
                                <th
                                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    Trạng thái</th>
                                <th
                                    class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    Thao tác</th>
                            </tr>
                        </thead>
                        <tbody class="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                            <tr v-for="borrow in currentBorrows" :key="borrow.id"
                                class="hover:bg-gray-50 dark:hover:bg-gray-800">
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <div class="space-y-1">
                                        <div class="font-medium hover:text-blue-600 cursor-pointer"
                                            @click="viewBookDetails(borrow.bookDetails?.id || (typeof borrow.book === 'string' ? borrow.book : borrow.book.id))">
                                            {{ borrow.bookDetails?.title }}
                                        </div>
                                        <div class="text-sm text-gray-500 dark:text-gray-400">
                                            {{ borrow.bookDetails?.author }}
                                        </div>
                                    </div>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                                    {{ formatDate(borrow.borrowDate) }}
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <div class="space-y-1">
                                        <div class="text-sm text-gray-900 dark:text-gray-100">{{
                                            formatDate(borrow.dueDate) }}</div>
                                        <div class="text-xs" :class="getBorrowStatus(borrow).class">
                                            {{ getDaysRemaining(borrow.dueDate) }}
                                        </div>
                                    </div>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <UBadge :color="getBorrowStatus(borrow).variant === 'destructive' ? 'error' :
                                        getBorrowStatus(borrow).variant === 'outline' ? 'warning' : 'primary'">
                                        {{ getBorrowStatus(borrow).label }}
                                    </UBadge>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap text-right">
                                    <UButton variant="outline" size="sm" @click="extendBorrow(borrow.id)">
                                        Gia hạn
                                    </UButton>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </UCard>

            <!-- Past Borrows -->
            <UCard>
                <template #header>
                    <div class="flex items-center gap-2">
                        <span>📚</span>
                        <h3 class="text-base font-semibold leading-6 text-gray-900 dark:text-white">
                            Lịch sử đã trả
                        </h3>
                        <UBadge variant="outline">{{ pastBorrows.length }}</UBadge>
                    </div>
                    <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        Danh sách các sách bạn đã trả
                    </p>
                </template>

                <div v-if="pastBorrows.length === 0" class="text-center py-8 text-gray-500 dark:text-gray-400">
                    Chưa có lịch sử trả sách.
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
                                    Ngày mượn</th>
                                <th
                                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    Hạn trả</th>
                                <th
                                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    Ngày trả</th>
                                <th
                                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    Trạng thái</th>
                            </tr>
                        </thead>
                        <tbody class="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                            <tr v-for="borrow in pastBorrows" :key="borrow.id"
                                class="hover:bg-gray-50 dark:hover:bg-gray-800">
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <div class="space-y-1">
                                        <div class="font-medium hover:text-blue-600 cursor-pointer"
                                            @click="viewBookDetails(borrow.bookDetails?.id || (typeof borrow.book === 'string' ? borrow.book : borrow.book.id))">
                                            {{ borrow.bookDetails?.title }}
                                        </div>
                                        <div class="text-sm text-gray-500 dark:text-gray-400">
                                            {{ borrow.bookDetails?.author }}
                                        </div>
                                    </div>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                                    {{ formatDate(borrow.borrowDate) }}
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                                    {{ formatDate(borrow.dueDate) }}
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                                    {{ borrow.returnDate ? formatDate(borrow.returnDate) : '—' }}
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <UBadge color="secondary">
                                        Đã trả
                                    </UBadge>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </UCard>
        </div>
    </div>
</template>
