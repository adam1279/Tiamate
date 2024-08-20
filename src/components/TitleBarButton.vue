<script setup lang="ts">
// import { Component } from 'vue';

const props = defineProps<{
    icon?: Object,
    wide?: boolean,
    small?: boolean,
    red?: boolean
}>();
</script>
<template>
    <div :data-wide="wide" :data-red="red" class="flex hover:bg-white/10 text-white p-2 transition-colors data-[wide=true]:w-14 items-center justify-center data-[red=true]:hover:bg-warning-red">
        <slot>
            <component :is="icon" :size="(small) ? 14 : 18" :stroke-width="1"></component>
        </slot>
    </div>
</template>