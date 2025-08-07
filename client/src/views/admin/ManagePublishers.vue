<script setup lang="tsx">
import { ref, onMounted } from 'vue';
import { PublisherApi } from '@/api';
import AdminContentLayout from '@/layouts/AdminContentLayout.vue';
import type { Publisher } from '@/openapi';
import type { TableColumn } from '@nuxt/ui';
import UDropdownMenu from '@nuxt/ui/components/DropdownMenu.vue';
import UButton from '@nuxt/ui/components/Button.vue';
import PublisherModal from '@/components/admin/PublisherModal.vue';
import DeleteModal from '@/components/admin/DeleteModal.vue';

const publishers = ref<Publisher[]>([]);

const loadData = async () => {
    publishers.value = (await PublisherApi.list()).data as Publisher[];
};

onMounted(loadData);

const overlay = useOverlay();

const modal = overlay.create(PublisherModal);

const openViewDialog = async (publisher: Publisher) => {
    modal.open({
        publisher,
        mode: 'view'
    });
};

const openEditDialog = async (publisher: Publisher) => {
    modal.open({
        publisher,
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
        title: 'Xóa nhà xuất bản',
        description: 'Bạn có chắc chắn muốn xóa nhà xuất bản này? Hành động này không thể hoàn tác.',
    }
});

const openDeleteDialog = async (publisher: Publisher) => {
    deleteModal.open({
        onConfirm: async () => {
            await PublisherApi.delete(publisher.id);
            loadData();
        }
    });
};

const columns: TableColumn<Publisher>[] = [
    {
        accessorKey: 'name',
        header: 'Tên nhà xuất bản',
    },
    {
        accessorKey: 'address',
        header: 'Địa chỉ'
    },
    {
        accessorKey: 'phone',
        header: 'Số điện thoại'
    },
    {
        accessorKey: 'titleCount',
        header: 'Số sách xuất bản'
    },
    {
        id: 'actions',
        header: 'Thao tác',
        cell: ({ row }) => (
            <UDropdownMenu items={
                [
                    [
                        { label: 'Xem chi tiết', icon: 'i-heroicons-eye', onSelect: () => openViewDialog(row.original) },
                        { label: 'Chỉnh sửa', icon: 'i-heroicons-pencil', onSelect: () => openEditDialog(row.original) },
                    ],
                    [
                        { label: 'Xóa', icon: 'i-lucide-trash-2', color: 'error', onSelect: () => openDeleteDialog(row.original) }
                    ]
                ]}>
                <UButton icon='i-lucide-ellipsis-vertical' color='neutral' variant='ghost' class='ml-auto' />
            </UDropdownMenu>
        )
    }
];
</script>

<template>
    <AdminContentLayout title="Quản lý sách">
        <template #header-buttons>
            <UButton label="Làm mới" @click="loadData" loading-auto color="primary" icon="i-heroicons-arrow-path" />
            <UButton label="Thêm nhà xuất bản" @click="openAddDialog" icon="i-heroicons-plus" color="primary" />
        </template>

        <UTable :data="publishers" :columns class="w-full p-4 border border-default rounded-lg" />
    </AdminContentLayout>
</template>
