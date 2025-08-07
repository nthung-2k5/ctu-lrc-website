<script setup lang="tsx">
import { ref, onMounted } from 'vue';
import { BookApi } from '@/api';
import AdminContentLayout from '@/layouts/AdminContentLayout.vue';
import type { BookWithId } from '@/openapi';
import type { TableColumn } from '@nuxt/ui';
import UBadge from '@nuxt/ui/components/Badge.vue';
import UDropdownMenu from '@nuxt/ui/components/DropdownMenu.vue';
import UButton from '@nuxt/ui/components/Button.vue';
import BookModal from '@/components/admin/BookModal.vue';
import DeleteModal from '@/components/admin/DeleteModal.vue';

const books = ref<BookWithId[]>([]);

const loadData = async () => {
    books.value = (await BookApi.list()).data as BookWithId[];
};

onMounted(loadData);

const overlay = useOverlay();

const modal = overlay.create(BookModal);

const openViewDialog = async (book: BookWithId) => {
    modal.open({
        book,
        mode: 'view'
    });
};

const openEditDialog = async (book: BookWithId) => {
    modal.open({
        book,
        mode: 'edit',
        onClose: (refresh) => { if (refresh) loadData() }
    });
};

const openAddDialog = () => {
    modal.open({
        mode: 'create',
        onClose: (refresh) => { if (refresh) loadData() }
    });
};

const deleteModal = overlay.create(DeleteModal, {
    props: {
        title: 'Xóa sách',
        description: 'Bạn có chắc chắn muốn xóa sách này? Hành động này không thể hoàn tác.',
    }
});

const openDeleteDialog = async (book: BookWithId) => {
    deleteModal.open({
        onConfirm: async () => {
            await BookApi.delete(book.id);
            loadData();
        }
    });
};

const columns: TableColumn<BookWithId>[] = [
    {
        accessorKey: 'title',
        header: 'Tựa đề sách'
    },
    {
        accessorKey: 'author',
        header: 'Tác giả'
    },
    {
        accessorKey: 'genre',
        header: 'Thể loại',
        cell: ({ row }) => (
            <div class="flex flex-wrap gap-1">
                {row.original.genre?.map((genre: string) => (
                    <UBadge key={genre} variant="outline" size="sm">
                        {genre}
                    </UBadge>
                )) || <span class="text-gray-500">Chưa cập nhật</span>}
            </div>),
        enableGlobalFilter: false
    },
    {
        accessorKey: 'publicationYear',
        header: 'Năm xuất bản',
        enableGlobalFilter: false
    },
    {
        accessorKey: 'copiesCount',
        header: 'Số bản sao',
        enableGlobalFilter: false
    },
    {
        id: 'actions',
        header: 'Thao tác',
        cell: ({ row }) => (
            <UDropdownMenu items={[
                [
                    { label: 'Xem chi tiết', icon: 'i-heroicons-eye', onSelect: () => openViewDialog(row.original) },
                    { label: 'Chỉnh sửa', icon: 'i-heroicons-pencil', onSelect: () => openEditDialog(row.original) },
                ],
                [
                    { label: 'Xóa', icon: 'i-lucide-trash-2', color: 'error', onSelect: () => openDeleteDialog(row.original) }
                ]]}>
                <UButton icon='i-lucide-ellipsis-vertical' color='neutral' variant='ghost' class='ml-auto' />
            </UDropdownMenu>
        ),
        enableGlobalFilter: false
    }
];

const searchQuery = ref('');
</script>

<template>
    <AdminContentLayout title="Quản lý sách">
        <template #header-buttons>
            <UButton label="Làm mới" @click="loadData" loading-auto color="primary" icon="i-heroicons-arrow-path" />
            <UButton label="Thêm sách mới" @click="openAddDialog" icon="i-heroicons-plus" color="primary" />
        </template>

        <!-- Search and Filter -->
        <UCard>
            <div class="flex flex-col md:flex-row gap-4">
                <UInput v-model="searchQuery" placeholder="Tìm kiếm sách theo tên, tác giả, hoặc ISBN..."
                    icon="i-heroicons-magnifying-glass" class="flex-1" />
            </div>
        </UCard>

        <UTable :data="books" :global-filter="searchQuery" :columns class="w-full p-4 border border-default rounded-lg" />
    </AdminContentLayout>
</template>
