<script setup lang="ts">
import { computed } from 'vue';

interface Section {
    color: string,
    percentage: number,
    title: string
}
const props = defineProps<{
    sections: Section[],
    limit: number,
    amount: number
}>();
</script>
<template>
    <!-- <svg height="10" view-box="0 0 200 5">
        <rect></rect>
    </svg> -->
    <div class="flex h-1 w-full gap-0.5 rounded-full overflow-hidden bg-gray-light">
        <div class="flex h-full w-[var(--width)] transition-all rounded-full overflow-hidden" :style="`--width: ${amount/limit*100}%`">
            <div v-for="section of sections"
                :style="`--color: ${section.color}; --width: ${section.percentage*100}%`"
                class=" bg-[var(--color)] h-full w-[var(--width)] transition-all"
            ></div>
        </div>
    </div>
    <!-- <div class="flex h-1 gap-1">
        <div v-for="slot of slots"
            class=" h-full bg-gray-light grow rounded-full overflow-hidden"
        >
            <div class="h-full w-0 data-[active=true]:w-full transition-all bg-[var(--color)]"
                :style="`--color: ${slot.section?.color}`"
                :data-active="!!slot.section"
            ></div>
        </div>
    </div> -->
</template>