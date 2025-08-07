<script setup lang="ts">
import { BookApi, PublisherApi } from '@/api';
import type { BookWithId, Publisher } from '@/openapi';
import type { FormSubmitEvent } from '@nuxt/ui';
import { ref, computed, useTemplateRef, onMounted } from 'vue';
import z from 'zod';

const form = useTemplateRef('form');

const props = defineProps<{
    book?: BookWithId | null;
    mode: 'view' | 'create' | 'edit';
}>();

const publishers = ref<Publisher[]>([]);
onMounted(async () => {
    state.value = {
        title: undefined,
        ISBN: undefined,
        author: undefined,
        publisher: undefined,
        genre: [],
        publicationYear: new Date().getFullYear(),
        pageCount: 1,
        copiesCount: 1,
        price: 0,
        summary: undefined
    };

    if (props.book) {
        state.value = { ...props.book, publisher: props.book.publisher.id };
    }

    if (props.mode !== 'view') {
        publishers.value = (await PublisherApi.list()).data as Publisher[];
    }
});

const emit = defineEmits(['close']);

const schema = z.object({
    title: z.string('Tên sách là bắt buộc'),
    ISBN: z.string('ISBN là bắt buộc'),
    author: z.string('Tác giả là bắt buộc'),
    publisher: z.string('Nhà xuất bản là bắt buộc'),
    genre: z.array(z.string()).optional(),
    publicationYear: z.number('Vui lòng nhập năm xuất bản').min(1800, 'Năm xuất bản không hợp lệ').max(new Date().getFullYear(), 'Năm xuất bản không hợp lệ'),
    pageCount: z.number('Vui lòng nhập số trang').min(1, 'Số trang phải lớn hơn 0'),
    copiesCount: z.number('Vui lòng nhập số bản sao').min(1, 'Số bản sao phải lớn hơn 0'),
    price: z.number('Vui lòng nhập giá').min(0, 'Giá không được âm'),
    summary: z.string().optional()
});

type InputSchema = z.input<typeof schema>;
type Schema = z.output<typeof schema>;

const state = ref<Partial<InputSchema>>({
    title: undefined,
    ISBN: undefined,
    author: undefined,
    publisher: undefined,
    genre: [],
    publicationYear: new Date().getFullYear(),
    pageCount: 1,
    copiesCount: 1,
    price: 0,
    summary: undefined
});

// Computed properties
const title = computed(() => {
    switch (props.mode) {
        case 'view':
            return `Thông tin sách`;
        case 'create':
            return 'Thêm sách mới';
        case 'edit':
            return `Chỉnh sửa sách`;
    }
});

const onSubmit = async (event: FormSubmitEvent<Schema>) => {
    if (props.mode === 'create') {
        await BookApi.create({}, event.data);
    }
    else if (props.mode === 'edit') {
        await BookApi.update(props.book!.id, event.data);
    }

    emit('close', true);
};
</script>

<template>
    <UModal :title :ui="{ footer: 'justify-end' }">
        <template #body>
            <div v-if="book && mode === 'view'" class="space-y-6">
                <!-- Book Image -->
                <BookImage :bookId="book.id" class="w-36 h-48 rounded-lg border mx-auto" />

                <!-- Book Information -->
                <div class="space-y-4">
                    <h3 class="text-xl font-semibold text-gray-900">{{ book.title }}</h3>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                            <span class="font-medium text-gray-600">ISBN:</span>
                            <p class="text-gray-900 mt-1">{{ book.ISBN }}</p>
                        </div>

                        <div>
                            <span class="font-medium text-gray-600">Tác giả:</span>
                            <p class="text-gray-900 mt-1">{{ book.author }}</p>
                        </div>

                        <div class="col-span-2">
                            <span class="font-medium text-gray-600">Nhà xuất bản:</span>
                            <p class="text-gray-900 mt-1">{{ book.publisher.name }}</p>
                        </div>

                        <div>
                            <span class="font-medium text-gray-600">Năm xuất bản:</span>
                            <p class="text-gray-900 mt-1">{{ book.publicationYear }}</p>
                        </div>

                        <div>
                            <span class="font-medium text-gray-600">Số trang:</span>
                            <p class="text-gray-900 mt-1">{{ book.pageCount }}</p>
                        </div>

                        <div>
                            <span class="font-medium text-gray-600">Số bản sao:</span>
                            <p class="text-gray-900 mt-1">{{ book.copiesCount }}</p>
                        </div>

                        <div v-if="book.price">
                            <span class="font-medium text-gray-600">Giá:</span>
                            <p class="text-gray-900 mt-1">{{ book.price?.toLocaleString('vi-VN') }} VNĐ</p>
                        </div>
                    </div>

                    <!-- Genres -->
                    <div v-if="book.genre?.length" class="space-y-2">
                        <span class="font-medium text-gray-600">Thể loại:</span>
                        <div class="flex flex-wrap gap-2">
                            <UBadge v-for="genre in book.genre" :key="genre" variant="outline">
                                {{ genre }}
                            </UBadge>
                        </div>
                    </div>

                    <!-- Summary -->
                    <div v-if="book.summary" class="space-y-2">
                        <span class="font-medium text-gray-600">Tóm tắt:</span>
                        <p class="text-gray-900 text-sm leading-relaxed">{{ book.summary }}</p>
                    </div>
                </div>
            </div>

            <UForm v-else ref="form" :schema :state class="grid grid-cols-1 md:grid-cols-2 gap-4" @submit="onSubmit">
                <UFormField label="Tên sách" required name="title">
                    <UInput v-model="state.title" placeholder="Nhập tên sách" class="w-full" />
                </UFormField>

                <UFormField label="ISBN" required name="ISBN">
                    <UInput v-model="state.ISBN" placeholder="978-3-16-148410-0" class="w-full" />
                </UFormField>

                <UFormField label="Tác giả" required name="author">
                    <UInput v-model="state.author" placeholder="Nhập tên tác giả" class="w-full" />
                </UFormField>

                <UFormField label="Năm xuất bản" required name="publicationYear">
                    <UInput v-model.number="state.publicationYear" type="number" :min="1800"
                        :max="new Date().getFullYear()" class="w-full" />
                </UFormField>

                <UFormField label="Nhà xuất bản" required name="publisher" class="col-span-2">
                    <USelectMenu v-model="state.publisher" :items="publishers" label-key="name" value-key="id"
                        :search-input="{ placeholder: 'Tìm NXB...', icon: 'i-lucide-search' }"
                        placeholder="Chọn nhà xuất bản" class="w-full" />
                </UFormField>

                <!-- Copies Count and Price -->
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4 col-span-2">
                    <UFormField label="Số trang" required name="pageCount">
                        <UInput v-model.number="state.pageCount" type="number" min="1" class="w-full" />
                    </UFormField>

                    <UFormField label="Số bản sao" required name="copiesCount">
                        <UInput v-model.number="state.copiesCount" type="number" min="1" class="w-full" />
                    </UFormField>

                    <UFormField label="Giá (VNĐ)" required name="price">
                        <UInput v-model.number="state.price" type="number" min="0" placeholder="0" class="w-full" />
                    </UFormField>
                </div>

                <UFormField label="Thể loại" name="genre" class="col-span-2">
                    <UInputTags v-model="state.genre" placeholder="Chọn thể loại" class="w-full" />
                </UFormField>

                <UFormField label="Tóm tắt" name="summary" class="col-span-2">
                    <UTextarea v-model="state.summary" placeholder="Nhập tóm tắt sách" :rows="4" class="w-full" />
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
