<script setup lang="ts">
import CTULogo from '/CTULogo.svg?url';
const items = [
    {
        key: 'reader',
        label: 'Người đọc',
        slot: 'reader'
    },
    {
        key: 'staff',
        label: 'Nhân viên',
        slot: 'staff'
    }
];
</script>

<template>
    <div
        class="bg-[url('/LoginBG.jpg')] bg-cover bg-fixed flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 sm:px-6 lg:px-8">
        <UCard class="max-w-md w-full">
            <template #header>
                <div class="text-center">
                    <img :src="CTULogo" class="h-32 mx-auto" alt="CTU Logo">
                </div>
            </template>

            <UTabs :items>
                <template #reader>
                    <div class="space-y-6">
                        <!-- Error Message -->
                        <!-- <UAlert v-if="error" color="error" variant="soft" :title="error" /> -->

                        <!-- Reader Login Form -->
                        <ReaderLogin />
                    </div>
                </template>

                <template #staff>
                    <div class="space-y-6">
                        <!-- Error Message -->
                        <!-- <UAlert v-if="error" color="error" variant="soft" :title="error" /> -->

                        <!-- Staff Login Form -->
                        <StaffLogin />
                    </div>
                </template>
            </UTabs>
        </UCard>
    </div>
</template>
