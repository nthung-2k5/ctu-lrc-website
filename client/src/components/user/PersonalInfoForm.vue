<script setup lang="ts">
import { ReaderApi } from '@/api';
import type { Reader } from '@/openapi';
import { useAuthStore } from '@/stores/auth';
import type { FormSubmitEvent } from '@nuxt/ui';
import { computed, ref, watch } from 'vue';
import { z } from 'zod';

const authStore = useAuthStore();

const loading = ref(false);
const editing = ref(false);

const profile = computed(() => authStore.profile as Reader);
const fullName = computed(() => `${profile.value.lastName} ${profile.value.firstName}`);

const dateOfBirth = computed(() => {
    return profile.value.dateOfBirth ? new Date(profile.value.dateOfBirth).toLocaleDateString('vi-VN') : 'Chưa cập nhật';
});

const gender = computed(() => {
    switch (profile.value.gender) {
        case 'M':
            return 'Nam';
        case 'F':
            return 'Nữ';
        default:
            return 'Khác';
    }
});

const schema = z.object({
    lastName: z.string().trim().min(1, 'Vui lòng nhập họ'),
    firstName: z.string().trim().min(1, 'Vui lòng nhập tên'),
    phone: z.string().trim().regex(/^0\d{9}$/, 'Số điện thoại không hợp lệ'),
    dateOfBirth: z.date().optional().transform((date) => date ? date.toISOString() : undefined),
    gender: z.enum(['M', 'F', 'Other']),
    address: z.string().trim().optional(),
});

type InputSchema = z.input<typeof schema>;
type Schema = z.infer<typeof schema>;

const state = ref<Partial<InputSchema>>({
    lastName: undefined,
    firstName: undefined,
    phone: undefined,
    dateOfBirth: undefined,
    gender: undefined,
    address: undefined
});

watch(editing, (newValue) => {
    if (newValue) {
        state.value = {
            ...profile.value,
            dateOfBirth: profile.value.dateOfBirth ? new Date(profile.value.dateOfBirth) : undefined,
        };
    }
});

const onSubmit = async (event: FormSubmitEvent<Schema>) => {
    loading.value = true;
    const success = await ReaderApi.updateProfile({}, event.data);
    loading.value = false;
    
    if (success) {
        await authStore.checkAuth();
        editing.value = false;
    } else {
        
    }
};
</script>

<template>
    <UCard>
        <template #header>
            <div class="flex items-center justify-between">
                <div>
                    <h3 class="text-base font-semibold leading-6">
                        Thông tin cá nhân
                    </h3>
                    <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        Thông tin cá nhân và liên lạc
                    </p>
                </div>
                <UButton v-if="!editing" label="Chỉnh sửa" variant="solid" @click="editing = true" />
            </div>
        </template>

        <div v-if="!editing" class="grid gap-4 md:grid-cols-2">
            <!-- View Mode -->
            <UFormField label="Họ và tên">
                <p class="text-sm">{{ fullName || 'Chưa cập nhật' }}</p>
            </UFormField>

            <UFormField label="Số điện thoại">
                <p class="text-sm">{{ profile?.phone || 'Chưa cập nhật' }}</p>
            </UFormField>

            <UFormField label="Ngày sinh">
                <p class="text-sm">{{ dateOfBirth }}</p>
            </UFormField>

            <UFormField label="Giới tính">
                <p class="text-sm">{{ gender }}</p>
            </UFormField>

            <UFormField label="Địa chỉ">
                <p class="text-sm">{{ profile?.address || 'Chưa cập nhật' }}</p>
            </UFormField>
        </div>

        <UForm :schema :state @submit="onSubmit" v-else class="space-y-6">
            <div class="grid gap-6 md:grid-cols-2">
                <div class="grid grid-cols-2 gap-4">
                    <UFormField label="Họ" required name="lastName">
                        <UInput v-model="state.lastName" class="w-full" />
                    </UFormField>

                    <UFormField label="Tên" required name="firstName">
                        <UInput v-model="state.firstName" class="w-full" />
                    </UFormField>
                </div>

                <UFormField label="Số điện thoại" required name="phone">
                    <UInput v-model="state.phone" class="w-full" />
                </UFormField>

                <UFormField label="Ngày sinh" name="dateOfBirth">
                    <DatePicker v-model="state.dateOfBirth" class="w-full" />
                </UFormField>

                <UFormField label="Giới tính" name="gender" required>
                    <USelect placeholder="Chọn giới tính" :items="[
                        { label: 'Nam', value: 'M' },
                        { label: 'Nữ', value: 'F' },
                        { label: 'Khác', value: 'Other' }
                    ]" v-model="state.gender" class="w-full" />
                </UFormField>

                <UFormField label="Địa chỉ" class="col-span-2" name="address">
                    <UTextarea v-model="state.address" class="w-full" />
                </UFormField>
            </div>

            <!-- Action Buttons -->
            <div class="flex gap-3">
                <UButton type="submit" loading-auto class="w-full md:w-auto">
                    Lưu thay đổi
                </UButton>
                <UButton variant="outline" @click="editing = false" :disabled="loading" class="w-full md:w-auto">
                    Hủy
                </UButton>
            </div>
        </UForm>
    </UCard>
</template>

<style scoped></style>