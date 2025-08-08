<script setup lang="ts">
import { BorrowApi, PublisherApi } from '@/api';
import { Publisher, type HoldRequest } from '@/openapi';
import type { FormSubmitEvent } from '@nuxt/ui';
import { addDays } from 'date-fns';
import { ref, computed, useTemplateRef, onMounted } from 'vue';
import z from 'zod';

const form = useTemplateRef('form');
const publishers = ref<Publisher[]>([]);

const props = defineProps<{
    holdRequest?: HoldRequest;
    mode: 'view' | 'create';
}>();

const emit = defineEmits(['close']);

onMounted(async () => {
    publishers.value = (await PublisherApi.list()).data;
    if (props.holdRequest) {
        // Set default return date to 1 month from today
        const defaultReturnDate = new Date();
        defaultReturnDate.setDate(defaultReturnDate.getDate() + 30);
        state.value.dueDate = defaultReturnDate.toISOString().split('T')[0];
    }
});

const schema = z.object({
    dueDate: z.string('Ngày trả dự kiến là bắt buộc')
});

type Schema = z.output<typeof schema>;

const state = ref<Partial<Schema>>({
    dueDate: undefined
});

// Computed properties
const title = computed(() => {
    switch (props.mode) {
        case 'view':
            return `Thông tin yêu cầu giữ sách`;
        case 'create':
            return 'Xác nhận mượn sách từ yêu cầu giữ';
    }
});

// Format date display
const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return 'Chưa cập nhật';
    return new Date(dateString).toLocaleDateString('vi-VN');
};

const onSubmit = async (event: FormSubmitEvent<Schema>) => {
    if (props.mode === 'create' && props.holdRequest) {
        try {
            await BorrowApi.acceptBorrowFromHoldRequest({}, {
                holdId: props.holdRequest.id,
                dueDate: event.data.dueDate
            });
            emit('close', true);
        } catch (error) {
            console.error('Error accepting borrow from hold request:', error);
        }
    }
};
</script>

<template>
    <UModal :title :ui="{ footer: 'justify-end' }">
        <template #body>
            <div v-if="holdRequest && mode === 'view'" class="space-y-6">
                <div class="flex justify-between items-start mb-4">
                    <h3 class="text-lg font-semibold text-gray-900">Chi tiết yêu cầu giữ sách</h3>
                </div>

                <!-- Two Column Layout -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <!-- Left Column - Reader Information -->
                    <UCard>
                        <template #header>
                            <div class="flex items-center gap-2">
                                <UIcon name="i-heroicons-user" class="w-5 h-5 text-primary" />
                                <h4 class="font-semibold">Thông tin độc giả</h4>
                            </div>
                        </template>

                        <div class="space-y-3 text-sm">
                            <div>
                                <span class="font-medium text-gray-600">Mã độc giả:</span>
                                <p class="text-gray-900 mt-1">{{ holdRequest.reader.code }}</p>
                            </div>
                            <div>
                                <span class="font-medium text-gray-600">Tên độc giả:</span>
                                <p class="text-gray-900 mt-1">
                                    {{ holdRequest.reader.lastName }} {{ holdRequest.reader.firstName }}
                                </p>
                            </div>
                        </div>
                    </UCard>

                    <UCard>
                        <template #header>
                            <div class="flex items-center gap-2">
                                <UIcon name="i-heroicons-book-open" class="w-5 h-5 text-primary" />
                                <h4 class="font-semibold">Thông tin sách</h4>
                            </div>
                        </template>

                        <div class="space-y-3 text-sm">
                            <div>
                                <span class="font-medium text-gray-600">Tên sách:</span>
                                <p class="text-gray-900 mt-1">{{ holdRequest.book.title }}</p>
                            </div>
                            <div>
                                <span class="font-medium text-gray-600">Tác giả:</span>
                                <p class="text-gray-900 mt-1">{{ holdRequest.book.author }}</p>
                            </div>
                            <div>
                                <span class="font-medium text-gray-600">ISBN:</span>
                                <p class="text-gray-900 mt-1">{{ holdRequest.book.ISBN }}</p>
                            </div>
                            <!-- <div>
                                <span class="font-medium text-gray-600">Nhà xuất bản:</span>
                                <p class="text-gray-900 mt-1">
                                    {{ publishers.find(pub => pub.id === holdRequest.book.publisher).name }}
                                </p>
                            </div> -->
                        </div>
                    </UCard>
                </div>

                <!-- Hold Request Details -->
                <UCard>
                    <template #header>
                        <div class="flex items-center gap-2">
                            <UIcon name="i-heroicons-clock" class="w-5 h-5 text-primary" />
                            <h4 class="font-semibold">Chi tiết yêu cầu</h4>
                        </div>
                    </template>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                            <span class="font-medium text-gray-600">Ngày tạo yêu cầu:</span>
                            <p class="text-gray-900 mt-1">{{ formatDate(holdRequest.holdDate) }}</p>
                        </div>
                        <div>
                            <span class="font-medium text-gray-600">Ngày hết hạn:</span>
                            <p class="text-gray-900 mt-1">{{ formatDate(holdRequest.expiryDate) }}</p>
                        </div>
                    </div>
                </UCard>
            </div>

            <!-- Create Mode Form -->
            <div v-else-if="holdRequest && mode === 'create'" class="space-y-6">
                <div class="flex justify-between items-start mb-4">
                    <h3 class="text-lg font-semibold text-gray-900">Xác nhận mượn sách</h3>
                </div>

                <!-- Two Column Layout -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <!-- Left Column - Reader Information -->
                    <UCard>
                        <template #header>
                            <div class="flex items-center gap-2">
                                <UIcon name="i-heroicons-user" class="w-5 h-5 text-primary" />
                                <h4 class="font-semibold">Thông tin độc giả</h4>
                            </div>
                        </template>

                        <div class="space-y-3 text-sm">
                            <div>
                                <span class="font-medium text-gray-600">Mã độc giả:</span>
                                <p class="text-gray-900 mt-1">{{ holdRequest.reader.code }}</p>
                            </div>
                            <div>
                                <span class="font-medium text-gray-600">Tên độc giả:</span>
                                <p class="text-gray-900 mt-1">
                                    {{ holdRequest.reader.lastName }} {{ holdRequest.reader.firstName }}
                                </p>
                            </div>
                        </div>
                    </UCard>

                    <!-- Right Column - Book Information -->
                    <UCard>
                        <template #header>
                            <div class="flex items-center gap-2">
                                <UIcon name="i-heroicons-book-open" class="w-5 h-5 text-primary" />
                                <h4 class="font-semibold">Thông tin sách</h4>
                            </div>
                        </template>

                        <div class="space-y-3 text-sm">
                            <div>
                                <span class="font-medium text-gray-600">Tên sách:</span>
                                <p class="text-gray-900 mt-1">{{ holdRequest.book.title }}</p>
                            </div>
                            <div>
                                <span class="font-medium text-gray-600">Tác giả:</span>
                                <p class="text-gray-900 mt-1">{{ holdRequest.book.author }}</p>
                            </div>
                            <div>
                                <span class="font-medium text-gray-600">ISBN:</span>
                                <p class="text-gray-900 mt-1">{{ holdRequest.book.ISBN }}</p>
                            </div>
                        </div>
                    </UCard>
                </div>

                <!-- Form for Due Date -->
                <UForm ref="form" :schema :state class="space-y-4" @submit="onSubmit">
                    <UCard>
                        <template #header>
                            <div class="flex items-center gap-2">
                                <UIcon name="i-heroicons-calendar" class="w-5 h-5 text-primary" />
                                <h4 class="font-semibold">Thiết lập mượn sách</h4>
                            </div>
                        </template>

                        <div class="space-y-4">
                            <UFormField label="Ngày trả dự kiến" required name="dueDate">
                                <UInput v-model="state.dueDate" type="date" class="w-full"
                                    :min="new Date().toISOString().split('T')[0]"
                                    :max="addDays(new Date(), 30).toISOString().split('T')[0]" />
                            </UFormField>
                        </div>
                    </UCard>
                </UForm>
            </div>

            <!-- Empty State -->
            <div v-else class="text-center py-8">
                <UIcon name="i-heroicons-exclamation-triangle" class="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 class="text-lg font-semibold text-gray-900 mb-2">Không có dữ liệu</h3>
                <p class="text-gray-500">Không tìm thấy thông tin yêu cầu giữ sách.</p>
            </div>
        </template>

        <template #footer="{ close }">
            <UButton variant="ghost" @click="close">
                {{ mode === 'view' ? 'Đóng' : 'Hủy' }}
            </UButton>

            <UButton v-if="mode === 'create'" type="submit" color="primary" loading-auto @click="form?.submit()">
                Xác nhận mượn sách
            </UButton>
        </template>
    </UModal>
</template>
