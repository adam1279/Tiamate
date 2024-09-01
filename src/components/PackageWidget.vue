<script lang="ts" setup>
import Widget from './Widget.vue';
import { useUtilitiesStore } from '../stores/useUtilities';
import { Package } from '../classes/Package';
import { useTeamsStore } from '../stores/useTeams';
import TeamWidget from './TeamWidget.vue';
import { computed, onMounted } from 'vue';
import TeamContainer from './TeamContainer.vue';
import IconButton from './IconButton.vue';
import { FileDownIcon, SquareCheckBigIcon, SquareIcon, TrashIcon } from 'lucide-vue-next';
import { usePackagesStore } from '../stores/usePackages';
import IconToggle from './IconToggle.vue';
const props = defineProps<{
    package: Package
}>();
const currentTab = defineModel<string>("currentTab");
const util = useUtilitiesStore();
const { t, tm } = util;
const teams = useTeamsStore();
const packages = usePackagesStore();
const packTeams = computed(() => teams.ofPackage(props.package) || []);
onMounted(() => {
    console.log("kowpfoikwepfk+fie+kfwe")
    console.log(props.package.teams);
});
</script>
<template>
    <Widget class="flex-col gap-1">
        <div class="flex gap-1">
            <span class=" font-bold text-gray-dark grow">
                {{ /*util.capitalizeFirstLetter(`${t('package')} ${index + 1}`)*/ packages.nameOf(package) }}
            </span>
            <!-- <IconButton :icon="FileDownIcon" :tooltip="t('download')" @click="packages.downloadExport(package)"></IconButton> -->
            <IconToggle v-model="package.selected" :states="[{icon: SquareIcon}, {icon: SquareCheckBigIcon}]"></IconToggle>
            <IconButton :icon="TrashIcon" :tooltip="t('delete')" color="red" @click="packages.deletePackage(props.package)"></IconButton>
        </div>
        <TeamContainer class=" border-4 border-gray-dark rounded-[0.9rem] !gap-[4px] bg-gray-dark shadow-inner grow">
            <TeamWidget
                v-if="teams"
                v-for="team of packTeams"
                :team="team"
                v-model:current-tab="currentTab"
                class="border-transparent"
            ></TeamWidget>
        </TeamContainer>
    </Widget>
</template>