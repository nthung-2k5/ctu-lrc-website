<script setup lang="ts">
import { BorrowApi, BookApi, ReaderApi } from '@/api';
import type { Borrow, Book, Reader } from '@/openapi';
import type { FormSubmitEvent } from '@nuxt/ui';
import { ref, computed, useTemplateRef, onMounted } from 'vue';
import z from 'zod';

const form = useTemplateRef('form');

const props = defineProps<{
    borrow?: Borrow;
    mode: 'view' | 'create' | 'edit';
}>();

const emit = defineEmits(['close']);

const books = ref<Book[]>([]);
const readers = ref<Reader[]>([]);

onMounted(async () => {
    // Load books and readers for dropdowns
    try {
        const [booksResponse, readersResponse] = await Promise.all([
            BookApi.list(),
            ReaderApi.list()
        ]);
        books.value = booksResponse.data;
        readers.value = readersResponse.data;
    } catch (error) {
        console.error('Error loading data:', error);
    }

    state.value = {
        readerId: undefined,
        bookId: undefined,
        borrowDate: undefined,
        dueDate: undefined,
        returnDate: undefined,
        notes: undefined
    };

    if (props.borrow) {
        state.value = {
            readerId: typeof props.borrow.reader === 'string' ? props.borrow.reader : props.borrow.reader.id,
            bookId: typeof props.borrow.book === 'string' ? props.borrow.book : props.borrow.book.id,
            borrowDate: props.borrow.borrowDate?.split('T')[0], // Convert to date format
            dueDate: props.borrow.dueDate?.split('T')[0], // Convert to date format
            returnDate: props.borrow.returnDate?.split('T')[0] || undefined, // Convert to date format
            notes: props.borrow.notes || undefined
        };
    }
});

const schema = z.object({
    readerId: z.string('Vui lòng chọn độc giả'),
    bookId: z.string('Vui lòng chọn sách'),
    borrowDate: z.string('Ngày mượn là bắt buộc'),
    dueDate: z.string('Ngày trả dự kiến là bắt buộc'),
    returnDate: z.string().optional(),
    notes: z.string().optional()
});

type Schema = z.output<typeof schema>;

const state = ref<Partial<Schema>>({
    readerId: undefined,
    bookId: undefined,
    borrowDate: undefined,
    dueDate: undefined,
    returnDate: undefined,
    notes: undefined
});

// Computed properties
const title = computed(() => {
    switch (props.mode) {
        case 'view':
            return `Thông tin giao dịch mượn`;
        case 'create':
            return 'Tạo giao dịch mượn mới';
        case 'edit':
            return `Chỉnh sửa giao dịch mượn`;
    }
});

const bookOptions = computed(() =>
    books.value.map(book => ({
        label: `${book.title} - ${book.isbn}`,
        value: book.id
    }))
);

const readerOptions = computed(() =>
    readers.value.map(reader => ({
        label: `${reader.lastName} ${reader.firstName} (${reader.readerCode})`,
        value: reader.id
    }))
);

const statusBadgeColor = computed(() => {
    if (!props.borrow) return 'gray';
    switch (props.borrow.status) {
        case 'borrowing':
            return 'blue';
        case 'overdue':
            return 'red';
        case 'returned':
            return 'green';
        default:
            return 'gray';
    }
});

const statusLabel = computed(() => {
    if (!props.borrow) return '';
    switch (props.borrow.status) {
        case 'borrowing':
            return 'Đang mượn';
        case 'overdue':
            return 'Quá hạn';
        case 'returned':
            return 'Đã trả';
        default:
            return props.borrow.status;
    }
});

// Format date display
const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return 'Chưa cập nhật';
    return new Date(dateString).toLocaleDateString('vi-VN');
};

const onSubmit = async (event: FormSubmitEvent<Schema>) => {
    if (props.mode === 'create') {
        await BorrowApi.borrow({
            readerId: event.data.readerId!,
            bookId: event.data.bookId!,
            borrowDate: event.data.borrowDate!,
            dueDate: event.data.dueDate!,
            notes: event.data.notes || undefined
        });
    }
    // Note: Edit functionality would need a specific API endpoint for updating borrow records
    // For now, we'll just emit the close event

    emit('close', true);
};
</script>

<template>
    <UModal :title :ui="{ footer: 'justify-end' }">
        <template #body>
            <div v-if="borrow && mode === 'view'" class="space-y-4">
                <div class="flex justify-between items-start">
                    <h3 class="text-lg font-semibold text-gray-900">Thông tin giao dịch mượn</h3>
                    <UBadge :color="statusBadgeColor" variant="subtle">
                        {{ statusLabel }}
                    </UBadge>
                </div>

                <div class="grid grid-cols-1 gap-4 text-sm">
                    <div class="border-b pb-3">
                        <span class="font-medium text-gray-600">Độc giả:</span>
                        <p class="text-gray-900 mt-1">
                            {{ typeof borrow.reader === 'string' ? borrow.reader : `${borrow.reader.lastName}
                            ${borrow.reader.firstName}` }}
                            <span v-if="typeof borrow.reader !== 'string'" class="text-gray-500 text-xs ml-1">
                                ({{ borrow.reader.readerCode }})
                            </span>
                        </p>
                    </div>

                    <div class="border-b pb-3">
                        <span class="font-medium text-gray-600">Sách:</span>
                        <p class="text-gray-900 mt-1">
                            {{ typeof borrow.book === 'string' ? borrow.book : borrow.book.title }}
                        </p>
                        <p v-if="typeof borrow.book !== 'string'" class="text-gray-500 text-xs mt-1">
                            ISBN: {{ borrow.book.isbn }}
                        </p>
                    </div>

                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <span class="font-medium text-gray-600">Ngày mượn:</span>
                            <p class="text-gray-900 mt-1">{{ formatDate(borrow.borrowDate) }}</p>
                        </div>
                        <div>
                            <span class="font-medium text-gray-600">Ngày trả dự kiến:</span>
                            <p class="text-gray-900 mt-1">{{ formatDate(borrow.dueDate) }}</p>
                        </div>
                    </div>

                    <div v-if="borrow.returnDate">
                        <span class="font-medium text-gray-600">Ngày trả thực tế:</span>
                        <p class="text-gray-900 mt-1">{{ formatDate(borrow.returnDate) }}</p>
                    </div>

                    <div v-if="borrow.staff">
                        <span class="font-medium text-gray-600">Nhân viên xử lý:</span>
                        <p class="text-gray-900 mt-1">
                            {{ typeof borrow.staff === 'string' ? borrow.staff : `${borrow.staff.lastName}
                            ${borrow.staff.firstName}` }}
                        </p>
                    </div>

                    <div v-if="borrow.notes">
                        <span class="font-medium text-gray-600">Ghi chú:</span>
                        <p class="text-gray-900 mt-1">{{ borrow.notes }}</p>
                    </div>
                </div>
            </div>

            <UForm v-else ref="form" :schema :state class="space-y-4" @submit="onSubmit">
                <UFormField label="Độc giả" required name="readerId">
                    <USelect v-model="state.readerId" :options="readerOptions" placeholder="Chọn độc giả" searchable
                        class="w-full" />
                </UFormField>

                <UFormField label="Sách" required name="bookId">
                    <USelect v-model="state.bookId" :options="bookOptions" placeholder="Chọn sách" searchable
                        class="w-full" />
                </UFormField>

                <div class="grid grid-cols-2 gap-4">
                    <UFormField label="Ngày mượn" required name="borrowDate">
                        <UInput v-model="state.borrowDate" type="date" class="w-full" />
                    </UFormField>

                    <UFormField label="Ngày trả dự kiến" required name="dueDate">
                        <UInput v-model="state.dueDate" type="date" class="w-full" />
                    </UFormField>
                </div>

                <UFormField v-if="mode === 'edit'" label="Ngày trả thực tế" name="returnDate">
                    <UInput v-model="state.returnDate" type="date" class="w-full" />
                </UFormField>

                <UFormField label="Ghi chú" name="notes">
                    <UTextarea v-model="state.notes" placeholder="Nhập ghi chú (tùy chọn)" class="w-full" />
                </UFormField>
            </UForm>
        </template>

        <template #footer="{ close }">
            <UButton variant="ghost" @click="close">
                {{ mode === 'view' ? 'Đóng' : 'Hủy' }}
            </UButton>

            <UButton v-if="props.mode !== 'view'" type="submit" color="primary" loading-auto @click="form?.submit()">
                {{ mode === 'create' ? 'Tạo giao dịch' : 'Cập nhật' }}
            </UButton>
        </template>
    </UModal>
</template>
