<script setup lang="ts">
import { useTeamsStore } from '../stores/useTeams';
import { Team } from '../classes/Team';
import { useStudentsStore } from '../stores/useStudents';
import BelbinCompass from './BelbinCompass.vue';
import MemberSlotBar from './MemberSlotBar.vue';
import { useSettingsStore } from '../stores/useSettings';
import { HistoryIcon, LucideIcon, ScaleIcon } from 'lucide-vue-next';

const props = defineProps<{
    team: Team,
    stats: {
        icon: LucideIcon,
        value: (team: Team) => string,
    }[],
    
}>();
const teams = useTeamsStore();
const students = useStudentsStore();
const settings = useSettingsStore();
const { includeCompass, includeStats, portrait } = settings.all.export;
</script>
<template>
    <div :data-portrait="!!portrait" class="flex data-[portrait=true]:flex-col p-3 gap-3 rounded-lg border border-gray grow" v-if="team">
        <div class="flex flex-col grow gap-1">
            <span class=" font-bold text-gray-dark">{{ teams.nameOf(team) }}</span>
            <div class="flex flex-col grow">
                <span v-for="student of students.ofTeam(team)" class=" text-xs odd:bg-gray-light w-full px-1">{{ student?.name }}</span>
            </div>
            <div v-if="includeStats" class=" flex gap-1">
                <div v-for="stat of stats" class=" rounded text-gray-dark p-1 border border-gray gap-1 items-center flex text-xs font-bold font-mono">
                    <component :is="stat.icon" class=" size-4"></component>
                    <span>{{ stat.value(team) }}</span>
                </div>
            </div>
        </div>
        <div :data-portrait="!!portrait" class="flex data-[portrait=false]:h-full data-[portrait=true]:w-full aspect-square items-center justify-center">
            <BelbinCompass v-if="includeCompass" :diameter="170" :students="students.ofTeam(team)" :previewed-students="[]" :include-icons="true"></BelbinCompass>
        </div>
    </div>
</template>