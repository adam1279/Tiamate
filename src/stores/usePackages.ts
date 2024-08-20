import { defineStore } from "pinia";
// import { IPackage } from "src/classes";
import { onMounted, ref } from "vue";
export class Package {
    public name?: string;
    public teams: string[] = [];
    public id: string;
    constructor(init?: Partial<Package>) {
        this.id = Date.now().toString(36) + Math.random().toString(36).substring(2);
        Object.assign(this, init);
    }
}
export interface IPackage extends Package {}
export const usePackagesStore = defineStore("packages", () => {
    const all = ref<IPackage[]>([]);
    onMounted(async () => {
        all.value = (await window.electron.data.get()).packages;
    });
    return {
        all
    };
});