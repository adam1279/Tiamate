import { defineStore } from "pinia";
// import { IPackage } from "src/classes";
import { onMounted, ref } from "vue";
import { Package } from "../classes/Package";
import { Team } from "../classes/Team";

export const usePackagesStore = defineStore("packages", () => {
    const all = ref<Package[]>([]);
    onMounted(async () => {
        all.value = (await window.electron.data.get()).packages;
    });
    function add(teams: Team[]) {
        all.value.push(new Package({teams: teams.map(team => team.id)}));
    }
    return {
        all,
        add
    };
});