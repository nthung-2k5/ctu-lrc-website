<script setup lang="ts">
import CTULogo from '/CTULogo.svg?url';
import * as z from 'zod';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { ReaderApi } from '@/api';
import type { FormSubmitEvent } from '@nuxt/ui';

const router = useRouter();

// Form state for Nuxt UI v3
const formState = ref({
    lastName: '',
    firstName: '',
    gender: undefined as 'M' | 'F' | 'Other' | undefined,
    phone: '',
    email: '',
    password: '',
    confirmPassword: ''
});

// Form schema for Nuxt UI v3
const formSchema = z.object({
    lastName: z.string('Vui lòng nhập họ').min(2, { message: 'Họ phải có ít nhất 2 ký tự' }),
    firstName: z.string('Vui lòng nhập tên').min(2, { message: 'Tên phải có ít nhất 2 ký tự' }),
    gender: z.enum(['M', 'F', 'Other'], {
        error: 'Vui lòng chọn giới tính'
    }),
    phone: z.string('Vui lòng nhập số điện thoại')
        .regex(/^0\d{9}$/, { message: 'Số điện thoại phải có 10 chữ số và bắt đầu bằng 0' }),
    email: z.email({ message: 'Email không hợp lệ' }),
    password: z.string('Vui lòng nhập mật khẩu').min(8, { message: 'Mật khẩu phải có ít nhất 8 ký tự' }),
    confirmPassword: z.string('Vui lòng nhập lại mật khẩu').min(8, { message: 'Mật khẩu xác nhận phải có ít nhất 8 ký tự' }),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Mật khẩu không trùng khớp",
    path: ["confirmPassword"],
});

type Schema = z.output<typeof formSchema>;

// Gender options for USelect
const genderOptions = [
    { value: 'M', label: 'Nam' },
    { value: 'F', label: 'Nữ' },
    { value: 'Other', label: 'Khác' }
];

// Handle form submission
const onSubmit = async (event: FormSubmitEvent<Schema>) => {
    const success = await ReaderApi.register({}, event.data);

    if (success) {
        router.push('/');
    }
};
</script>

<template>
    <div
        class="bg-[url('/LoginBG.jpg')] bg-cover bg-fixed flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
        <UCard class="max-w-3xl w-full">
            <template #header>
                <div class="text-center">
                    <img :src="CTULogo" class="h-32 mx-auto" alt="CTU Logo">
                </div>
            </template>

            <div class="space-y-6">
                <UForm :schema="formSchema" :state="formState" @submit="onSubmit" class="space-y-6">
                    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <!-- Account Information Section -->
                        <div class="space-y-4">
                            <h3 class="text-lg font-medium border-b pb-2">Thông tin tài khoản</h3>

                            <UFormField label="Email" name="email">
                                <UInput v-model="formState.email" type="email" placeholder="your.email@example.com"
                                    autocomplete="email" class="w-full" />
                            </UFormField>

                            <UFormField label="Mật khẩu" name="password">
                                <UInput v-model="formState.password" type="password" placeholder="••••••••"
                                    autocomplete="new-password" class="w-full" />
                            </UFormField>

                            <UFormField label="Xác nhận mật khẩu" name="confirmPassword">
                                <UInput v-model="formState.confirmPassword" type="password" placeholder="••••••••"
                                    autocomplete="new-password" class="w-full" />
                            </UFormField>
                        </div>

                        <!-- User Information Section -->
                        <div class="space-y-4">
                            <h3 class="text-lg font-medium border-b pb-2">Thông tin cá nhân</h3>

                            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <UFormField label="Họ" name="lastName">
                                    <UInput v-model="formState.lastName" type="text" placeholder="Nguyễn Văn"
                                        class="w-full" />
                                </UFormField>

                                <UFormField label="Tên" name="firstName">
                                    <UInput v-model="formState.firstName" type="text" placeholder="A" class="w-full" />
                                </UFormField>
                            </div>

                            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <UFormField label="Giới tính" name="gender">
                                    <USelect v-model="formState.gender" :items="genderOptions"
                                        placeholder="Chọn giới tính" class="w-full" />
                                </UFormField>
                                <UFormField label="Số điện thoại" name="phone">
                                    <UInput v-model="formState.phone" type="tel" placeholder="0123456789" maxlength="10"
                                        class="w-full" />
                                </UFormField>
                            </div>
                        </div>
                    </div>

                    <UButton label="Đăng ký" type="submit" block loading-auto />

                    <div class="text-sm text-center text-gray-600 dark:text-gray-400">
                        Đã có tài khoản?
                        <UButton label="Đăng nhập ngay" variant="link" class="p-0 ml-1"
                            @click="$router.push('/login')" />
                    </div>
                </UForm>
            </div>
        </UCard>
    </div>
</template>
