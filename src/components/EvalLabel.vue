<script setup lang="ts">
import { LucideProps } from 'lucide-vue-next';
import { FunctionalComponent } from 'vue';
import TooltipItem from './TooltipItem.vue';

const props = defineProps<{
    icon: FunctionalComponent<LucideProps, {}, any, {}>,
    tooltip: string
}>();
</script>
<template>
    <TooltipItem :text="tooltip" class="flex p-1 rounded text-xs items-center gap-1 w-fit font-bold text-gray-dark absolute bottom-2 right-2 font-mono border border-gray bg-white">
        <component :is="icon" class="size-4 stroke-2"></component>
        <span><slot></slot></span>
    </TooltipItem>
</template>