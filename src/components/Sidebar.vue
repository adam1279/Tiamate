<script setup lang="ts">
import { IPage } from 'src/ipc';
import { languages, useSettingsStore } from '../stores/useSettings';
import { computed } from 'vue';
import { GithubIcon, GlobeIcon } from 'lucide-vue-next';
import { useUtilitiesStore } from '../stores/useUtilities';
import TooltipItem from './TooltipItem.vue';
const props = defineProps<{
    deployed: boolean,
    pages: IPage[],
    currentPage: string
}>();
const settings = useSettingsStore();
const util = useUtilitiesStore();
const { t } = util;
const mainPages = computed(() => {
    return props.pages.filter(page => page.main);
});
</script>
<template>
    <div :data-deployed="deployed" class="group/sidebar flex flex-col bg-gray-dark data-[deployed=true]:min-w-40 data-[deployed=true]:gap-3 data-[deployed=true]:p-3 select-none">
        
        <div v-if="deployed" :data-loading="util.loading" class="flex flex-col p-3 gap-2 select-none text-white group/logo-area data-[loading=true]:animate-huerotate">
            <TooltipItem text="GitHub (https://github.com/adam1279/Tiamate)" class="flex flex-col relative" @click="util.openUrl('https://github.com/adam1279/Tiamate')">
                <!-- <img class=" h-24 mx-auto drag-none group-hover/logo-area:opacity-50 transition-opacity" src="../icons/Egg_logo_white.png"> -->
                <img class=" h-24 mx-auto drag-none group-hover/logo-area:opacity-50 transition-opacity" src="@assets/images/Egg_logo_white.svg">
                <div class=" absolute flex left-0 right-0 top-1 bottom-0 justify-center items-center opacity-0 transition-all hover:opacity-100 group-hover/logo-area:opacity-100 cursor-pointer hover:scale-110 group">
                    <GithubIcon class=" size-7 opacity-50 group-hover:opacity-100 transition-opacity"></GithubIcon>
                </div>
            </TooltipItem>
            <span class="text-white font-bold mx-auto">Tiamate</span>
            <div class="flex-col flex">
                <span class="text-white text-xs mx-auto italic">{{ t("by") }}</span>
                <span class="text-white italic text-xs mx-auto text-center">@adamthegolem</span>
            </div>
        </div>
        <div v-for="page of mainPages" class="peer/page flex flex-row text-white bg-transparent" @click="$emit('pageSelect', page.id)" :data-current="currentPage == page.id">
            <!-- <div v-if="deployed" class="flex flex-row p-2 gap-2 border-y-2 border-transparent text-sm rounded data-[current=true]:border-b-white data-[current=true]:bg-white/5 hover:bg-white/20 transition-colors grow" :data-current="currentPage == page.id">
                <component :is="page.icon" size="20"></component>
                <span>{{ page.title }}</span>

            </div> -->
            <!-- <Transition leave-from-class="opacity-100" leave-to-class="opacity-0" leave-active-class="transition-all" enter-to-class="opacity-100" enter-from-class="opacity-0" enter-active-class="transition-all"> -->
                <div v-if="deployed" class="flex flex-row p-2 gap-2 border-transparent text-sm rounded data-[current=true]:bg-white data-[current=true]:text-gray-dark data-[current=true]:font-[550] data-[current=true]:shadow-sm hover:bg-white/20 transition-all grow capitalize cursor-pointer data-[current=true]:cursor-default" :data-current="currentPage == page.id">
                    <component :is="page.icon" :size="20"></component>
                    <span>{{ t('page.'+page.id) }}</span>

                </div>
                <TooltipItem :text="t('page.'+page.id)" v-else class=" hover:bg-white/20 p-2 transition-colors border-2 border-transparent data-[current=true]:border-l-white data-[current=true]:bg-white/5 cursor-pointer data-[current=true]:cursor-default" :data-current="currentPage == page.id">
                    <component :is="page.icon" :size="20"></component>
                </TooltipItem>

            <!-- </Transition> -->
        </div>
        
        <div v-if="deployed" class=" flex order items-center cursor-pointer p-2 border border-white rounded-full text-xs mx-auto mt-auto mb-3 hover:bg-white/10 transition-colors" @click="settings.all.language = settings.all.language == 'da' ? 'en' : 'da'">
            <GlobeIcon class="size-4 stroke-white"></GlobeIcon>
            <div class=" flex items-center h-full divide-white divide-x">
                <span :data-current="settings.all.language == lang" v-for="lang of languages"
                    class=" text-gray data-[current=true]:text-white transition-colors font-mono px-1"
                >
                    {{ lang }}
                </span>
            </div>
        </div>
    </div>
</template>
<style lang="postcss">

</style>