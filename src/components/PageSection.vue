<script setup lang="ts">
import { ChevronDownIcon, ChevronRightIcon, CornerDownLeftIcon, SettingsIcon } from 'lucide-vue-next';
import { useUtilitiesStore } from '../stores/useUtilities';
import { computed, ref } from 'vue';
import IconButton from './IconButton.vue';
const props = defineProps<{
    title: string,
    icon: Object,
    closed?: boolean,
    custom?: boolean,
    trayIcon?: Object,
    trayTooltip?: string
}>();
const open = ref(!props.closed);
const trayOpen = ref(false);
const scroll = ref(false);
const util = useUtilitiesStore();
const checkScroll = (e: Event) => {
    const target = e.target as HTMLDivElement;
    if (target.scrollTop == 0) {
        scroll.value = false;
    } else {
        scroll.value = true;
    }
}
</script>
<template>
    <div class="flex flex-col w-full border-b border-b-gray last:border-b-0">
        <div class="flex flex-row p-3 z-20 transition-all">
            <div class="flex flex-row grow cursor-pointer items-center gap-1 select-none uppercase text-sm" @click="open = !open">
                <component :is="icon" :stroke-width="1" :size="25"></component>
                <span>{{ title }}</span>
                <ChevronDownIcon v-if="open" :stroke-width="1" :size="20"></ChevronDownIcon>
                <ChevronRightIcon v-else :stroke-width="1" :size="20"></ChevronRightIcon>
            </div>
            <div class="flex flex-row gap-2 items-center pl-5">
                <slot name="options"></slot>
                <IconButton v-if="$slots.tray" :icon="util.xIfTrueThenY(trayIcon, SettingsIcon)" @click="trayOpen = !trayOpen" :tooltip="util.xIfTrueThenY(trayTooltip, $t('setting', 2))"></IconButton>
            </div>
        </div>
        <Transition leave-from-class="opacity-100 max-h-96" leave-to-class="opacity-0 max-h-0 no-scrollbar" leave-active-class="transition-all no-scrollbar" enter-to-class="opacity-100 max-h-96" enter-active-class="transition-all no-scrollbar" enter-from-class="opacity-0 max-h-0 no-scrollbar">
            <!-- <slot v-if="custom"></slot> -->
             
            <div class="flex flex-col overflow-y-auto" v-show="open">
                <Transition leave-from-class="opacity-100 max-h-96" leave-to-class="opacity-0 max-h-0" leave-active-class="transition-all " enter-to-class="opacity-100 max-h-96" enter-active-class="transition-all" enter-from-class="opacity-0 max-h-0">
                    <div v-show="trayOpen" class=" px-3 border-gray flex border-b border-transparent data-[scroll=true]:border-b-gray">
                        <slot name="tray"></slot>
                    </div>
                </Transition>
                <div :data-tray="trayOpen" :data-scroll="scroll && open" class="flex flex-row gap-3 flex-wrap overflow-y-auto pb-3 px-3 data-[tray=true]:mt-3 transition-all border-t border-transparent data-[scroll=true]:border-t-gray" @scroll="checkScroll" >
                    <slot></slot>
                </div>
            </div>
        </Transition>
        <!-- <div v-if="!open" class=" h-1"></div> -->
    </div>
</template>