<script setup lang="ts">
import TooltipItem from "./TooltipItem.vue";
import { computed } from "vue";
import { Belbin } from "../classes/Belbin";
const props = defineProps<{
    role: Belbin
}>();
function getPerc(num: number) {
    return Math.round(num*10)*10;
}
const color = computed(() => {
    if (props.role.percentage <= 0.3) return "red";
    if (props.role.percentage <= 0.6) return "yellow";
    return "green";
})
const perc = computed(() => {
    return Math.round(props.role.percentage*10)*10;
})
</script>
<template>
    <TooltipItem
        :text="`${$t(role.role)} ${Math.round(role.percentage*100)}%`"
        class="
            relative
            flex bg-gradient-to-t
            from-${color}-700/20
             bg-gray-light overflow-hidden
            to-${getPerc(role.percentage)}% to-gray-light from-${getPerc(role.percentage)}% w-fit rounded-lg text-${color}-700 items-center p-1
            text-[color:var(--color)]
        "
        :style="`--perc: ${100-perc}%; --color: var(--color-${color}-700)`"
    >
        <!-- :style="`background: linear-gradient(to top, var(--color-${color}-700) 0%, var(--color-gray-light) 100%)`" -->
        <div class="absolute rounded-b-md bottom-0 left-0 right-0 top-[var(--perc)] bg-[color:var(--color)] opacity-20"></div>
        <component :is="Belbin.data[role.role].icon" class=" size-5 z-20"></component>
    </TooltipItem>
</template>