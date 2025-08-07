<script setup lang="ts">
defineProps<{
    title?: string;
    description?: string;
}>();

defineEmits(['confirm']);
</script>

<template>
    <UModal :title :ui="{ footer: 'justify-end' }">
        <template #body>
            <p>{{ description }}</p>
        </template>

        <template #footer="{ close }">
            <UButton color="secondary" @click="close">Hủy</UButton>
            <UButton color="error" @click="$emit('confirm'); close();">Xóa</UButton>
        </template>
    </UModal>
</template>
