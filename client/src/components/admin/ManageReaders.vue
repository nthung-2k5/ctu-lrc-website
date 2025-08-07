<script setup lang="tsx">
import type { TableColumn } from '@nuxt/ui';
import UButton from '@nuxt/ui/components/Button.vue';
import UDropdownMenu from '@nuxt/ui/components/DropdownMenu.vue';
import { onMounted, ref, useTemplateRef } from 'vue';
import ReaderModal from './ReaderModal.vue';
import DeleteModal from './DeleteModal.vue';
import { ReaderApi } from '@/api';
import type { Reader } from '@/openapi';

defineProps<{
    readers: Reader[];
}>();

const emit = defineEmits(['refresh']);

const searchQuery = ref('');

const table = useTemplateRef('table');
onMounted(() => {
    table.value!.tableApi.options.globalFilterFn = (row, _columnId, value) => {
        const reader = row.original;
        return [reader.code, `${reader.lastName} ${reader.firstName}`, reader.email, reader.phone]
            .map(field => field?.toLowerCase() || '')
            .includes(value.toLowerCase());
    };
});

const overlay = useOverlay();

const modal = overlay.create(ReaderModal);

const openViewDialog = async (reader: Reader) => {
    modal.open({
        reader,
        mode: 'view'
    });
};

const openEditDialog = async (reader: Reader) => {
    modal.open({
        reader,
        mode: 'edit',
        onClose: (refresh) => { if (refresh) emit('refresh') }
    });
};

const openAddDialog = () => {
    modal.open({
        mode: 'create',
        onClose: (refresh) => { if (refresh) emit('refresh') }
    });
};

const deleteModal = overlay.create(DeleteModal, {
    props: {
        title: 'Xóa độc giả',
        description: 'Bạn có chắc chắn muốn xóa độc giả này? Hành động này không thể hoàn tác.',
    }
});

const openDeleteDialog = async (reader: Reader) => {
    deleteModal.open({
        onConfirm: async () => {
            await ReaderApi.delete(reader.id);
            emit('refresh');
        }
    });
};

const columns: TableColumn<Reader>[] = [
    {
        accessorKey: 'code',
        header: 'Mã độc giả'
    },
    {
        accessorKey: 'name',
        header: 'Họ tên',
        cell: ({ row }) => `${row.original.lastName} ${row.original.firstName}`,
    },
    {
        accessorKey: 'dateOfBirth',
        header: 'Ngày sinh',
        cell: ({ row }) => row.getValue('dateOfBirth') ? new Date(row.getValue('dateOfBirth')).toLocaleDateString('vi-VN') : 'Chưa cập nhật'
    },
    {
        accessorKey: 'email',
        header: 'Email'
    },
    {
        accessorKey: 'phone',
        header: 'Số điện thoại'
    },
    {
        id: 'actions',
        cell: ({ row }) => <div class='text-right'>
            <UDropdownMenu content={{ align: 'end' }} items={[
                { label: 'Xem chi tiết', icon: 'i-lucide-eye', onSelect: () => openViewDialog(row.original) },
                { label: 'Chỉnh sửa', icon: 'i-lucide-edit-2', onSelect: () => openEditDialog(row.original) },
                { label: 'Xóa', icon: 'i-lucide-trash-2', color: 'error', onSelect: () => openDeleteDialog(row.original) }
            ]}>
                {<UButton icon='i-lucide-ellipsis-vertical' color='neutral' variant='ghost' class='ml-auto' />}
            </UDropdownMenu>
        </div>
    }
];

</script>

<template>
    <UCard class="mb-4">
        <div class="flex flex-col md:flex-row gap-4">
            <UInput v-model="searchQuery" placeholder="Tìm kiếm theo mã độc giả, họ tên, email hoặc số điện thoại..."
                icon="i-heroicons-magnifying-glass" class="flex-1" />
            <UButton color="primary" icon="i-heroicons-plus" @click="openAddDialog">
                Thêm độc giả
            </UButton>
        </div>
    </UCard>

    <UTable ref="table" :columns :global-filter="searchQuery" :data="readers"
        class="w-full p-4 border border-default rounded-lg" />
</template>
