<script setup lang="ts">
import { StaffApi } from '@/api';
import type { Staff } from '@/openapi';
import type { FormSubmitEvent } from '@nuxt/ui';
import { ref, computed, useTemplateRef, onMounted } from 'vue';
import z from 'zod';

const form = useTemplateRef('form');

const props = defineProps<{
    staff?: Staff;
    mode: 'view' | 'create' | 'edit';
}>();

const emit = defineEmits(['close']);

onMounted(() => {
    state.value = {
        username: undefined,
        name: undefined,
        role: 'staff',
        address: undefined,
        phone: undefined,
        password: undefined
    };

    if (props.staff) {
        state.value = { ...props.staff };
    }
});

const schema = z.object({
    username: z.string().min(1, 'Tên đăng nhập là bắt buộc'),
    name: z.string().min(1, 'Tên nhân viên là bắt buộc'),
    role: z.enum(['admin', 'staff'], 'Vai trò không hợp lệ'),
    address: z.string().optional(),
    phone: z.string().regex(/^0\d{9}$/, 'Số điện thoại phải có 10 chữ số').optional(),
    password: z.string().min(8, 'Mật khẩu phải có ít nhất 8 ký tự')
});

type Schema = z.output<typeof schema>;

const state = ref<Partial<Schema>>({
    username: undefined,
    name: undefined,
    role: 'staff',
    address: undefined,
    phone: undefined,
    password: undefined
});

// Computed properties
const title = computed(() => {
    switch (props.mode) {
        case 'view':
            return `Thông tin nhân viên`;
        case 'create':
            return 'Thêm nhân viên mới';
        case 'edit':
            return `Chỉnh sửa nhân viên`;
    }
});

const requirePassword = computed(() => props.mode === 'create');

// Format phone number display
const formatPhone = (phone?: string) => {
    if (!phone) return 'Chưa cập nhật';
    if (phone?.length === 10) {
        return `${phone.slice(0, 3)} ${phone.slice(3, 6)} ${phone.slice(6)}`;
    } else if (phone?.length === 11) {
        return `${phone.slice(0, 4)} ${phone.slice(4, 7)} ${phone.slice(7)}`;
    }
    return phone;
};

// Format role display
const formatRole = (role: string) => {
    const roleMap: Record<string, string> = {
        'admin': 'Quản trị viên',
        'staff': 'Nhân viên'
    };
    return roleMap[role] || role;
};

// Get role badge color
const getRoleColor = (role: string) => {
    return role === 'admin' ? 'error' : 'primary';
};

const onSubmit = async (event: FormSubmitEvent<Schema>) => {
    if (props.mode === 'create') {
        await StaffApi.create({}, event.data);
    }
    else if (props.mode === 'edit') {
        await StaffApi.update(props.staff!.id, event.data);
    }

    emit('close', true);
};
</script>

<template>
    <UModal :title :ui="{ footer: 'justify-end' }">
        <template #body>
            <div v-if="staff && mode === 'view'" class="space-y-4">
                <div class="text-center pb-4 border-b">
                    <h3 class="text-xl font-semibold text-gray-900">{{ staff.name }}</h3>
                    <p class="text-gray-600 mt-1">@{{ staff.username }}</p>
                    <div class="mt-2">
                        <UBadge :color="getRoleColor(staff.role)" :label="formatRole(staff.role)" />
                    </div>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                        <span class="font-medium text-gray-600">Tên đăng nhập:</span>
                        <p class="text-gray-900 mt-1">{{ staff.username }}</p>
                    </div>

                    <div>
                        <span class="font-medium text-gray-600">Tên nhân viên:</span>
                        <p class="text-gray-900 mt-1">{{ staff.name }}</p>
                    </div>

                    <div>
                        <span class="font-medium text-gray-600">Vai trò:</span>
                        <p class="text-gray-900 mt-1">{{ formatRole(staff.role) }}</p>
                    </div>

                    <div>
                        <span class="font-medium text-gray-600">Số điện thoại:</span>
                        <p class="text-gray-900 mt-1">{{ formatPhone(staff.phone) }}</p>
                    </div>
                </div>

                <div v-if="staff.address" class="pt-2">
                    <span class="font-medium text-gray-600">Địa chỉ:</span>
                    <p class="text-gray-900 mt-1">{{ staff.address }}</p>
                </div>
            </div>

            <UForm v-else ref="form" :schema :state class="grid grid-cols-1 md:grid-cols-2 gap-4" @submit="onSubmit">
                <UFormField label="Tên nhân viên" required name="name">
                    <UInput v-model="state.name" placeholder="Nhập tên nhân viên" class="w-full" />
                </UFormField>

                <UFormField label="Vai trò" required name="role">
                    <USelect v-model="state.role" :items="[
                        { label: 'Nhân viên', value: 'staff' },
                        { label: 'Quản trị viên', value: 'admin' }
                    ]" placeholder="Chọn vai trò" class="w-full" />
                </UFormField>

                <UFormField label="Tên đăng nhập" required name="username" class="col-span-2">
                    <UInput v-model="state.username" placeholder="Nhập tên đăng nhập" class="w-full" />
                </UFormField>

                <UFormField :label="mode === 'create' ? 'Mật khẩu' : 'Mật khẩu mới (để trống nếu không muốn thay đổi)'"
                    :required="requirePassword" name="password" class="col-span-2">
                    <UInput v-model="state.password" type="password"
                        :placeholder="mode === 'create' ? 'Nhập mật khẩu' : 'Nhập mật khẩu mới'" class="w-full" />
                </UFormField>

                <UFormField label="Số điện thoại" name="phone" class="col-span-2">
                    <UInput v-model="state.phone" placeholder="Nhập số điện thoại (tùy chọn)" class="w-full" />
                </UFormField>

                <UFormField label="Địa chỉ" name="address" class="col-span-2">
                    <UTextarea v-model="state.address" placeholder="Nhập địa chỉ (tùy chọn)" :rows="4" class="w-full" />
                </UFormField>

                <!-- Warning for admin role -->
                <div v-if="state.role === 'admin'" class="bg-amber-50 border border-amber-200 rounded-md p-3 col-span-2">
                    <div class="flex items-start">
                        <UIcon name="i-heroicons-exclamation-triangle"
                            class="w-5 h-5 text-amber-500 mt-0.5 mr-2 flex-shrink-0" />
                        <div>
                            <h4 class="text-sm font-medium text-amber-800">Lưu ý về quyền quản trị viên</h4>
                            <p class="mt-1 text-sm text-amber-700">
                                Quản trị viên có quyền truy cập toàn bộ hệ thống và có thể quản lý tất cả nhân viên
                                khác.
                            </p>
                        </div>
                    </div>
                </div>
            </UForm>
        </template>

        <template #footer="{ close }">
            <UButton variant="ghost" @click="close">
                {{ mode === 'view' ? 'Đóng' : 'Hủy' }}
            </UButton>

            <UButton v-if="props.mode !== 'view'" type="submit" color="primary" loading-auto @click="form?.submit()">
                {{ mode === 'create' ? 'Thêm' : 'Cập nhật' }}
            </UButton>
        </template>
    </UModal>
</template>
