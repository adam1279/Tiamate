<script lang="ts" setup>
import { CircleCheckBigIcon, CircleDotIcon, CircleIcon } from 'lucide-vue-next';
import IconButton from './IconButton.vue';
const model = defineModel<any>();
const props = defineProps<{
    value: any,
}>();
</script>
<template>
    <IconButton v-if="model != value" :icon="CircleIcon" tooltip="" @click="model = value"></IconButton>
    <IconButton v-else :icon="CircleCheckBigIcon" tooltip="" class=" pointer-events-none"></IconButton>
</template>