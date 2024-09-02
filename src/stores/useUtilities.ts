import { defineStore } from "pinia";
import { useStudentsStore } from "./useStudents";
import { computed, ref, watch } from "vue";
import { useTeamsStore } from "./useTeams";
import { usePackagesStore } from "./usePackages";
import { useSettingsStore } from "./useSettings";
import { Student } from "../classes/Student";
import { Team } from "../classes/Team";
import { Belbin } from "../classes/Belbin";
import { language } from "../language";

export const useUtilitiesStore = defineStore("utilities", () => {
    /**
     * Returns x if it is true, but y if it is not.
     */
    const students = useStudentsStore();
    const teams = useTeamsStore();
    const packages = usePackagesStore();
    const settings = useSettingsStore();
    const tooltip = ref<string>("");
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
        if (mounted) {
            console.log("global update");
            window.electron.globalUpdate(JSON.stringify({
                students: students.all,
                teams: teams.all,
                packages: packages.all,
                settings: settings.all
            }));
        }
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
            draggedStudentOrigin.value = teams.teamOf(student, {state: "proposed"});
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
                console.log(draggedStudentOrigin.value);
                if (draggedStudentOrigin.value == undefined) {
                    console.log("Origin undefined");
                    dropStudentBack();
                }
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
            _tally[key] = (_tally[key] || 0) + 1;
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
    function t(text: string, n: number = 1, messages?: {[k:string]: string}) {
        let langData: object = language[settings.all.language];
        const splitText = text.split(".");
        // console.log(splitText);
        for (let i = 0; i < splitText.length - 1; i++) {
            const split = splitText[i]
            if (split in langData) {
                langData = langData[split as keyof typeof langData];
            } else {
                return "";
            }
        }
        // console.log(langData[splitText[splitText.length - 1] as keyof typeof langData]);
        const result = langData[splitText[splitText.length - 1] as keyof typeof langData] as string;
        if (!result) return "";
        const split = result.split(" | ");
        let result2 = split[n - 1] || split[0] || "";
        if (messages) {
            for (let [key, message] of Object.entries(messages)) {
                result2 = result2.replaceAll(`{${key}}`, message);
            }
        }
        return result2;
        // console.log(text);
        // const [split, split2] = text.split(".");
        // console.log(split);
        // console.log(split2);
        // let result: object | string = langData[split as keyof typeof langData];
        // console.log(result);
        // if (split2 && typeof result == "object") {
        //     result = result[split2 as keyof typeof result] as string;
        // }
        // if ((result as string) in langData) {
        //     // const result = ((split2 ? [split2] : langData[split as keyof typeof langData]) as string);
        //     return (result as string).split(" | ")[n - 1];
        // }
        // return "";
    }
    const loading = ref(false);
    type SpaceType = "" | "s" | "-";
    const spaceData: Record<SpaceType, string> = {
        "": "connectingSpace",
        "s": "connectingSpace2",
        "-": "connectingSpace3"
    };
    function tm(...texts: ([string, number?] | [string, SpaceType] | [string, number, SpaceType])[]) {
        let result = "";
        texts.forEach(text => {
            const n = (typeof text[1] == "number") ? text[1] : 1;
            const space = (typeof text[1] == "string") ? t(spaceData[text[1]]) : (typeof text[2] == "string" ? t(spaceData[text[2]]) : " ");
            // console.log([text[0], n]);
            // console.log(t(text[0], n));
            result += t(text[0], n) + space;
        });
        return result.slice(0, result.length - 1);
    }
    const mounted = computed((): boolean => {
        return [students, teams, packages, settings].every(item => item.mounted)
    });
    function percentageToString(perc: number) {
        return `${Math.round(perc*1000)/10}%`.replace(".", t("decimalPoint"));
    }
    async function openUrl(url: string) {
        return window.electron.openUrl(url);
    }
    return {
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
        capitalizeFirstLetter,
        t,
        tm,
        mounted,
        percentageToString,
        loading,
        openUrl
    }
});