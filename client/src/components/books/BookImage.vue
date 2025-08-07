<script setup lang="ts">
import { ref } from 'vue';
import BookPlaceholder from '@/assets/book-placeholder.png';

const props = defineProps<{
    bookId: string;
    class?: string;
}>();
const imageUrl = ref(`/uploads/books/${props.bookId}`);
</script>

<template>
    <img :src="imageUrl" @error="imageUrl = BookPlaceholder" :class="['object-cover', $props.class]" />
</template>