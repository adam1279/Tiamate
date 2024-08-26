<script setup lang="ts">
import { IPage as _Page } from "src/ipc";
import Page from "../Page.vue";
import Widget from "../Widget.vue";
import PageSection from "../PageSection.vue";
import {createLucideIcon, Icon, CogIcon, CompassIcon, CopyrightIcon, CrosshairIcon, HeartHandshakeIcon, LightbulbIcon, MegaphoneIcon, MicroscopeIcon, PhoneIcon, RocketIcon, Squircle, WrenchIcon} from "lucide-vue-next";
import IconButton from "../IconButton.vue";
import { ref } from "vue";
import { Belbin } from "../../classes/Belbin";
import { useUtilitiesStore } from "../../stores/useUtilities";
import TooltipItem from "../TooltipItem.vue";
import ExternalLink from "../ExternalLink.vue";
const util = useUtilitiesStore();
const { t } = util;
const props = defineProps<{
    page: _Page,
    currentPage: string
}>();
</script>
<template>
    <Page :page="page" :current-page="currentPage">
        <template #options>
        </template>
        <div class=" overflow-y-auto">
            <PageSection :title="t('license', 2)" :icon="CopyrightIcon">
                <Widget class=" flex-col">
                    <h1 class=" font-bold text-gray-dark">Lucide License</h1>
                    <div class=" flex flex-col gap-2 border-l-2 border-tiamate-blue pl-2">
                        <p>Copyright (c) for portions of Lucide are held by Cole Bemis 2013-2022 as part of Feather (MIT). All other copyright (c) for Lucide are held by Lucide Contributors 2022.</p>
                        <p>Permission to use, copy, modify, and/or distribute this software for any purpose with or without fee is hereby granted, provided that the above copyright notice and this permission notice appear in all copies.</p>
                        <p>THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.</p>
                        <ExternalLink href="https://lucide.dev/license"></ExternalLink>
                    </div>
                </Widget>
            </PageSection>
            <!-- <Icon :icon-node="crosshair2"></Icon> -->
            <!-- <component :is="Crosshair2Icon"></component> -->
            <PageSection :title="t('belbin_role', 2)" :icon="CompassIcon">
                <div class="grid lg:grid-cols-3 sm:grid-cols-2 gap-3">
                    <Widget class=" flex-row" v-for="role of Belbin.roles">
                        <div class="flex flex-col grow">
                            <div class="flex gap-1 items-start">
                                <h1 class=" grow font-bold text-gray-dark z-10">{{ t(role, 1) }}</h1>
                                <component :is="Belbin.data[role].icon" class=" size-8 align-middle text-tiamate-blue stroke-1 shrink-0 float-right"></component>
                            </div>
                            <div class=" flex flex-col border-l-2 border-tiamate-blue pl-2 grow z-10" >
                                <div class=" grow">
                                    <p class=" text-pretty ">{{ t('roleDesc.' + role) }}</p>

                                </div>
                                <div class="flex grow min-h-2"></div>
                                <ExternalLink :href="Belbin.url.href" :text="`${Belbin.url.hostname}/...`" :tooltip-prefix="t('source')"></ExternalLink>
                            </div>

                        </div>
                        
                    </Widget>

                </div>
            </PageSection>
            <!-- <PageSection :title="$tc('belbin_role', 2)" :icon="CompassIcon" class=" flex">
                <Widget class=" flex-row lg:w-[30%] sm:w-[40%] grow relative" v-for="role of belbinRoles">
                    <div class="flex flex-col grow">
                        <div class="flex gap-1 items-start">
                            <h1 class=" grow font-bold text-gray-dark z-10">{{ $tc(role.name, 1) }}</h1>
                            <component :is="role.icon" class=" size-8 align-middle text-tiamate-blue stroke-1 shrink-0 float-right"></component>
                        </div>
                        <div class=" flex flex-col border-l-2 border-tiamate-blue pl-2 grow z-10" >
                            <div class=" grow">
                                <p class=" text-pretty ">{{ t('roleDesc.' + role.name) }}</p>

                            </div>
                            <div class="flex grow min-h-2"></div>
                            <a href="https://www.belbin.com/about/belbin-team-roles" class=" text-sm text-tiamate-blue">belbin.com/about/...</a>
                        </div>

                    </div>
                    
                </Widget>
                <div class=" w-[40%] grow"></div>
            </PageSection> -->
        </div>
        
    </Page>
</template>