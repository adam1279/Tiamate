<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import IconButton from './IconButton.vue';
import TooltipItem from './TooltipItem.vue';
interface Tab {
    title: string,
    icon?: Object,
    id: string
}
const props = defineProps<{
    tabs: [Tab, ...Tab[]],
    endTabs?: [Tab, ...Tab[]],
    // currentTab?: string
    // tabs: Tab[]
}>();
const emit = defineEmits(['tabChange']);
// const currentTab = ref("");
const currentTab = defineModel<string>("currentTab");
// onMounted(() => {
//     currentTab.value = (props.currentTab) ? props.currentTab : props.tabs[0].id;
// });
// watch(() => props.currentTab, (n, o) => {
//     if (n != o) currentTab.value = props.currentTab;
//     if (n == undefined) currentTab.value = o;
// });
function changeTab(tab: string) {
    currentTab.value = tab;
    emit('tabChange', tab);
}
</script>
<template>
    <div class="flex flex-col rounded-md border border-gray relative overflow-hidden">
        <div class="flex bg-gray-light pt-1 rounded-t-md">
            <div class="border-b border-gray w-1"></div>
            <div v-for="tab of tabs"
                @click="changeTab(tab.id)"
                :data-current="tab.id == currentTab"
                class="cursor-pointer rounded-t-md data-[current=true]:bg-white pb-1 p-[calc(0.25rem+1px)] data-[current=true]:p-1 data-[current=true]:pb-[calc(0.25rem+1px)] border-b border-b-gray border-transparent data-[current=true]:border-b-0 data-[current=true]:border-gray data-[current=true]:border data-[current=true]:cursor-default text-gray data-[current=true]:text-gray-dark hover:text-gray-dark"
            >
                <TooltipItem v-if="tab.icon" :text="tab.title">
                    <component :is="tab.icon" class=" stroke-1 transition-colors"></component>
                </TooltipItem>
                <span v-else>{{ tab.title }}</span>
            </div>
            <div class="grow border-b border-gray min-w-1"></div>
            <div v-for="tab of endTabs"
                @click="changeTab(tab.id)"
                :data-current="tab.id == currentTab"
                class="cursor-pointer rounded-t-md data-[current=true]:bg-white pb-1 p-[calc(0.25rem+1px)] data-[current=true]:p-1 data-[current=true]:pb-[calc(0.25rem+1px)] border-b border-b-gray border-transparent data-[current=true]:border-b-0 data-[current=true]:border-gray data-[current=true]:border data-[current=true]:cursor-default text-gray data-[current=true]:text-gray-dark hover:text-gray-dark"
            >
                <TooltipItem v-if="tab.icon" :text="tab.title">
                    <component :is="tab.icon" class=" stroke-1 transition-colors"></component>
                </TooltipItem>
                <span v-else>{{ tab.title }}</span>
            </div>
            <div class="border-b border-gray w-1"></div>
        </div>
        <div class="p-3 border-t-0 rounded-b-md overflow-auto" v-for="tab of tabs.concat(endTabs)" v-show="currentTab == tab.id">

            <slot :name="tab.id"></slot>
        </div>
        <div class=" absolute top-0 right-0 left-0 bottom-0 pointer-events-none rounded-md shadow-inner z-30"></div>
    </div>
</template>