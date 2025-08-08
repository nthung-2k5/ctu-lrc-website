<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { createReusableTemplate } from '@vueuse/core';
import { type CheckboxGroupItem, type DropdownMenuItem } from '@nuxt/ui';
import { BookApi, PublisherApi } from '@/api';
import type { Book, SimplePublisher } from '@/openapi';

const loading = ref(false);
const sortMethod = ref("default");
const searchQuery = ref("");

// Filter state
const filterTitle = ref("");
const filterAuthor = ref("");
const filterPublisher = ref("all");
const filterCategory = ref("all");
const filterYear = ref("");

const genres = ref<string[]>([]);
const publishers = ref<SimplePublisher[]>([]);
const years = ref<CheckboxGroupItem[]>([
    ...Array.from({ length: new Date().getFullYear() - 2000 + 1 }, (_, i) => ({
        label: (2000 + i).toString(),
        value: (2000 + i).toString()
    })).reverse(),
    { label: 'Trước 2000', value: '-1' }
]);

const selectedGenres = ref<string[]>([]);
const selectedPublishers = ref<string[]>([]);
const selectedYears = ref<string[]>([]);

const genreSearchQuery = ref("");
const publisherSearchQuery = ref("");

// Filtered genres for search
const filteredGenres = computed(() => {
    if (!genreSearchQuery.value.trim()) {
        return genres.value.map(genre => ({ label: genre, value: genre }));
    }
    const query = genreSearchQuery.value.toLowerCase();
    return genres.value
        .filter(genre => genre.toLowerCase().includes(query))
        .map(genre => ({ label: genre, value: genre }));
});

// Filtered publishers for search
const filteredPublishers = computed(() => {
    if (!publisherSearchQuery.value.trim()) {
        return publishers.value;
    }
    const query = publisherSearchQuery.value.toLowerCase();
    return publishers.value.filter(publisher =>
        publisher.name.toLowerCase().includes(query)
    );
});

const books = ref<Book[]>([]);

onMounted(async () => {
    try {
        const [booksResponse, publishersResponse, genresResponse] = await Promise.all([
            BookApi.list(),
            PublisherApi.list(),
            BookApi.getAllGenres()
        ]);

        books.value = booksResponse.data;
        publishers.value = publishersResponse.data;
        // Assuming genres are used for filterCategory
        genres.value = genresResponse.data;
        console.log(genres.value);
    }
    catch (error) {
        console.error("Failed to load data:", error);
        books.value = [];
        publishers.value = [];
    }
});

// Filtered books based on search query and filters
const filteredBooks = computed(() => {
    let result = books.value;

    // Apply selected genres filter
    if (selectedGenres.value.length > 0) {
        result = result.filter(book =>
            book.genre && selectedGenres.value.every(genre => book.genre!.includes(genre))
        );
    }

    // Apply selected publishers filter
    if (selectedPublishers.value.length > 0) {
        result = result.filter(book => {
            const publisherId = typeof book.publisher === 'string' ? book.publisher : book.publisher.id;
            return selectedPublishers.value.includes(publisherId);
        });
    }

    // Apply selected years filter
    if (selectedYears.value.length > 0) {
        result = result.filter(book => {
            const bookYear = book.publicationYear;
            return selectedYears.value.some(year => {
                if (year === '-1') {
                    // "Trước 2000" option
                    return bookYear < 2000;
                } else {
                    return bookYear.toString() === year;
                }
            });
        });
    }

    // Apply title filter (if you want to add a title search)
    if (filterTitle.value.trim()) {
        const titleQuery = filterTitle.value.toLowerCase();
        result = result.filter(book =>
            book.title.toLowerCase().includes(titleQuery)
        );
    }

    // Apply author filter (if you want to add an author search)
    if (filterAuthor.value.trim()) {
        const authorQuery = filterAuthor.value.toLowerCase();
        result = result.filter(book =>
            book.author.toLowerCase().includes(authorQuery)
        );
    }

    // Apply search query (searches across title, author, and ISBN)
    if (searchQuery.value.trim()) {
        const query = searchQuery.value.toLowerCase();
        result = result.filter(book =>
            book.title.toLowerCase().includes(query) ||
            book.author.toLowerCase().includes(query) ||
            book.ISBN.toLowerCase().includes(query)
        );
    }

    return result;
});

// Functions for filters
const clearAllFilters = () => {
    filterTitle.value = "";
    filterAuthor.value = "";
    filterPublisher.value = "all";
    filterCategory.value = "all";
    filterYear.value = "";
    searchQuery.value = "";
    selectedGenres.value = [];
    selectedPublishers.value = [];
    selectedYears.value = [];
    genreSearchQuery.value = "";
    publisherSearchQuery.value = "";
};

// Function to group books by first letter or year
const groupedBooks = computed(() => {
    const sortedBooks = [...filteredBooks.value];

    // Sort books based on selected method
    if (sortMethod.value === 'titleAsc') {
        sortedBooks.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortMethod.value === 'titleDesc') {
        sortedBooks.sort((a, b) => b.title.localeCompare(a.title));
    } else if (sortMethod.value === 'yearAsc') {
        sortedBooks.sort((a, b) => a.publicationYear - b.publicationYear);
    } else if (sortMethod.value === 'yearDesc') {
        sortedBooks.sort((a, b) => b.publicationYear - a.publicationYear);
    }
    // Default sort doesn't change the order

    // For default sort, return all books in one group without grouping
    if (sortMethod.value === 'default') {
        return [{
            key: 'all',
            books: sortedBooks,
            count: sortedBooks.length
        }];
    }

    // Group books based on sort method
    const grouped = new Map<string, Book[]>();

    sortedBooks.forEach(book => {
        let key;
        if (sortMethod.value === 'titleAsc' || sortMethod.value === 'titleDesc') {
            // Group by first letter
            key = book.title.charAt(0).toUpperCase();
        } else {
            // Group by year
            key = book.publicationYear.toString();
        }

        if (!grouped.has(key)) {
            grouped.set(key, []);
        }

        grouped.get(key)!.push(book);
    });

    // Convert map to array of section objects
    return Array.from(grouped).map(([key, booksInGroup]) => ({
        key,
        books: booksInGroup,
        count: booksInGroup.length
    }));
});

// Function to handle sorting selection
const handleSortChange = (method: string) => {
    sortMethod.value = method;
};

// Sort menu items for UDropdown
const sortMenuItems = ref<DropdownMenuItem[]>([
    {
        label: 'Mặc định',
        icon: 'i-heroicons-book-open',
        onSelect: () => handleSortChange('default')
    }, {
        label: 'Tựa đề (A-Z)',
        icon: 'i-heroicons-bars-arrow-down',
        onSelect: () => handleSortChange('titleAsc')
    }, {
        label: 'Tựa đề (Z-A)',
        icon: 'i-heroicons-bars-arrow-up',
        onSelect: () => handleSortChange('titleDesc')
    }, {
        label: 'Mới nhất',
        icon: 'i-heroicons-calendar',
        onSelect: () => handleSortChange('yearDesc')
    }, {
        label: 'Cũ nhất',
        icon: 'i-heroicons-calendar',
        onSelect: () => handleSortChange('yearAsc')
    }
]);

// Total count of filtered books
const totalBooks = computed(() => filteredBooks.value.length);

// Get sort method display text
const getSortDisplayText = computed(() => {
    const sortOptions: Record<string, string> = {
        'default': 'Mặc định',
        'titleAsc': 'Tựa đề (A-Z)',
        'titleDesc': 'Tựa đề (Z-A)',
        'yearDesc': 'Mới nhất',
        'yearAsc': 'Cũ nhất'
    };
    return sortOptions[sortMethod.value] || 'Sắp xếp';
});

// Count active filters
const activeFiltersCount = computed(() => {
    let count = 0;
    if (selectedGenres.value.length > 0) count++;
    if (selectedPublishers.value.length > 0) count++;
    if (selectedYears.value.length > 0) count++;
    if (searchQuery.value.trim()) count++;
    return count;
});

// Check if any filters are active
const hasActiveFilters = computed(() => activeFiltersCount.value > 0);

const [DefineFilter, ReuseFilter] = createReusableTemplate();
const [DefineSort, ReuseSort] = createReusableTemplate();
</script>

<template>
    <DefineFilter>
        <div class="space-y-6 overflow-x-hidden">
            <UAccordion :items="[
                {
                    label: 'Thể loại',
                    slot: 'category'
                },
                {
                    label: 'Nhà xuất bản',
                    slot: 'publisher'
                },
                {
                    label: 'Năm xuất bản',
                    slot: 'year'
                }
            ]" type="multiple" :ui="{
                content: 'pb-2 space-y-2',
            }">
                <template #category>
                    <UInput v-model="genreSearchQuery" placeholder="Tìm thể loại" class="w-full" />
                    <UCheckboxGroup class="max-h-[max(20vh,12rem)] overflow-y-scroll" :items="filteredGenres"
                        v-model="selectedGenres" />
                </template>
                <template #publisher>
                    <UInput v-model="publisherSearchQuery" placeholder="Tìm nhà xuất bản" class="w-full" />
                    <UCheckboxGroup class="max-h-[max(20vh,12rem)] overflow-y-scroll" :items="filteredPublishers"
                        label-key="name" value-key="id" v-model="selectedPublishers" />
                </template>
                <template #year class="space-y-2">
                    <UCheckboxGroup class="max-h-[max(20vh,12rem)] overflow-y-scroll" :items="years"
                        v-model="selectedYears" />
                </template>
            </UAccordion>
        </div>
    </DefineFilter>

    <DefineSort>
        <UDropdownMenu :items="sortMenuItems">
            <UButton :label="getSortDisplayText" icon="i-heroicons-bars-arrow-down" variant="outline"
                class="justify-between gap-2">
            </UButton>
        </UDropdownMenu>
    </DefineSort>

    <!-- Header Section -->
    <div class="bg-background">
        <UContainer>
            <div class="py-6">
                <!-- Breadcrumb -->
                <UBreadcrumb :items="[
                    { label: 'Trang chủ', to: '/' },
                    { label: 'Thư viện' }
                ]" class="mb-6" />

                <h1 class="text-4xl font-bold flex items-center gap-3 mb-6">
                    <UIcon name="i-heroicons-book-open" class="size-10 text-primary" />
                    Thư viện sách
                </h1>
            </div>
        </UContainer>
    </div>

    <!-- Main Content -->
    <UContainer>
        <div class="py-8 pb-20 md:pb-8">
            <!-- Desktop Layout with Sidebar -->
            <div class="flex gap-8">
                <!-- Filter Sidebar - Desktop -->
                <div class="max-md:hidden w-72 lg:w-80">
                    <UCard class="sticky top-20 max-h-[calc(100vh-6rem)] overflow-y-auto scrollbar-none mb-4">
                        <ReuseFilter />
                        <UButton :label="hasActiveFilters ? `Đặt lại (${activeFiltersCount})` : 'Đặt lại'"
                            @click="clearAllFilters" block class="mt-6"
                            :variant="hasActiveFilters ? 'solid' : 'outline'"
                            :color="hasActiveFilters ? 'primary' : 'neutral'" />
                    </UCard>
                </div>

                <!-- Main Content Area - Desktop -->
                <div class="flex-1">
                    <!-- Controls Bar - Desktop -->
                    <div class="max-md:hidden flex items-center justify-between mb-3">
                        <div>
                            <p class="text-gray-500">
                                Đã tìm thấy
                                <span class="text-lg font-semibold text-primary">{{ totalBooks }}</span>
                                cuốn sách
                            </p>
                        </div>

                        <ReuseSort />
                    </div>

                    <!-- Loading State -->
                    <div v-if="loading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        <div v-for="index in Array.from({ length: 12 })" :key="`skeleton-${index}`"
                            class="h-80 bg-gray-200 rounded-lg animate-pulse" />
                    </div>

                    <!-- Empty State -->
                    <div v-else-if="totalBooks === 0" class="text-center py-16">
                        <div class="max-w-lg mx-auto">
                            <UIcon name="i-heroicons-book-open" class="size-16 text-gray-400 mx-auto mb-4" />
                            <h2 class="text-2xl font-semibold mb-2">Không tìm thấy sách</h2>
                            <p class="text-gray-500 mb-6">
                                Thử điều chỉnh từ khóa tìm kiếm hoặc bộ lọc để tìm sách bạn muốn.
                            </p>
                        </div>
                    </div>

                    <!-- Grouped Book Display -->
                    <div v-else class="space-y-12">
                        <BookList v-for="section in groupedBooks" :key="section.key" :books="section.books">
                            <template v-if="sortMethod !== 'default'" #title>
                                <UIcon v-if="sortMethod.includes('year')" name="i-heroicons-calendar"
                                    class="size-5 text-primary" />
                                <span class="font-semibold text-lg">
                                    {{ sortMethod.includes('year') ? `Năm ${section.key}` : section.key }}
                                </span>
                            </template>
                        </BookList>
                    </div>
                </div>
            </div>
        </div>
    </UContainer>

    <!-- Fixed Bottom Controls - Mobile/Tablet -->
    <div class="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 z-50">
        <div class="flex gap-3">
            <!-- Book Count Display -->
            <div class="flex items-center gap-2 text-sm text-gray-500 flex-1">
                <span>{{ totalBooks }} cuốn sách</span>
            </div>

            <!-- Filter Drawer Trigger - Mobile -->
            <USlideover title="Bộ lọc tìm kiếm" description="Sử dụng các bộ lọc dưới đây để tìm sách chính xác hơn">
                <UButton label="Lọc" icon="i-heroicons-funnel" variant="outline" />

                <template #body>
                    <ReuseFilter />
                </template>

                <template #footer="{ close }">
                    <div class="flex gap-3">
                        <UButton :label="hasActiveFilters ? `Xóa tất cả (${activeFiltersCount})` : 'Xóa tất cả'"
                            @click="clearAllFilters" variant="outline"
                            :color="hasActiveFilters ? 'primary' : 'neutral'" />
                        <UButton label="Áp dụng" @click="close" />
                    </div>
                </template>
            </USlideover>

            <!-- Sort Dropdown - Mobile -->
            <ReuseSort />
        </div>
    </div>
</template>

<style scoped lang="postcss">
* {
    scroll-margin-top: 4rem;
    /* Adjust based on your header height */
}
</style>