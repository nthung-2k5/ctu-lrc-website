<script setup lang="ts">
import AdminContentLayout from '@/layouts/AdminContentLayout.vue';
import { ref } from 'vue';

// Quick stats
const quickStats = ref({
    totalBooks: 1250,
    totalUsers: 350,
    todayBorrowings: 23,
    overdueBooks: 15,
    revenue: 2500000
});
</script>

<template>
    <AdminContentLayout title="Chào mừng đến với trang quản trị" class="space-y-6">
        
    </AdminContentLayout>
</template>
