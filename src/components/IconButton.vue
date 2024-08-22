<script setup lang="ts">
import { LucideIcon } from "lucide-vue-next";
import { useUtilitiesStore } from "../stores/useUtilities";
import TooltipItem from "./TooltipItem.vue"
const props = defineProps<{
    icon: LucideIcon,
    tooltip: string,
    color?: string,
    extendClass?: string,
    size?: string,
    bubble?: string,
    bubbleBackground?: string
}>();
const util = useUtilitiesStore();
</script>
<template>
    <TooltipItem :class="`flex cursor-pointer items-center ${(color) ? 'hover:text-'+color+'-700 hover:fill-'+color+'-700/10' : ''} h-fit transition-colors ${(extendClass) ? extendClass : 'text-gray-dark stroke-2'}`" :text="tooltip">
        <!-- :size="(size) ? size : 20" -->
        <div class="flex relative">
            <component :is="icon"  :class="`${size || 'size-5'} ${(color) ? 'hover:fill-'+color+'-700/10' : ''} stroke-2`" style="stroke-width: inherit;"></component>
            <div v-if="bubble" class="flex pl-1 bottom-[-5px] right-[-3px] text-gray-dark aspect-square absolute text-xs font-bold items-center">
                <span class=" pl-[2px] bg-[var(--bg-color)]" :style="`--bg-color: var(--color-${bubbleBackground || 'white'})`">{{ bubble }}</span>
            </div>
        </div>
    </TooltipItem>
</template>