<script setup lang="ts">
import { IPage } from 'src/classes';
import { languages, useSettingsStore } from '../stores/useSettings';
import { computed } from 'vue';
const props = defineProps<{
    deployed: boolean,
    pages: IPage[],
    currentPage: string
}>();
const settings = useSettingsStore();
const mainPages = computed(() => {
    return props.pages.filter(page => page.main);
});
</script>
<template>
    <div :data-deployed="deployed" class="flex flex-col bg-gray-dark data-[deployed=true]:min-w-40 data-[deployed=true]:gap-3 data-[deployed=true]:p-3 select-none">
        <div v-if="deployed" class="flex flex-col p-3 gap-2 select-none">
            <img class=" h-24 mx-auto logo drag-none" src="/src/icons/Egg_logo_white.png">
            <span class="text-white font-bold mx-auto">Tiamate</span>
            <div class="flex-col flex">
                <span class="text-white text-xs mx-auto italic">{{ $t("by") }}</span>
                <span class="text-white italic text-xs mx-auto text-center">@adamthegolem</span>
            </div>
        </div>
        <div v-for="page of mainPages" class=" flex flex-row text-white bg-transparent" @click="$emit('pageSelect', page.id)" >
            <!-- <div v-if="deployed" class="flex flex-row p-2 gap-2 border-y-2 border-transparent text-sm rounded data-[current=true]:border-b-white data-[current=true]:bg-white/5 hover:bg-white/20 transition-colors grow" :data-current="currentPage == page.id">
                <component :is="page.icon" size="20"></component>
                <span>{{ page.title }}</span>

            </div> -->
            <!-- <Transition leave-from-class="opacity-100" leave-to-class="opacity-0" leave-active-class="transition-all" enter-to-class="opacity-100" enter-from-class="opacity-0" enter-active-class="transition-all"> -->
                <div v-if="deployed" class="flex flex-row p-2 gap-2 border-transparent text-sm rounded data-[current=true]:bg-white data-[current=true]:text-gray-dark data-[current=true]:font-[550] data-[current=true]:shadow-sm hover:bg-white/20 transition-all grow capitalize cursor-pointer data-[current=true]:cursor-default" :data-current="currentPage == page.id">
                    <component :is="page.icon" size="20"></component>
                    <span>{{ $t('page.'+page.id) }}</span>

                </div>
                <div v-else class=" hover:bg-white/20 p-2 transition-colors border-2 border-transparent data-[current=true]:border-l-white data-[current=true]:bg-white/5 cursor-pointer data-[current=true]:cursor-default" :data-current="currentPage == page.id">
                    <component :is="page.icon" size="20"></component>
                </div>

            <!-- </Transition> -->
        </div>
    </div>
</template>
<style>
.logo {
    transition: filter 1s;
}
.logo:hover {
    filter: hue-rotate(360deg);
}
@keyframes huerotate {
    0% {
        filter: hue-rotate(0deg);
    }
    100% {
        filter: hue-rotate(360deg);
    }
}
</style>