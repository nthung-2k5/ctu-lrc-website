<script setup lang="ts">

</script>

<template>
    <UModal class="w-full max-w-md" :closeOnClickOutside="true" :closeOnEsc="true">
        <UButton variant="outline" icon="i-lucide-search" label="Tìm kiếm sách..." />
        <template #content>
            <UCommandPalette :items="[]" placeholder="Tìm kiếm sách theo tựa đề, tác giả, nhà xuất bản hoặc mã ISBN" />
            <USeparator />
            <UButton variant="ghost" block class="justify-start rounded-none text-default">
                <span>Tìm tác giả <span class="text-primary">Nguyễn Nhật Ánh</span></span>
            </UButton>
            <UButton variant="ghost" block class="justify-start rounded-none text-default">
                <span>Tìm nhà xuất bản <span class="text-primary">Nhã Nam</span></span>
            </UButton>
        </template>
    </UModal>
</template>

<style scoped>

</style>