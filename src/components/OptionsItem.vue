<script setup lang="ts">
import { getCurrentInstance } from 'vue';

const props = defineProps<{
    icon?: Object,
    red?: boolean
}>();
</script>
<template>
    <li :data-red="red" class="p-2 text-gray-darker flex gap-1 text-sm items-center hover:bg-gray/10 transition-colors cursor-pointer data-[red=true]:hover:text-warning-red">
        <component v-if="icon" :is="icon" :size="18" class=" "></component>
        <slot></slot>
    </li>
</template>