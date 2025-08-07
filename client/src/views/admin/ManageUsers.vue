<script setup lang="ts">
import AdminContentLayout from '@/layouts/AdminContentLayout.vue';
import { ref, onMounted } from 'vue';
import type { Reader, Staff } from '@/openapi';
import { ReaderApi, StaffApi } from '@/api';

const readers = ref<Reader[]>([]);
const staffs = ref<Staff[]>([]);

const loadData = async () => {
    readers.value = (await ReaderApi.list()).data;
    staffs.value = (await StaffApi.list()).data;
}

onMounted(loadData);

const activeTab = ref('readers');
</script>

<template>
    <AdminContentLayout title="Quản lý người dùng">
        <template #header-buttons>
            <UButton label="Làm mới" @click="loadData" loading-auto color="primary" icon="i-heroicons-arrow-path" />
        </template>

        <div class="border-b border-gray-200">
            <nav class="-mb-px flex space-x-8">
                <button @click="activeTab = 'readers'" :class="[
                    'py-2 px-1 border-b-2 font-medium text-sm flex items-center gap-2',
                    activeTab === 'readers'
                        ? 'border-primary-500 text-primary-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                ]">
                    <UIcon name="i-heroicons-users" class="w-4 h-4" />
                    Độc giả ({{ readers.length }})
                </button>
                <button @click="activeTab = 'staffs'" :class="[
                    'py-2 px-1 border-b-2 font-medium text-sm flex items-center gap-2',
                    activeTab === 'staffs'
                        ? 'border-primary-500 text-primary-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                ]">
                    <UIcon name="i-heroicons-shield-check" class="w-4 h-4" />
                    Nhân viên ({{ staffs.length }})
                </button>
            </nav>
        </div>

        <div v-if="activeTab === 'readers'">
            <ManageReaders :readers />
        </div>

        <!-- Staffs Tab -->
        <div v-if="activeTab === 'staffs'" class="space-y-4">
            <ManageStaffs :staffs />
        </div>
    </AdminContentLayout>
</template>

