<script setup lang="ts">
import {IPage} from "../classes";
import { useUtilitiesStore } from "../stores/useUtilities";
const util = useUtilitiesStore();
// const { t } = util;
const props = defineProps<{
    page: IPage,
    currentPage: string
}>();
</script>
<template>
    <!-- <Transition enter-from-class="opacity-0 absolute" enter-to-class="opacity-100 relative" enter-active-class="transition-all" > -->
        <div class="flex flex-col flex-grow bg-gray-light overflow-y-hidden" v-show="currentPage == page.id">
            <div class="bg-white p-3 flex flex-row border-b border-gray">
                <div class="grow">
                    <span class=" font-bold text-xl select-none">{{ $t('page.' + page.id) }}</span>
                </div>
                <div class="flex flex-row gap-2 items-center">
                    <slot name="options"></slot>
                </div>
            </div>
            <div class="flex flex-col overflow-y-hidden grow">
                <slot></slot>
            </div>
        </div>
    <!-- </Transition> -->
</template>
<style scoped>
</style>