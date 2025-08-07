<script setup lang="ts">
import { ref, computed } from 'vue';
import { useAuthStore } from '@/stores/auth';

const authStore = useAuthStore();

const libraryStats = ref({ totalBooks: '10,000+', activeMembers: '3,500+', dailyVisitors: '250+', openHours: '8:00 - 20:00' });
const isAuthenticated = computed(() => !authStore.isGuest);
</script>
<template>
    <section class="relative bg-gradient-to-r from-blue-700 to-indigo-800 text-white py-16">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex flex-col md:flex-row gap-8 items-center">
                <div class="md:w-1/2 space-y-6">
                    <h1 class="text-4xl md:text-5xl font-bold">Thư viện Đại học Cần Thơ</h1>
                    <p class="text-xl opacity-90">Khám phá, học hỏi và phát triển cùng kho tài nguyên phong phú của
                        chúng tôi.</p>
                    <div class="flex flex-wrap gap-4">
                        <UButton @click="$router.push('/books')" size="lg"
                            class="bg-white text-blue-700 hover:bg-gray-100">
                            <UIcon name="i-heroicons-magnifying-glass" class="mr-2 w-5 h-5" />
                            Tìm sách
                        </UButton>
                        <UButton v-if="!isAuthenticated" @click="$router.push('/login')" size="lg" variant="outline"
                            class="border-white text-white hover:bg-white hover:text-blue-700">
                            Đăng nhập
                        </UButton>
                    </div>
                </div>
                <div class="md:w-1/2 flex justify-center">
                    <div class="relative w-full max-w-md">
                        <div class="absolute -top-6 -left-6 bg-blue-500 size-40 rounded-full opacity-20"></div>
                        <div class="absolute -bottom-10 -right-10 bg-indigo-500 size-60 rounded-full opacity-20">
                        </div> <img src="/CTULogo.svg" alt="CTU Library" class="relative z-10 w-full" />
                    </div>
                </div>
            </div>
        </div>
    </section> <!-- Featured Books Section -->
    <section class="py-16 bg-gray-50">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="text-center mb-12">
                <h2 class="text-3xl font-bold text-gray-900">Sách nổi bật</h2>
                <p class="mt-4 text-lg text-gray-600">Khám phá những tựa sách mới và phổ biến nhất tại thư viện của
                    chúng tôi</p>
            </div>
            <!-- <div class="flex flex-wrap justify-center gap-8">
                <BookCard v-for="book in featuredBooks" :key="book.id" v-bind="book" />
            </div> -->
            <div class="text-center mt-12">
                <UButton @click="$router.push('/books')" variant="outline" size="lg" color="primary">
                    Xem tất cả sách
                    <UIcon name="i-heroicons-arrow-right" class="ml-2 w-4 h-4" />
                </UButton>
            </div>
        </div>
    </section> <!-- Library Info Cards -->
    <section class="py-16">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="text-center mb-12">
                <h2 class="text-3xl font-bold text-gray-900">Dịch vụ thư viện</h2>
                <p class="mt-4 text-lg text-gray-600">Chúng tôi cung cấp nhiều dịch vụ hỗ trợ học tập và nghiên cứu
                </p>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <UCard>
                    <template #header>
                        <div class="flex flex-col gap-2">
                            <UIcon name="i-heroicons-book-open" class="w-10 h-10 text-primary-600" />
                            <h3 class="text-lg font-semibold">Mượn & Trả sách</h3>
                            <p class="text-sm text-gray-500">Dễ dàng mượn và trả sách với hệ thống trực tuyến của chúng
                                tôi</p>
                        </div>
                    </template>

                    <p class="text-gray-600">Sinh viên và giảng viên có thể mượn tới 5 cuốn sách trong thời gian
                        14 ngày và gia hạn trực tuyến.</p>

                    <template #footer>
                        <UButton variant="outline" @click="$router.push('/books')" color="primary">
                            Tìm kiếm sách
                        </UButton>
                    </template>
                </UCard>

                <UCard>
                    <template #header>
                        <div class="flex flex-col gap-2">
                            <UIcon name="i-heroicons-bookmark" class="w-10 h-10 text-primary-600" />
                            <h3 class="text-lg font-semibold">Tài nguyên học tập</h3>
                            <p class="text-sm text-gray-500">Truy cập các tài liệu nghiên cứu và học thuật</p>
                        </div>
                    </template>

                    <p class="text-gray-600">Thư viện cung cấp các cơ sở dữ liệu học thuật, tạp chí nghiên cứu
                        và tài liệu chuyên ngành.</p>

                    <template #footer>
                        <UButton variant="outline" color="primary">
                            Khám phá tài nguyên
                        </UButton>
                    </template>
                </UCard>

                <UCard>
                    <template #header>
                        <div class="flex flex-col gap-2">
                            <UIcon name="i-heroicons-building-library" class="w-10 h-10 text-primary-600" />
                            <h3 class="text-lg font-semibold">Không gian học tập</h3>
                            <p class="text-sm text-gray-500">Phòng học nhóm và không gian làm việc yên tĩnh</p>
                        </div>
                    </template>

                    <p class="text-gray-600">Thư viện cung cấp nhiều không gian học tập hiện đại, từ phòng thảo
                        luận nhóm đến khu vực học tập yên tĩnh.</p>

                    <template #footer>
                        <UButton variant="outline" color="primary">
                            Đặt phòng học nhóm
                        </UButton>
                    </template>
                </UCard>
            </div>
        </div>
    </section> <!-- Library Stats -->
    <section class="py-16 bg-blue-700 text-white">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="text-center mb-12">
                <h2 class="text-3xl font-bold">Thư viện của chúng tôi</h2>
                <p class="mt-4 text-xl opacity-80">Một trong những thư viện hàng đầu tại Việt Nam</p>
            </div>
            <div class="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                <div>
                    <div class="flex justify-center">
                        <UIcon name="i-heroicons-book-open" class="w-12 h-12 mb-4" />
                    </div>
                    <p class="text-3xl font-bold">{{ libraryStats.totalBooks }}</p>
                    <p class="text-lg opacity-80">Sách & tài liệu</p>
                </div>
                <div>
                    <div class="flex justify-center">
                        <UIcon name="i-heroicons-users" class="w-12 h-12 mb-4" />
                    </div>
                    <p class="text-3xl font-bold">{{ libraryStats.activeMembers }}</p>
                    <p class="text-lg opacity-80">Thành viên tích cực</p>
                </div>
                <div>
                    <div class="flex justify-center">
                        <UIcon name="i-heroicons-users" class="w-12 h-12 mb-4" />
                    </div>
                    <p class="text-3xl font-bold">{{ libraryStats.dailyVisitors }}</p>
                    <p class="text-lg opacity-80">Lượt truy cập hàng ngày</p>
                </div>
                <div>
                    <div class="flex justify-center">
                        <UIcon name="i-heroicons-clock" class="w-12 h-12 mb-4" />
                    </div>
                    <p class="text-3xl font-bold">{{ libraryStats.openHours }}</p>
                    <p class="text-lg opacity-80">Giờ mở cửa</p>
                </div>
            </div>
        </div>
    </section> <!-- Additional Information / Footer Banner -->
    <section class="py-12 bg-gray-50">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="bg-white rounded-lg shadow-lg p-8">
                <div class="flex flex-col md:flex-row items-center justify-between gap-6">
                    <div>
                        <h3 class="text-2xl font-bold text-gray-900">Bạn cần hỗ trợ?</h3>
                        <p class="mt-2 text-gray-600">Đội ngũ thư viện của chúng tôi luôn sẵn sàng giúp đỡ bạn.</p>
                    </div>
                    <div class="flex flex-wrap gap-4">
                        <UButton>Liên hệ chúng tôi</UButton>
                        <UButton variant="outline">Câu hỏi thường gặp</UButton>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>
<style scoped>
/* Any additional custom styling */
</style>