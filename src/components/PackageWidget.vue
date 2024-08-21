<script lang="ts" setup>
import Widget from './Widget.vue';
import { useUtilitiesStore } from '../stores/useUtilities';
import { Package } from '../classes/Package';
import { useTeamsStore } from '../stores/useTeams';
import TeamWidget from './TeamWidget.vue';
import { computed } from 'vue';
const props = defineProps<{
    package: Package,
    index: number
}>();
const util = useUtilitiesStore();
const teams = useTeamsStore();
const packTeams = computed(() => teams.ofPackage(props.package));
</script>
<template>
    <Widget class="flex-col gap-1">
        <span class=" font-bold text-gray-dark">{{ util.capitalizeFirstLetter(`${$t('package')} ${index + 1}`) }}</span>
        <div class=" grid grid-cols-5 p-3 rounded-xl bg-gray-light border-gray border shadow-inner grow gap-3">
            <TeamWidget
                v-for="(team, index) of packTeams"
                :team="team"
                :index="index"
                current-tab="members"
                
            ></TeamWidget>
        </div>
    </Widget>
</template>