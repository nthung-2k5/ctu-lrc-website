<script setup lang="ts">
import { PublisherApi } from '@/api';
import type { Publisher } from '@/openapi';
import type { FormSubmitEvent } from '@nuxt/ui';
import { ref, computed, useTemplateRef, onMounted } from 'vue';
import z from 'zod';

const form = useTemplateRef('form');

const props = defineProps<{
    publisher?: Publisher;
    mode: 'view' | 'create' | 'edit';
}>();

const emit = defineEmits(['close']);

onMounted(() => {
    state.value = {
        name: undefined,
        address: undefined,
        phone: undefined,
        email: undefined,
        website: undefined
    };

    if (props.publisher) {
        state.value = { ...props.publisher };
    }
})

const schema = z.object({
    name: z.string('Tên nhà xuất bản là bắt buộc'),
    address: z.string('Địa chỉ là bắt buộc'),
    phone: z.string('Số điện thoại phải có 10-11 chữ số').regex(/^\d{10,11}$/, 'Số điện thoại phải có 10-11 chữ số'),
    email: z.email('Email không hợp lệ').optional(),
    website: z.url('Website phải bắt đầu với http:// hoặc https://').optional()
});

type Schema = z.output<typeof schema>;

const state = ref<Partial<Schema>>({
    name: undefined,
    address: undefined,
    phone: undefined,
    email: undefined,
    website: undefined
});

// Computed properties
const title = computed(() => {
    switch (props.mode) {
        case 'view':
            return `Thông tin nhà xuất bản`;
        case 'create':
            return 'Thêm nhà xuất bản mới';
        case 'edit':
            return `Chỉnh sửa nhà xuất bản`;
    }
});

// Format phone number display
const formatPhone = (phone: string) => {
    if (phone?.length === 10) {
        return `${phone.slice(0, 3)} ${phone.slice(3, 6)} ${phone.slice(6)}`;
    } else if (phone?.length === 11) {
        return `${phone.slice(0, 4)} ${phone.slice(4, 7)} ${phone.slice(7)}`;
    }
    return phone;
};

const onSubmit = async (event: FormSubmitEvent<Schema>) => {
    if (props.mode === 'create') {
        await PublisherApi.create({}, event.data);
    }
    else if (props.mode === 'edit') {
        await PublisherApi.update(props.publisher!.id, event.data);
    }

    emit('close', true);
};
</script>

<template>
    <UModal :title :ui="{ footer: 'justify-end' }">
        <template #body>
            <div v-if="publisher && mode === 'view'" class="space-y-3">
                <h3 class="text-lg font-semibold text-gray-900">{{ publisher.name }}</h3>

                <div class="grid grid-cols-1 gap-3 text-sm">
                    <div>
                        <span class="font-medium text-gray-600">Địa chỉ:</span>
                        <p class="text-gray-900 mt-1">{{ publisher.address }}</p>
                    </div>
                    <div>
                        <span class="font-medium text-gray-600">Điện thoại:</span>
                        <p class="text-gray-900 mt-1">{{ formatPhone(publisher.phone || '') }}</p>
                    </div>
                    <div>
                        <span class="font-medium text-gray-600">Email:</span>
                        <p class="text-gray-900 mt-1">
                            <ULink v-if="publisher.email" :to="`mailto:${publisher.email}`"
                                class="text-blue-600 hover:text-blue-600 hover:underline">
                                {{ publisher.email }}
                            </ULink>
                            <span v-else class="text-gray-500">Chưa cập nhật</span>
                        </p>
                    </div>
                    <div>
                        <span class="font-medium text-gray-600">Website:</span>
                        <p class="text-gray-900 mt-1">
                            <ULink v-if="publisher.website" :to="publisher.website" target="_blank"
                                class="text-blue-600 hover:text-blue-600 hover:underline">
                                {{ publisher.website }}
                            </ULink>
                            <span v-else class="text-gray-500">Chưa cập nhật</span>
                        </p>
                    </div>
                    <div>
                        <span class="font-medium text-gray-600">Số sách đã xuất bản:</span>
                        <p class="text-gray-900 mt-1">
                            {{ publisher.titleCount || 0 }}
                        </p>
                    </div>
                </div>
            </div>

            <UForm v-else ref="form" :schema :state class="space-y-4" @submit="onSubmit">
                <UFormField label="Tên nhà xuất bản" required name="name">
                    <UInput v-model="state.name" placeholder="Nhập tên nhà xuất bản" class="w-full" />
                </UFormField>

                <UFormField label="Địa chỉ" required name="address">
                    <UTextarea v-model="state.address" placeholder="Nhập địa chỉ nhà xuất bản" class="w-full" />
                </UFormField>

                <UFormField label="Số điện thoại" required name="phone">
                    <UInput v-model="state.phone" placeholder="Nhập số điện thoại (10-11 số)" class="w-full" />
                </UFormField>

                <UFormField label="Email" name="email">
                    <UInput v-model="state.email" type="email" placeholder="Nhập địa chỉ email (tùy chọn)"
                        class="w-full" />
                </UFormField>

                <UFormField label="Website" name="website">
                    <UInput v-model="state.website" placeholder="Nhập địa chỉ website (tùy chọn)" class="w-full" />
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
