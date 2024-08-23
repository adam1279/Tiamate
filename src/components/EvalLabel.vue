<script setup lang="ts">
import { LucideIcon } from 'lucide-vue-next';
import TooltipItem from './TooltipItem.vue';
import { computed, onMounted, reactive, ref, watch } from 'vue';
import { useUtilitiesStore } from '../stores/useUtilities';
import NumberAnimation from './NumberAnimation.vue';

const props = defineProps<{
    icon: LucideIcon,
    tooltip: string,
    compute?: () => number[],
    values?: number[]
    defaultValue?: number[]
}>();
const util = useUtilitiesStore();
const computedValues = computed<number[]>(props.compute || (() => props.values));
</script>
<template>
    <TooltipItem :text="tooltip" class="flex p-1 rounded text-xs items-center gap-1 w-fit font-bold text-gray-dark absolute bottom-2 right-2 font-mono border border-gray bg-white">
        <component :is="icon" class="size-4 stroke-2"></component>
        <span><slot></slot></span>
        <!-- <span v-for="value of computedValues"><NumberAnimation :number="value"></NumberAnimation></span>  -->
    </TooltipItem>
</template>