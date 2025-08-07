<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
    id: string;
    title: string;
    status: 'available' | 'borrowing' | 'holding' | 'unavailable';
}>();

const [badgeColor, badgeText] = computed(() => {
    switch (props.status) {
        case 'available':
            return ['primary', 'Có thể mượn'];
        case 'borrowing':
            return ['success', 'Đang mượn'];
        case 'holding':
            return ['warning', 'Đang giữ'];
        case 'unavailable':
            return ['error', 'Không thể mượn'];
    };
}).value;
</script>

<template>
    <RouterLink :to="`/books/${id}`"
        class="w-48 flex flex-col mx-auto rounded-lg hover:shadow-lg transition-all hover:-translate-y-1 overflow-hidden cursor-pointer">

        <div class="bg-muted relative aspect-[3/4]">
            <BookImage :book-id="id" />
            <UBadge :color="badgeColor" :label="badgeText" class="absolute top-2 right-2" />
        </div>

        <div class="p-2 w-full text-center">
            <h3 class="font-medium line-clamp-2">{{ title }}</h3>
        </div>
    </RouterLink>
</template>
