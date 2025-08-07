<script setup lang="ts">
import { ReaderApi } from '@/api';
import type { Reader } from '@/openapi';
import type { FormSubmitEvent } from '@nuxt/ui';
import { ref, computed, useTemplateRef, onMounted } from 'vue';
import z from 'zod';

const form = useTemplateRef('form');

const props = defineProps<{
    reader?: Reader;
    mode: 'view' | 'create' | 'edit';
}>();

const emit = defineEmits(['close']);

onMounted(() => {
    state.value = {
        lastName: undefined,
        firstName: undefined,
        dateOfBirth: undefined,
        gender: undefined,
        address: undefined,
        phone: undefined,
        email: undefined,
        password: undefined
    };

    if (props.reader) {
        state.value = {
            ...props.reader,
            password: undefined // Don't populate password in edit mode
        };
    }
});

const schema = z.object({
    lastName: z.string().min(1, 'Họ là bắt buộc'),
    firstName: z.string().min(1, 'Tên là bắt buộc'),
    dateOfBirth: z.string().optional(),
    gender: z.enum(['M', 'F', 'Other'], { message: 'Giới tính không hợp lệ' }),
    address: z.string().optional(),
    phone: z.string().min(1, 'Số điện thoại là bắt buộc'),
    email: z.email('Email không hợp lệ'),
    password: z.string().min(8, 'Mật khẩu phải có ít nhất 8 ký tự')
});

type Schema = z.output<typeof schema>;

const state = ref<Partial<Schema>>({
    lastName: undefined,
    firstName: undefined,
    dateOfBirth: undefined,
    gender: undefined,
    address: undefined,
    phone: undefined,
    email: undefined,
    password: undefined
});

const title = computed(() => {
    switch (props.mode) {
        case 'view':
            return `Thông tin độc giả`;
        case 'create':
            return 'Thêm độc giả mới';
        case 'edit':
            return `Chỉnh sửa độc giả`;
    }
});

const requirePassword = computed(() => props.mode === 'create');

// Format phone number display
const formatPhone = (phone: string) => {
    if (phone?.length === 10) {
        return `${phone.slice(0, 3)} ${phone.slice(3, 6)} ${phone.slice(6)}`;
    } else if (phone?.length === 11) {
        return `${phone.slice(0, 4)} ${phone.slice(4, 7)} ${phone.slice(7)}`;
    }
    return phone;
};

// Format date display
const formatDate = (dateString?: string) => {
    if (!dateString) return 'Chưa cập nhật';
    return new Date(dateString).toLocaleDateString('vi-VN');
};

// Format gender display
const formatGender = (gender: string) => {
    const genderMap: Record<string, string> = {
        'M': 'Nam',
        'F': 'Nữ',
        'Other': 'Khác'
    };
    return genderMap[gender] || gender;
};

const onSubmit = async (event: FormSubmitEvent<Schema>) => {
    if (props.mode === 'create') {
        await ReaderApi.register({}, event.data);
    }
    else if (props.mode === 'edit') {
        await ReaderApi.update(props.reader!.id, event.data);
    }

    emit('close', true);
};
</script>

<template>
    <UModal :title :ui="{ footer: 'justify-end' }">
        <template #body>
            <div v-if="reader && mode === 'view'" class="space-y-4">
                <div class="text-center pb-4 border-b">
                    <h3 class="text-xl font-semibold text-gray-900">
                        {{ reader.lastName }} {{ reader.firstName }}
                    </h3>
                    <p class="text-gray-600 mt-1">Mã độc giả: {{ reader.code }}</p>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                        <span class="font-medium text-gray-600">Họ:</span>
                        <p class="text-gray-900 mt-1">{{ reader.lastName }}</p>
                    </div>

                    <div>
                        <span class="font-medium text-gray-600">Tên:</span>
                        <p class="text-gray-900 mt-1">{{ reader.firstName }}</p>
                    </div>

                    <div>
                        <span class="font-medium text-gray-600">Ngày sinh:</span>
                        <p class="text-gray-900 mt-1">{{ formatDate(reader.dateOfBirth) }}</p>
                    </div>

                    <div>
                        <span class="font-medium text-gray-600">Giới tính:</span>
                        <p class="text-gray-900 mt-1">{{ formatGender(reader.gender) }}</p>
                    </div>

                    <div>
                        <span class="font-medium text-gray-600">Số điện thoại:</span>
                        <p class="text-gray-900 mt-1">{{ formatPhone(reader.phone) }}</p>
                    </div>

                    <div>
                        <span class="font-medium text-gray-600">Email:</span>
                        <p class="text-gray-900 mt-1">
                            <ULink :to="`mailto:${reader.email}`"
                                class="text-blue-600 hover:text-blue-600 hover:underline">
                                {{ reader.email }}
                            </ULink>
                        </p>
                    </div>
                </div>

                <div v-if="reader.address" class="pt-2">
                    <span class="font-medium text-gray-600">Địa chỉ:</span>
                    <p class="text-gray-900 mt-1">{{ reader.address }}</p>
                </div>
            </div>

            <UForm v-else ref="form" :schema :state class="space-y-4" @submit="onSubmit">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <UFormField label="Họ" required name="lastName">
                        <UInput v-model="state.lastName" placeholder="Nhập họ" />
                    </UFormField>

                    <UFormField label="Tên" required name="firstName">
                        <UInput v-model="state.firstName" placeholder="Nhập tên" />
                    </UFormField>
                </div>

                <!-- Date of birth and Gender -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <UFormField label="Ngày sinh" name="dateOfBirth">
                        <UInput v-model="state.dateOfBirth" type="date" />
                    </UFormField>

                    <UFormField label="Giới tính" required name="gender">
                        <USelectMenu v-model="state.gender" :options="[
                            { label: 'Nam', value: 'M' },
                            { label: 'Nữ', value: 'F' },
                            { label: 'Khác', value: 'Other' }
                        ]" placeholder="Chọn giới tính" />
                    </UFormField>
                </div>

                <!-- Contact information -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <UFormField label="Số điện thoại" required name="phone">
                        <UInput v-model="state.phone" placeholder="Nhập số điện thoại" />
                    </UFormField>

                    <UFormField label="Email" required name="email">
                        <UInput v-model="state.email" type="email" placeholder="Nhập địa chỉ email" />
                    </UFormField>
                </div>

                <!-- Address -->
                <UFormField label="Địa chỉ" name="address">
                    <UTextarea v-model="state.address" placeholder="Nhập địa chỉ (tùy chọn)" :rows="2" />
                </UFormField>

                <!-- Password -->
                <UFormField :label="mode === 'create' ? 'Mật khẩu' : 'Mật khẩu mới (để trống nếu không muốn thay đổi)'"
                    :required="requirePassword" name="password">
                    <UInput v-model="state.password" type="password"
                        :placeholder="mode === 'create' ? 'Nhập mật khẩu' : 'Nhập mật khẩu mới'" />
                </UFormField>
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
