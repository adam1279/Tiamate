<script lang="ts" setup>
import Widget from './Widget.vue';
import { useUtilitiesStore } from '../stores/useUtilities';
import { Package } from '../classes/Package';
import { useTeamsStore } from '../stores/useTeams';
import TeamWidget from './TeamWidget.vue';
import { computed } from 'vue';
import TeamContainer from './TeamContainer.vue';
import IconButton from './IconButton.vue';
import { TrashIcon } from 'lucide-vue-next';
import { usePackagesStore } from '../stores/usePackages';
const props = defineProps<{
    package: Package,
    index: number
}>();
const util = useUtilitiesStore();
const { t, tm } = util;
const teams = useTeamsStore();
const packages = usePackagesStore();
const packTeams = computed(() => teams.ofPackage(props.package));
</script>
<template>
    <Widget class="flex-col gap-1">
        <div class="flex gap-1">
            <span class=" font-bold text-gray-dark grow">{{ util.capitalizeFirstLetter(`${t('package')} ${index + 1}`) }}</span>
            <IconButton :icon="TrashIcon" :tooltip="t('delete')" color="red" @click="packages.deletePackage(props.package)"></IconButton>
        </div>
        <TeamContainer class=" p-3 rounded-xl bg-gray-light border-gray border shadow-inner grow gap-3">
            <TeamWidget
                v-for="(team, index) of packTeams"
                :team="team"
                :index="index"
                current-tab="members"
                
            ></TeamWidget>
        </TeamContainer>
    </Widget>
</template>