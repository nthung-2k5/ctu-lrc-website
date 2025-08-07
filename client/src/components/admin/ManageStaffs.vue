<script setup lang="tsx">
import type { Staff } from '@/openapi';
import type { TableColumn } from '@nuxt/ui';
import UButton from '@nuxt/ui/components/Button.vue';
import UDropdownMenu from '@nuxt/ui/components/DropdownMenu.vue';
import UBadge from '@nuxt/ui/components/Badge.vue';
import { onMounted, ref, useTemplateRef } from 'vue';
import StaffModal from './StaffModal.vue';
import DeleteModal from './DeleteModal.vue';
import { StaffApi } from '@/api';

defineProps<{
    staffs: Staff[];
}>();

const emit = defineEmits(['refresh']);

const searchQuery = ref('');

const table = useTemplateRef('table');
onMounted(() => {
    table.value!.tableApi.options.globalFilterFn = (row, _columnId, value) => {
        const staff = row.original;
        return [staff.username, staff.name, staff.phone].map(field => field?.toLowerCase())
            .includes(value.toLowerCase());
    };
});

const overlay = useOverlay();

const modal = overlay.create(StaffModal);

const openViewDialog = async (staff: Staff) => {
    modal.open({
        staff,
        mode: 'view'
    });
};

const openEditDialog = async (staff: Staff) => {
    modal.open({
        staff,
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

const openDeleteDialog = async (staff: Staff) => {
    deleteModal.open({
        onConfirm: async () => {
            await StaffApi.delete(staff.id);
            emit('refresh');
        }
    });
};

const columns: TableColumn<Staff>[] = [
    {
        accessorKey: 'username',
        header: 'Tên người dùng'
    },
    {
        accessorKey: 'name',
        header: 'Họ tên'
    },
    {
        accessorKey: 'role',
        header: 'Chức vụ',
        cell: ({ row }) => <UBadge color={row.getValue('role') === 'admin' ? 'error' : 'primary'} variant='outline'>
            {row.getValue('role') === 'admin' ? 'Quản trị viên' : 'Nhân viên'}
        </UBadge>
    },
    {
        accessorKey: 'phone',
        header: 'Số điện thoại',
        cell: ({ row }) => row.getValue('phone') || 'Chưa cập nhật',
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
            <UInput v-model="searchQuery" placeholder="Tìm kiếm theo tên đăng nhập, họ tên hoặc số điện thoại..."
                icon="i-heroicons-magnifying-glass" class="flex-1" />
            <UButton color="primary" icon="i-heroicons-plus" @click="openAddDialog">
                Thêm nhân viên
            </UButton>
        </div>
    </UCard>

    <UTable ref="table" :columns :global-filter="searchQuery" :data="staffs"
        class="w-full p-4 border border-default rounded-lg" />
</template>
