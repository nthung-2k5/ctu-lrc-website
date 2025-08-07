<script setup lang="ts">
import { DateFormatter, fromDate, getLocalTimeZone, today } from '@internationalized/date';
import { computed, shallowRef } from 'vue';

const df = new DateFormatter('vi-VN', {
    dateStyle: 'medium'
});

const yesterday = shallowRef(today(getLocalTimeZone()).subtract({ days: 1 }));

const modelValue = defineModel<Date | null>({
    type: Date,
    default: null
});

const date = computed({
    get: () => modelValue.value ? fromDate(modelValue.value, getLocalTimeZone()) : null,
    set: (value) => {
        modelValue.value = value ? value.toDate() : null;
    }
});
</script>

<template>
    <UPopover>
        <UButton color="neutral" variant="outline" icon="i-lucide-calendar">
            {{ modelValue ? df.format(modelValue) : 'Chọn ngày' }}
        </UButton>

        <template #content>
            <UCalendar class="p-2"
                v-model="date"
                :max-value="yesterday" />
        </template>
    </UPopover>
</template>
