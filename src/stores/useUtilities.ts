import { defineStore } from "pinia";
import { useStudentsStore } from "./useStudents";
import { ref, watch } from "vue";
import { useTeamsStore } from "./useTeams";
import { usePackagesStore } from "./usePackages";
import { useSettingsStore } from "./useSettings";
import { Student } from "../classes/Student";
import { Team } from "../classes/Team";
import { Belbin } from "../classes/Belbin";

export const useUtilitiesStore = defineStore("utilities", () => {
    /**
     * Returns x if it is true, but y if it is not.
     */
    const students = useStudentsStore();
    const teams = useTeamsStore();
    const packages = usePackagesStore();
    const settings = useSettingsStore();
    const tooltip = ref<string>("");
    function xIfTrueThenY(x: any, y: any) {
        return x ? x : y;
    }
    function removeArrayItem<T>(array: T[], ...items: T[]) {
        items.forEach(item => {
            const index = array.indexOf(item);
            if (index >= 0) {
                array.splice(index, 1);
            }
        });
    }
    function objectMatch<T>(query: Partial<T>, source: T) {
        const entries = Object.entries(query);
        return entries.every(([key, value]) => (source[key as keyof T]) == value);
    }
    const genderColor: Record<Student.Gender | string, string> = {
        "undefined": "var(--color-gray)",
        "man": "var(--color-tiamate-blue)",
        "woman": "var(--color-tiamate-red)",
        "non-binary": "var(--color-tiamate-purple)"
    };
    function genderToColor(gender: Student.Gender | string) {
        return genderColor[gender];
    }
    // function groupBy<T, K extends keyof any>(arr: T[], key: (i: T) => K) {
    //     arr.reduce((groups, item) => {
    //         (groups[key(item)] ||= []).push(item);
    //         return groups;
    //     }, {} as Record<K, T[]>);
    // }
    function groupBy<T, K extends keyof any>(arr: T[], key: (i: T) => K) {
        return arr.reduce((groups, item) => {
            const groupKey = key(item);
            return {
                ...groups,
                [groupKey]: [...(groups[groupKey] || []), item]
            };
        }, {} as Record<K, T[]>);
    }
    function globalUpdate() {
        console.log("global update");
        window.electron.globalUpdate(JSON.stringify({
            students: students.all,
            teams: teams.all,
            packages: packages.all,
            settings: settings.all
        }));
    }
    function query<T, IT extends T>(all: T[] | undefined, ...queryInfos: Partial<IT>[]) {
        const _query: T[] = queryInfos.reduce((pile, queryInfo) => pile = pile.concat(all?.filter(i => objectMatch(queryInfo, i))), []);
        return all ? _query : [];
    }
    const draggedStudent = ref<Student>();
    const draggedStudentOrigin = ref<Team | undefined>();
    function dragStudent(student: Student) {
        // console.log(student);
        setTimeout(() => {
            draggedStudent.value = student;
            draggedStudentOrigin.value = teams.teamOf(student);
            draggedStudent.value.previewing = false;
            draggedStudent.value.state = "moving";
            teams.clearStudent(draggedStudent.value);
        }, 10);
        // console.log(data.value);
        // data.value.proposedTeams.forEach(t => {console.log(t); t.removeMember(draggedStudent.value.id)});
        // updateStudents();
        // updateTeams();
    }
    function dragStudentEnd() {
        setTimeout(() => {
            if (draggedStudent.value != undefined) {
                console.log("end");
                if (draggedStudentOrigin.value == undefined) dropStudentBack();
                else dropStudent(draggedStudentOrigin.value);
                draggedStudent.value = undefined;
                draggedStudentOrigin.value = undefined;
            }
        }, 10);
    }
    function dropStudent(team: Team) {
        // draggedStudent.value.currentTeam = team.id;
        // team.members.push(draggedStudent.value.id);
        // updateStudents();
        // updateTeams();
        // window.electron.data.assign("students", draggedStudent.value.id, team.id);
        if (teams.assignStudent(team, draggedStudent.value)) draggedStudent.value = undefined
    }
    function dropStudentBack() {
        // window.electron.data.assign("students", draggedStudent.value.id);
        draggedStudent.value.state = "unassigned";
        draggedStudent.value = undefined;
    }
    watch(students, globalUpdate, { deep: true });
    watch(teams, globalUpdate, { deep: true });
    watch(packages, globalUpdate, { deep: true });
    watch(settings, globalUpdate, { deep: true });
    function normalizedStandardDeviation(data: number[]): number {
        // Step 1: Calculate the mean of the dataset
        const mean = data.reduce((acc, val) => acc + val, 0) / data.length;

        // Step 2: Calculate the standard deviation
        const variance = data.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / data.length;
        const standardDeviation = Math.sqrt(variance);

        // Step 3: Calculate the range of the data
        const min = Math.min(...data);
        const max = Math.max(...data);
        const range = max - min;

        // Step 4: Calculate the maximum possible standard deviation
        const maxStandardDeviation = range / 2;

        // Step 5: Normalize the standard deviation
        const normalizedValue = 1 - (standardDeviation / maxStandardDeviation);

        // Ensure the value is between 0 and 1
        return Math.max(0, Math.min(1, normalizedValue));
    }
    function getStandardDeviation(array: number[]) {
        if (array.length < 2) {
            return undefined;
        }
        const n = array.length;
        const mean = array.reduce((a, b) => a + b) / n;
        return Math.sqrt(
            array.map((x) => Math.pow(x - mean, 2)).reduce((a, b) => a + b) / (n - 1),
        );
    }
    function evaluateTeamBalance(team: Belbin[][]): number {
        // Calculate the overall distribution of roles in the team
        const roleTotals: { [key: string]: number } = {};

        team.forEach(member => {
            member.forEach(({ role, percentage }) => {
                if (!roleTotals[role]) {
                    roleTotals[role] = 0;
                }
                roleTotals[role] += percentage;
            });
        });

        // Normalize the totals
        const total = Object.values(roleTotals).reduce((sum, value) => sum + value, 0);
        const normalizedDistribution = Object.keys(roleTotals).map(role => roleTotals[role] / total);

        // Independent variable: the sequence of numbers [0, 1, 2, ..., n-1]
        const indices = normalizedDistribution.map((_, i) => i);

        // Calculate the mean of indices and mean of normalized role distribution
        const meanIndex = indices.reduce((sum, value) => sum + value, 0) / indices.length;
        const meanDistribution = normalizedDistribution.reduce((sum, value) => sum + value, 0) / normalizedDistribution.length;

        // Calculate the numerator and denominator for the slope (b1)
        let numerator = 0;
        let denominator = 0;
        for (let i = 0; i < indices.length; i++) {
            numerator += (indices[i] - meanIndex) * (normalizedDistribution[i] - meanDistribution);
            denominator += (indices[i] - meanIndex) ** 2;
        }

        // Slope of the regression line
        const slope = numerator / denominator;

        // A slope of 0 means perfect balance; the larger the slope, the more imbalanced the team
        // We can normalize this slope to a score between 0 and 1
        const maxSlope = Math.max(...normalizedDistribution); // Max possible slope (not strictly correct but for normalization purposes)
        const balanceScore = 1 - Math.abs(slope / maxSlope);

        return balanceScore;
    }
    function tally(array: string[]): { [k: string]: number }
    function tally<itemT>(array: itemT[], callback?: (item: itemT) => string | number): { [k: string]: number } {
        let _tally: { [k: string]: number } = {};
        array.forEach((item) => {
            const key = callback ? String(callback(item)) : (item as string);
            _tally[key] = xIfTrueThenY(_tally[key], 0) + 1;
        });
        return _tally;
    }
    function average(array: number[]) {
        if (array.length > 0) {
            const sum = array.reduce((acc, cur) => acc + cur);
            const average = sum / array.length;
            return average;
        }
    }
    function mergeDeep<T extends Object>(target: T, ...sources: Object[]) {
        if (!sources.length) return target;
        const source = sources.shift();
        for (const key in source) {
            if (typeof source[key as keyof typeof source]) {
                if (!target[key as keyof typeof target]) Object.assign(target, { [key]: {} });
                mergeDeep(target[key as keyof typeof target], source[key as keyof typeof source]);
            } else {
                Object.assign(target, { [key]: source[key as keyof typeof source] });
            }
        }

        return mergeDeep(target, ...sources);
    }
    function assignDeep<T extends Object>(target: T, ...sources: Partial<T>[]) {
        
    }
    function capitalizeFirstLetter(string: string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }
    return {
        xIfTrueThenY,
        removeArrayItem,
        objectMatch,
        genderToColor,
        groupBy,
        tooltip,
        genderColor,
        globalUpdate,
        query,
        draggedStudent,
        draggedStudentOrigin,
        dragStudent,
        dragStudentEnd,
        dropStudent,
        dropStudentBack,
        normalizedStandardDeviation,
        getStandardDeviation,
        evaluateTeamBalance,
        tally,
        average,
        mergeDeep,
        capitalizeFirstLetter
    }
});