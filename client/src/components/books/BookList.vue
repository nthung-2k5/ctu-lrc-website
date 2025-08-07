<script setup lang="ts">
import { useSlots } from 'vue';

const slots = useSlots();

defineProps(['books']);
</script>

<template>
    <div>
        <div v-if="slots.title" class="flex items-center gap-4 mb-4">
            <div class="h-px bg-border flex-1"></div>
            <div class="flex items-center gap-3 px-4 py-2 bg-muted rounded-full">
                <slot name="title" />

                <span class="text-sm px-2 py-1 rounded-full">
                    {{ books.length }} cuốn
                </span>
            </div>
            <div class="h-px bg-border flex-1"></div>
        </div>

        <div class="grid grid-cols-[repeat(auto-fill,minmax(12rem,1fr))] gap-2">
            <BookCard v-for="book in books" :key="book.id" v-bind="book" />
        </div>
    </div>
</template>