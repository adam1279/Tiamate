<script setup lang="ts">
import { ExternalLinkIcon } from 'lucide-vue-next';
import { useUtilitiesStore } from '../stores/useUtilities';
import TooltipItem from './TooltipItem.vue';

const props = defineProps<{
    href: string,
    text?: string,
    tooltip?: string,
    tooltipPrefix?: string
}>();
const util = useUtilitiesStore();
const { t, tm } = util;
</script>
<template>
    <TooltipItem :text="tooltip || `${tooltipPrefix || tm(['open'], ['link'])} (${href})`" @click="util.openUrl(href)" class=" cursor-pointer">
        <div v-if="!$slots.default" class="flex items-center text-tiamate-blue gap-1 group">
            <span class=" text-sm">{{ text || href }}</span>
            <ExternalLinkIcon class=" stroke-1 size-5 opacity-0 group-hover:opacity-100 transition-opacity"></ExternalLinkIcon>
        </div>
        <slot></slot>
    </TooltipItem>
</template>