<script setup lang="tsx">
import { BorrowApi } from '@/api';
import AdminContentLayout from '@/layouts/AdminContentLayout.vue';
import BorrowModal from '@/components/admin/BorrowModal.vue';
import type { Borrow, HoldRequest } from '@/openapi';
import type { TableColumn } from '@nuxt/ui';
import { ref, onMounted, computed } from 'vue';
import UButton from '@nuxt/ui/components/Button.vue';
import UTooltip from '@nuxt/ui/components/Tooltip.vue';

const holdRequests = ref<HoldRequest[]>([]);
const borrowingRecords = ref<Borrow[]>([]);
const selectedStatus = ref('all');
const showBorrowModal = ref(false);
const selectedBorrow = ref<Borrow | undefined>(undefined);
const borrowModalMode = ref<'view' | 'create' | 'edit'>('view');

const tabs = [
    {
        key: 'borrowings',
        label: 'Giao dịch mượn',
        icon: 'i-heroicons-book-open'
    },
    {
        key: 'holds',
        label: 'Yêu cầu giữ sách',
        icon: 'i-heroicons-check-circle'
    }
];

const loadData = async () => {
    holdRequests.value = (await BorrowApi.listHoldRequests()).data;
    borrowingRecords.value = (await BorrowApi.list()).data;
};

const onBorrowModalClose = (shouldRefresh?: boolean) => {
    showBorrowModal.value = false;
    selectedBorrow.value = undefined;
    if (shouldRefresh) {
        loadData();
    }
};

const acceptHoldRequest = async (holdId: string) => {
    await BorrowApi.acceptBorrowFromHoldRequest({}, { holdId });
    loadData();
};

const returnBook = async (borrowId: string) => {
    await BorrowApi.return({ borrowId });
    loadData();
};

const holdRequestsColumns: TableColumn<HoldRequest>[] = [
    {
        header: 'Độc giả',
        cell: ({ row }) => `${row.original.reader.lastName} ${row.original.reader.firstName}`
    },
    {
        header: 'Sách',
        cell: ({ row }) => row.original.book.title
    },
    { accessorKey: 'holdDate', header: 'Ngày giữ', cell: ({ row }) => new Date(row.original.holdDate).toLocaleDateString() },
    { accessorKey: 'expiryDate', header: 'Ngày hết hạn', cell: ({ row }) => new Date(row.original.expiryDate).toLocaleDateString() },
    {
        id: 'actions',
        header: 'Hành động',
        cell: ({ row }) => (<div class={'flex gap-2'}>
            <UTooltip text="Chấp nhận yêu cầu mượn sách">
                <UButton icon="i-heroicons-check" color="success" variant='ghost' loadingAuto onClick={() => acceptHoldRequest(row.original.id)} />
            </UTooltip>
            <UTooltip text="Xem chi tiết">
                <UButton icon="i-heroicons-eye" color="neutral" variant="ghost" />
            </UTooltip>
        </div>)
    }
];

const borrowingColumns: TableColumn<Borrow>[] = [
    {
        header: 'Độc giả',
        cell: ({ row }) => `${row.original.reader.lastName} ${row.original.reader.firstName}` // Borrow.reader is a Reader object
    },
    {
        header: 'Sách',
        cell: ({ row }) => row.original.book.title // Borrow.book is a Book object
    },
    { accessorKey: 'borrowDate', header: 'Ngày mượn', cell: ({ row }) => new Date(row.original.borrowDate).toLocaleDateString('vi-VN') },
    { accessorKey: 'dueDate', header: 'Ngày trả dự kiến', cell: ({ row }) => new Date(row.original.dueDate).toLocaleDateString('vi-VN') },
    { accessorKey: 'returnDate', header: 'Ngày trả', cell: ({ row }) => row.original.returnDate ? new Date(row.original.returnDate).toLocaleDateString('vi-VN') : 'Chưa trả' },
    {
        accessorKey: 'status',
        header: 'Trạng thái',
        cell: ({ row }) => {
            const status = row.original.status;
            const statusMap = {
                'borrowing': 'Đang mượn',
                'overdue': 'Quá hạn',
                'returned': 'Đã trả'
            };
            return statusMap[status] || status;
        }
    },
    {
        id: 'actions',
        header: 'Thao tác',
        cell: ({ row }) => (
            <div class="flex gap-2">
                {...[row.original.status !== 'returned' ? <UTooltip text="Trả sách">
                    <UButton icon="i-heroicons-check" color="success" variant="ghost" loadingAuto onClick={() => returnBook(row.original.id)} />
                </UTooltip> : null]}
                <UTooltip text="Xem chi tiết">
                    <UButton icon="i-heroicons-eye" color="neutral" variant="ghost" onClick={() => {
                        selectedBorrow.value = row.original;
                        borrowModalMode.value = 'view';
                        showBorrowModal.value = true;
                    }} />
                </UTooltip>
            </div>
        )
    }
];

// Filter borrowing records based on search and status
const filteredBorrowingRecords = computed(() => {
    let filtered = borrowingRecords.value;

    if (selectedStatus.value !== 'all') {
        const statusMap = {
            'active': 'borrowing',
            'overdue': 'overdue',
            'returned': 'returned'
        };
        filtered = filtered.filter(record => record.status === statusMap[selectedStatus.value as keyof typeof statusMap]);
    }

    return filtered;
});

const activeRecords = computed(() => borrowingRecords.value.filter(record => record.status === 'borrowing'));
const overdueRecords = computed(() => borrowingRecords.value.filter(record => record.status === 'overdue'));

onMounted(loadData);

</script>

<template>
    <AdminContentLayout title="Mượn trả sách">
        <template #header-buttons>
            <UButton label="Làm mới" @click="loadData" loading-auto color="primary" icon="i-heroicons-arrow-path" />
        </template>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <UCard>
                <template #header>
                    <div class="flex flex-row items-center justify-between space-y-0 pb-2">
                        <h3 class="text-sm font-medium">Đang mượn</h3>
                        <UIcon name="i-heroicons-book-open" class="w-4 h-4 text-gray-400" />
                    </div>
                </template>
                <div class="text-2xl font-bold">{{ activeRecords.length }}</div>
            </UCard>

            <UCard>
                <template #header>
                    <div class="flex flex-row items-center justify-between space-y-0 pb-2">
                        <h3 class="text-sm font-medium">Quá hạn</h3>
                        <UIcon name="i-heroicons-exclamation-triangle" class="w-4 h-4 text-red-500" />
                    </div>
                </template>
                <div class="text-2xl font-bold text-red-600">{{ overdueRecords.length }}</div>
            </UCard>

            <UCard>
                <template #header>
                    <div class="flex flex-row items-center justify-between space-y-0 pb-2">
                        <h3 class="text-sm font-medium">Đang giữ</h3>
                        <UIcon name="i-heroicons-check-circle" class="w-4 h-4 text-gray-400" />
                    </div>
                </template>
                <div class="text-2xl font-bold">{{ holdRequests.length }}</div>
            </UCard>
        </div>

        <div class="space-y-4">
            <UTabs :items="tabs" class="w-full">
                <template #content="{ item }">
                    <div v-if="item.key === 'borrowings'" class="space-y-4">
                        <!-- Search and Filter -->
                        <UCard>
                            <div class="flex flex-col md:flex-row gap-4 justify-end">
                                <!-- <div class="flex-1">
                                    <UInput v-model="searchQuery"
                                        placeholder="Tìm kiếm theo tên người dùng, sách, ISBN..."
                                        icon="i-heroicons-magnifying-glass" />
                                </div> -->
                                <USelect v-model="selectedStatus" :items="[
                                    { label: 'Tất cả trạng thái', value: 'all' },
                                    { label: 'Đang mượn', value: 'active' },
                                    { label: 'Quá hạn', value: 'overdue' },
                                    { label: 'Đã trả', value: 'returned' }
                                ]" placeholder="Chọn trạng thái" class="w-48" />
                            </div>
                        </UCard>

                        <!-- Borrowing Records Table -->
                        <UCard>
                            <UTable :data="filteredBorrowingRecords" :columns="borrowingColumns" />
                        </UCard>
                    </div>

                    <div v-else-if="item.key === 'holds'" class="space-y-4">
                        <!-- Hold Requests Table -->
                        <UCard>
                            <UTable :data="holdRequests" :columns="holdRequestsColumns" />
                        </UCard>
                    </div>
                </template>
            </UTabs>
        </div>
    </AdminContentLayout>
</template>
