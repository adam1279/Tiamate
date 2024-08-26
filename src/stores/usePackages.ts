import { defineStore } from "pinia";
// import { IPackage } from "src/classes";
import { onMounted, ref } from "vue";
import { Package } from "../classes/Package";
import { Team } from "../classes/Team";
import { useUtilitiesStore } from "./useUtilities";
import { useTeamsStore } from "./useTeams";
import { useStudentsStore } from "./useStudents";
import { ExportFileType, useSettingsStore } from "./useSettings";

export const usePackagesStore = defineStore("packages", () => {
    const all = ref<Package[]>([]);
    const mounted = ref(false);
    const util = useUtilitiesStore();
    const { t } = util;
    const teams = useTeamsStore();
    const students = useStudentsStore();
    const settings = useSettingsStore();
    async function init() {
        all.value = (await window.electron.data.get())?.packages?.map(pack => new Package(pack)) || [];
        return all.value;
    }
    onMounted(async () => {
        await init();
        mounted.value = true;
        console.log("usePackages mounted");
    });
    function add(teams: Team[]) {
        all.value.push(new Package({teams: teams.map(team => team.id)}));
    }
    function deletePackage(...packages: Package[]) {
        packages.forEach(pack => {
            teams.ofPackage(pack).forEach(team => teams.deleteTeam(team));
            util.removeArrayItem(all.value, pack);
        });
    }
    function query(...queryInfos: Partial<Package>[]): Package[] {
        return util.query(all.value, ...queryInfos);
    }
    function nameOf(pack: Package) {
        const { t } = useUtilitiesStore();
        return pack.name || `${util.capitalizeFirstLetter(t("package"))} ${all.value.indexOf(pack) + 1}`;
    }
    
    async function downloadExport(...packs: Package[]) {
        const data: {[k:string]: {name: string, members: string[]}[]} = {
            // "Package 1": teams.ofPackage(packages.all[0]).map(team => ({name: team.name, members: students.ofTeam(team).map(student => student.name)}))
        };
        packs.forEach(pack => {
            data[nameOf(pack)] = teams.ofPackage(pack).map(team => {
                return {
                    name: teams.nameOf(team),
                    members: students.ofTeam(team).map(student => student.name)
                };
            });
        });
        return await window.electron.downloadExport(JSON.stringify(data));
    }
    return {
        all,
        add,
        deletePackage,
        nameOf,
        query,
        downloadExport,
        init,
        mounted
    };
});