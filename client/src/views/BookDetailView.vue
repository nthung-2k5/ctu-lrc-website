<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import type { PublicBook } from '@/openapi';
import { BookApi, ReaderApi } from '@/api';
import { useAuthStore } from '@/stores/auth';

const router = useRouter();
const authStore = useAuthStore();

const book = ref<PublicBook>({
    id: '1',
    ISBN: '978-3-16-148410-0',
    title: 'Sample Book Title',
    author: 'John Doe',
    publisher: 'Sample Publisher',
    genre: ['Fiction', 'Adventure'],
    publicationYear: 2023,
    summary: 'This is a sample book description that provides an overview of the book content and its significance in the literary world.',
    pageCount: 320,
    status: 'available'
});

const loadData = async () => {
    try {
        book.value = (await BookApi.find({ id: router.currentRoute.value.params.id as string })).data;
        console.log('Book data:', book.value);
    } catch (error) {
        console.error('Failed to load book:', error);
    }
};

onMounted(loadData);

const color = computed(() => {
    switch (book.value.status) {
        case 'available':
            return 'primary';
        case 'borrowing':
            return 'success';
        case 'holding':
            return 'warning';
        case 'unavailable':
            return 'error';
    }
});

const holdBook = async () => {
    if (!authStore.isReader) {
        router.push('/login');
        return;
    }

    try {
        await ReaderApi.createHoldRequest({ bookId: book.value.id });
        await loadData();
    } catch (error) {
        console.error('Failed to hold book:', error);
    }
};

const cancelHold = async () => {
    try {
        await ReaderApi.cancelHoldRequest({ bookId: book.value.id });
        await loadData();
    } catch (error) {
        console.error('Failed to cancel hold:', error);
    }
};

const badgeStatus = computed(() => {
    switch (book.value.status) {
        case 'available':
            return { label: 'Có sẵn', description: 'Sách có thể được mượn hoặc đặt giữ' };
        case 'borrowing':
            return { label: 'Đang mượn', description: 'Bạn đang mượn sách này' };
        case 'holding':
            return { label: 'Đang giữ sách', description: 'Sách đã được giữ lại cho bạn trong 24 giờ' };
        case 'unavailable':
            return { label: 'Không có sẵn', description: 'Sách hiện không có sẵn để mượn hoặc đặt giữ' };
    }
});

const holdBookButton = computed(() => {
    if (!authStore.isReader) {
        return { text: 'Đăng nhập để giữ sách', color: 'primary', icon: 'i-heroicons-lock-closed', onClick: () => { router.push('/login') } };
    }

    switch (book.value.status) {
        case 'available':
            return { text: 'Giữ sách (24 giờ)', icon: 'i-heroicons-bookmark-solid', onClick: () => holdBook() };
        case 'borrowing':
            return { text: 'Đang mượn', icon: 'i-heroicons-clock' };
        case 'holding':
            return { text: 'Hủy giữ sách', icon: 'i-heroicons-x-circle', onClick: () => cancelHold() };
        case 'unavailable':
            return { text: 'Không thể giữ sách', icon: 'i-heroicons-x-circle' };
    }
})

</script>

<template>
    <UContainer>
        <!-- Breadcrumb navigation -->
        <UBreadcrumb :items="[
            { label: 'Trang chủ', to: '/' },
            { label: 'Sách', to: '/books' },
            { label: book.title }
        ]" class="py-2" />

        <div class="flex flex-col md:flex-row gap-8 pb-20 lg:pb-4">
            <div class="flex-shrink-0 w-56 max-w-56 mx-auto lg:mx-0 lg:mb-0 mb-6">
                <div
                    class="bg-muted rounded-md overflow-hidden mb-6 aspect-[3/4] shadow-[5px_5px_10px_rgba(0,0,0,0.3)]">
                    <BookImage :book-id="book.id" />
                </div>

                <!-- Dynamic Hold Book Button -->
                <UButton :label="holdBookButton.text" class="max-md:hidden text-sm md:text-base"
                    @click="holdBookButton.onClick" :disabled="!holdBookButton.onClick" :color="holdBookButton.color || color"
                    :icon="holdBookButton.icon" loading-auto block />

                <!-- Hold status display -->
                <div class="mt-4 w-full">
                    <UAlert v-if="book.status === 'holding'" color="success" variant="soft" title="Đã giữ sách"
                        description="Sách đã được giữ lại cho bạn trong 24 giờ. Vui lòng đến thư viện để mượn sách trước khi hết hạn."
                        icon="i-heroicons-check-circle" class="p-2 md:p-4 break-words" />

                    <UAlert v-else-if="book.status === 'borrowing'" color="warning" variant="soft" title="Đang cho mượn"
                        description="Sách hiện đang được cho mượn. Bạn có thể yêu cầu giữ sách khi nó được trả lại."
                        icon="i-heroicons-clock" class="p-2 md:p-4 break-words" />

                    <UAlert v-else-if="book.status === 'unavailable'" color="error" variant="soft" title="Không có sẵn"
                        description="Sách hiện không có sẵn để mượn hoặc giữ chỗ." icon="i-heroicons-x-circle"
                        class="p-2 md:p-4 break-words" />
                </div>
            </div>

            <div class="flex-1">
                <div class="space-y-2">
                    <h1 class="font-semibold text-2xl">{{ book.title }}</h1>
                    <h2 class="text-gray-500 text-base">{{ book.author }}</h2>
                </div>
                <div class="space-y-6 mt-3">
                    <div class="grid grid-cols-1 lg:grid-cols-2 gap-3">
                        <div class="flex items-center space-x-2">
                            <UIcon name="i-heroicons-document-duplicate" class="size-4 text-gray-500" />
                            <span class="text-gray-500">ISBN:</span>
                            <span>{{ book.ISBN }}</span>
                        </div>
                        <div class="flex items-center space-x-2">
                            <UIcon name="i-heroicons-user" class="size-4 text-gray-500" />
                            <span class="text-gray-500">Thể loại:</span>
                            <span>{{ book.genre?.join(', ') }}</span>
                        </div>
                        <div class="flex items-center space-x-2">
                            <UIcon name="i-heroicons-building-office-2" class="size-4 text-gray-500" />
                            <span class="text-gray-500">Nhà xuất bản:</span>
                            <span>{{ book.publisher }}</span>
                        </div>
                        <div class="flex items-center space-x-2">
                            <UIcon name="i-heroicons-calendar" class="size-4 text-gray-500" />
                            <span class="text-gray-500">Năm xuất bản:</span>
                            <span>
                                {{ book.publicationYear }}
                            </span>
                        </div>
                        <!-- Added page count display -->
                        <div class="flex items-center space-x-2">
                            <UIcon name="i-heroicons-book-open" class="size-4 text-gray-500" />
                            <span class="text-gray-500">Số trang:</span>
                            <span>{{ book.pageCount }}</span>
                        </div>
                    </div>

                    <USeparator />

                    <div class="grid grid-cols-1 lg:grid-cols-2 space-y-6 space-x-2">
                        <!-- Description Section -->
                        <div>
                            <h3 class="text-lg font-medium mb-2 pb-1 underline underline-offset-8 decoration-primary">Mô
                                tả sách</h3>
                            <p class="text-gray-500 leading-relaxed">
                                {{ book.summary || 'No description available.' }}
                            </p>
                        </div>
                    </div>

                    <!-- Lending instructions section -->
                    <USeparator />

                    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div class="space-y-4">
                            <h3 class="text-lg font-medium pb-1 underline underline-offset-8 decoration-primary">
                                Hướng dẫn mượn sách
                            </h3>
                            <div class="space-y-2">
                                <p>
                                    <span class="font-medium">Mượn trực tiếp:</span>
                                    Nếu sách có sẵn, bạn có thể đến thư viện và mượn ngay.
                                </p>
                                <p>
                                    <span class="font-medium">Giữ sách trực tuyến:</span>
                                    Bạn có thể yêu cầu giữ sách để đặt mượn sau. Yêu cầu này chỉ có hiệu lực trong
                                    vòng 24 giờ.
                                </p>
                                <p>
                                    <span class="font-medium">Thời gian mượn:</span>
                                    Bạn có thể mượn sách trong vòng 30 ngày.
                                </p>
                            </div>
                        </div>

                        <!-- Availability Section -->
                        <div>
                            <h3 class="text-lg font-medium mb-2 pb-1 underline underline-offset-8 decoration-primary">
                                Tình trạng sách
                            </h3>
                            <div class="flex items-center space-x-2">
                                <UBadge :color variant="soft">
                                    {{ badgeStatus.label }}
                                </UBadge>
                                <span class="text-gray-500 text-sm">
                                    {{ badgeStatus.description }}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Fixed Mobile Button -->
        <!-- <div class="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 z-50">
            <UButton :label="buttonText" class="w-full text-base" @click="handleButtonClick"
                :disabled="isButtonDisabled" :color="book.status === 'holding' ? 'error' : 'primary'"
                :variant="book.status === 'holding' ? 'outline' : 'solid'" :loading="isProcessingHold" block>
                <template #leading v-if="!isProcessingHold">
                    <UIcon v-if="buttonIcon === 'User'" name="i-heroicons-user" class="size-4" />
                    <UIcon v-else-if="buttonIcon === 'XCircle'" name="i-heroicons-x-circle" class="size-4" />
                    <UIcon v-else name="i-heroicons-bookmark" class="size-4" />
                </template>
            </UButton>
        </div> -->
    </UContainer>
</template>

<style scoped></style>