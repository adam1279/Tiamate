<script setup lang="ts">
import { useSettingsStore } from '../stores/useSettings';
import logoUrl from "../icons/Egg_logo_black.svg";
const props = defineProps<{
    pageNumber: number,
    pageCount: number,
    stats?: any[]
}>();
const settings = useSettingsStore();
</script>
<template>
    <div class="flex w-full items-center text-sm text-gray-dark gap-8 mt-8 logo">
        <a class="flex items-center gap-1 font-semibold" href="https://github.com/adam1279/Tiamate">
            <img :src="logoUrl" class=" h-7">
            <span>Tiamate</span>
        </a>
        <div v-if="settings.all.export.includeStats" class="flex gap-6">
            <div class="flex items-center gap-1" v-for="stat of stats">
                <component :is="stat.icon" class=" size-4"></component>
                <span class=" first-letter:uppercase">{{ stat.desc() }}</span>
            </div>
        </div>
        <div class="grow"></div>
        <div class="flex items-center ">
            <span>{{ pageNumber }} / {{ pageCount }}</span>
        </div>
    </div>
</template>