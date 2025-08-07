<script setup lang="ts">

</script>

<template>
    <UApp>
        <component :is="$route.meta.layout || 'div'">
            <RouterView />
        </component>
    </UApp>
</template>