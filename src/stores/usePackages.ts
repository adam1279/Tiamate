import { defineStore } from "pinia";
// import { IPackage } from "src/classes";
import { onMounted, ref } from "vue";
import { Package } from "../classes/Package";
import { Team } from "../classes/Team";
import { useUtilitiesStore } from "./useUtilities";
import { useTeamsStore } from "./useTeams";

export const usePackagesStore = defineStore("packages", () => {
    const all = ref<Package[]>([]);
    const util = useUtilitiesStore();
    const teams = useTeamsStore();
    onMounted(async () => {
        all.value = util.xIfTrueThenY((await window.electron.data.get())?.packages?.map(pack => new Package(pack)), []);
    });
    function add(teams: Team[]) {
        all.value.push(new Package({teams: teams.map(team => team.id)}));
    }
    function deletePackage(...packages: Package[]) {
        packages.forEach(pack => {
            teams.ofPackage(pack).forEach(team => teams.deleteTeam);
            util.removeArrayItem(all.value, pack);
        });
    }
    return {
        all,
        add,
        deletePackage
    };
});