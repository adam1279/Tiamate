<script setup lang="ts">
import { computed, onMounted } from 'vue';
import BelbinCompass from '../components/BelbinCompass.vue';
import PackageWidget from '../components/PackageWidget.vue';
import { usePackagesStore } from '../stores/usePackages';
import { useStudentsStore } from '../stores/useStudents';
import { useTeamsStore } from '../stores/useTeams';
import { useUtilitiesStore } from '../stores/useUtilities';
import TeamWidget from '../components/TeamWidget.vue';
import PrintTeam from '../components/PrintTeam.vue';
import { useSettingsStore } from '../stores/useSettings';
import { HistoryIcon, Loader2Icon, ScaleIcon } from 'lucide-vue-next';
import { Team } from '../classes/Team';
import PrintFooter from '../components/PrintFooter.vue';
// import { useUtilitiesStore } from './stores/useUtilities';
const util = useUtilitiesStore();
const { t, tm } = util;
const packages = usePackagesStore();
const teams = useTeamsStore();
const students = useStudentsStore();
const settings = useSettingsStore();
const stats = [
    {
        icon: ScaleIcon,
        value: (team: Team) => util.percentageToString(teams.evaluateBelbin(students.ofTeam(team))),
        desc: () => `${tm(["balance"], ["in"], ["belbin_role", 2])}`
    },
    {
        icon: HistoryIcon,
        value: (team: Team) => {
            const teamStudents = students.ofTeam(team);
            let decimalNumber = util.average(teamStudents.map(student => students.previousTeamsInCommon(student, ...teamStudents)));
            decimalNumber = Math.round(decimalNumber*10)/10;
            return decimalNumber.toString().replace(".", t("decimalPoint"));
        },
        desc: () => `${tm(["average"])} # ${t("previous", 2).slice(0, 4)}. ${tm(["team", 1, ""], ["member", 2])}`
    }
];
function arrayChunks<T>(array: T[], chunkSize: number = 6) {
    const chunks = [];
    for (let i = 0; i < array.length; i += chunkSize) {
        chunks.push(array.slice(i, i + chunkSize));
        // do whatever
    }
    return chunks;
}
const pages = computed(() => {
    return packages.query({selected: true}).flatMap(pack => {
        return arrayChunks(teams.ofPackage(pack)).map(chunk => {
            return {
                teams: chunk,
                package: pack
            };
        });
    });
})
// console.log(packages.all);
// console.log(students.ofTeam(teams.ofPackage(packages.query()[0])[0]));
// const util = useUtilitiesStore();
// onMounted(async () => {
//     // console.log(await packages.init());
//     // console.log(students.ofTeam(teams.ofPackage(packages.query()[0])[0]));
// })
</script>
<template>
    <!-- <span class=" text-tiamate-red font-bold">Print</span> -->
    <!-- <PackageWidget v-for="pack of packages.all" :package="pack">

    </PackageWidget> -->
    <!-- <div class=" print:hidden items-center fixed top-0 bottom-0 left-0 right-0 bg-white z-30">
        <div class="flex gap-1 text-lg text-center grow">
            <span>Printing...</span>
            <Loader2Icon class=" animate-spin"></Loader2Icon>
        </div>
    </div> -->
    <div v-if="util.mounted" class=" ">
        <!-- <span>{{ packages.all }}</span> -->
        <div
            v-for="(page, index) of pages"
            class="flex flex-col break-after-page gap-1 relative h-screen"
        >
            <!-- <div
                v-for="team of teams.ofPackage(pack)"
                class=""
            >
                {{ students.ofTeam(team) }}
                <span v-if="team">{{ teams.nameOf(team) }}</span>
                <BelbinCompass v-if="team && students.ofTeam(team)" :diameter="200" :students="students.ofTeam(team)"></BelbinCompass>
                <TeamWidget :team="team" current-tab="members"></TeamWidget>
            </div> -->
            <span class=" font-bold text-xl ">{{ packages.nameOf(page.package) }}</span>
            <div :data-portrait="!!settings.all.export.portrait" class=" data-[portrait=false]:grid-cols-2 data-[portrait=false]:grid-rows-3 data-[portrait=true]:grid-cols-3 data-[portrait=true]:grid-rows-2 grid gap-3 grow">
                <PrintTeam v-for="team of page.teams" :team="team" :stats="stats" class=""></PrintTeam>
            </div>
            <PrintFooter :page-number="index + 1" :page-count="pages.length" :stats="stats"></PrintFooter>
        </div>
    </div>
</template>