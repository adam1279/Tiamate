<script setup lang="ts">
import { computed, onMounted } from 'vue';
import BelbinCompass from './components/BelbinCompass.vue';
import PackageWidget from './components/PackageWidget.vue';
import { usePackagesStore } from './stores/usePackages';
import { useStudentsStore } from './stores/useStudents';
import { useTeamsStore } from './stores/useTeams';
import { useUtilitiesStore } from './stores/useUtilities';
import TeamWidget from './components/TeamWidget.vue';
import PrintTeam from './components/PrintTeam.vue';
import { useSettingsStore } from './stores/useSettings';
import { HistoryIcon, ScaleIcon } from 'lucide-vue-next';
import { Team } from './classes/Team';
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
    <div v-if="util.mounted">
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
            <div class="flex w-full items-center text-sm text-gray-dark gap-8 mt-8">
                <a class="flex items-center gap-1 font-semibold" href="https://github.com/adam1279/Tiamate">
                    <img src="/src/icons/Egg_logo_black.svg" class=" h-7">
                    <span>Tiamate</span>
                </a>
                <div v-if="settings.all.export.includeStats" class="flex gap-6">
                    <div class="flex items-center gap-1" v-for="stat of stats">
                        <component :is="stat.icon" class=" size-4"></component>
                        <span class=" first-letter:uppercase">{{ stat.desc() }}</span>
                    </div>
                </div>
                <div class="grow"></div>
                <div class="flex items-center ">
                    <span>{{ index + 1 }} / {{ pages.length }}</span>
                </div>
            </div>
        </div>
    </div>
</template>