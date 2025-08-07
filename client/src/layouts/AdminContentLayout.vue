<script setup lang="ts">
defineProps<{ title: string; }>();
</script>

<template>
    <header
        class="h-16 sticky top-0 flex items-center justify-between border-b border-default px-4 sm:px-6 gap-1.5 z-50 bg-default">
        <h1 class="flex items-center gap-1.5 font-semibold text-highlighted truncate flex-1">{{ title }}</h1>
        <slot name="header-buttons" class="flex items-center gap-2" />
    </header>
    <div class="space-y-6 mt-6 px-4">
        <slot />
    </div>
</template>