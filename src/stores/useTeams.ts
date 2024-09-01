import { defineStore } from "pinia";
// import { IStudent, ITeam } from "src/classes";
import { onMounted, Ref, ref, watch } from "vue";
import { useStudentsStore } from "./useStudents";
import { useUtilitiesStore } from "./useUtilities";
import { useSettingsStore } from "./useSettings";
import { ITeam, Team } from "../classes/Team";
import { Student } from "../classes/Student";
import { Belbin } from "../classes/Belbin";
import { Package } from "../classes/Package";
import { usePackagesStore } from "./usePackages";


export const useTeamsStore = defineStore("teams", () => {
    const all = ref<Team[]>([]);
    const mounted = ref(false);
    const students = useStudentsStore();
    const util = useUtilitiesStore();
    const { t } = util;
    const settings = useSettingsStore();
    const packages = usePackagesStore();
    async function init() {
        all.value = (await window.electron.data.get())?.teams?.map(team => new Team(team)) || [];
        return all.value;
    }
    onMounted(async () => {
        await init();
        mounted.value = true;
        console.log("useTeams mounted.");
    });
    function add(init: Partial<Team> = {}) {
        const team = new Team(init);
        all.value.push(team);
        return team;
    }
    // function removeStudent(team: ITeam, ...students: IStudent[]) {

    // }
    function query(...queryInfos: Partial<Team>[]): Team[] {
        return util.query(all.value, ...queryInfos);
    }
    /**Clears student(s) from all teams. */
    function clearStudent(...students: Student[]) {
        students.forEach(student => {
            console.log(query({state: "proposed"}).map(team => team.id));
            query({state: "proposed"}).forEach(team => {
                // [team.members, team.previewMembers].forEach(list => {
                //     // const index = list.indexOf(student.id);
                //     // if (index <= 0) {
                //     //     list.splice(index, 1);
                //     // }
                //     // console.log(student);
                //     util.removeArrayItem(list, student.id);
                // });
                util.removeArrayItem(team.members, student.id);
            });
        });
    }
    function checkFull(team: Team) {
        const isFull = team.members.length >= limitOf(team);
        if (settings.all.lockOnMemberLimitReached) {
            team.locked = isFull;
        }
        return isFull;
    }
    function deleteTeam(...teams: Team[]) {
        teams.forEach(team => {
            students.ofTeam(team).forEach(student => {
                student.state = "unassigned";
                // student.currentTeam = undefined;
            });
            util.removeArrayItem(all.value, team);
        });
    }
    function assignStudent(team: Team, student: Student) {
        if (team.full) {
            // student.state = "unassigned";
            return false;
        } else {
            team.assignStudent(student);
            team.full = checkFull(team);
            return true;
        }
    }
    /**
     * Returns the best team for a student to be assigned to.
     * @param student 
     * @returns 
     */
    function bestFor(student: Student): Team | undefined {
        let teams = query({ locked: false, state: "proposed", full: false });
        teams = teams.filter(team => {
            const matchingGenders = students.ofTeam(team).filter(({gender}) => gender == student.gender);
            if (limitOf(team) - matchingGenders.length == Math.floor(limitOf(team) / 2)) return false;
            else return true;
        });
        if (teams.length == 0) return undefined;
        // console.log(teams);
        let bestTeam: Team;
        let bestScore = 0;
        teams.forEach(team => {
            let score = 0;
            const studentsOfTeam = students.ofTeam(team);
            const existingRoles = studentsOfTeam.flatMap(student => student.roles);
            let belbinScore = 1;
            student.roles.forEach(subjectRole => {
                const matches = existingRoles.filter(existingRole => existingRole.role == subjectRole.role).map(({percentage}) => percentage);
                const sum = matches.reduce((sum, match) => sum += match, 0);
                belbinScore -= 1/9*sum;
            });
            // assignStudent(team, student);
            // const allStudents = students.ofTeam(team).concat(students.query({previewing: true}));
            // belbinScore *= evaluateBelbin(students.ofTeam(team).concat([student]));
            score += belbinScore * settings.all.automation.belbinWeight;
            // score += evaluateBelbin(allStudents);
            const existingPreviousTeams = studentsOfTeam.flatMap(student => student.previousTeams);
            let previousTeamScore = 1;
            student.previousTeams.forEach(subjectPreviousTeam => {
                const matches = existingPreviousTeams.filter(existingPreviousTeam => existingPreviousTeam == subjectPreviousTeam);
                previousTeamScore -= 1/10*matches.length;
            });
            score += previousTeamScore * settings.all.automation.previousTeamWeight;
            // Check if better than last.
            if (score > bestScore) {
                bestScore = score;
                bestTeam = team;
            }
        });
        // students.unassign(student);
        return bestTeam;
    }
    watch(all, () => {
        all.value.forEach(team => team.full = checkFull(team));
    }, {
        deep: true
    });
    function teamOf(student: Student): Team | undefined {
        return all.value.find(team => team.members.includes(student.id));
    }
    function limitOf(team: Team): number {
        return team.customLimit || settings.all.memberLimit;
    }
    function evaluateBelbin(students: Student[]) {
        let belbinSums = Belbin.sums();
        const idealDistribution = Belbin.sums(1/9);
        students.forEach(student => {
            if (student) {
                student.roles.forEach(role => {
                    belbinSums[role.role] += role.percentage;
                });
            }
        });
        if (Object.values(belbinSums).every(sum => sum == 0)) return 0;
        // Normalize the team's role distribution
        const totalPercentage = Object.values(belbinSums).reduce((sum, value) => sum + value, 0);
        Object.keys(belbinSums).forEach(role => {
            belbinSums[role as Belbin.Role] /= totalPercentage;
        });

        // Calculate the balance score
        let balanceScore = 0;

        Object.keys(idealDistribution).forEach((role: Belbin.Role) => {
            const teamValue = belbinSums[role] || 0;
            const idealValue = idealDistribution[role];
            balanceScore += Math.abs(idealValue - teamValue);
        });

        // Normalize balance score to be between 0 and 1
        balanceScore = 1 - balanceScore / 2; // Dividing by 2 because max imbalance could be 2 (all roles could be either 0 or 2 times the ideal)
        // return {eval: util.normalizedStandardDeviation(Object.values(belbinSums)), belbinSums};
        // return { eval: balanceScore, belbinSums };
        return balanceScore;
        // return util.evaluateTeamBalance(students.ofTeam(team).map(student => student.roles));
        // return belbinSums;
    }
    function ofPackage(...packages: Package[]) {
        const teams: Team[] = [];
        if (all.value) {
            packages.forEach(pack => {
                teams.push(...pack.teams.map(id => all.value.find(team => team.id == id)));
            });
        }
        return teams;
    }
    function packageProposed() {
        const originalTeams = query({state: 'proposed'});
        const packageTeams: Team[] = [];
        originalTeams.forEach(originalTeam => {
            const {id, locked, state, members, ...rest} = originalTeam;
            packageTeams.push(add({state: "packaged", members: [...members], ...rest}));
            if (settings.all.resetOnPackaging) originalTeam.members = [];
        });
        if (settings.all.resetOnPackaging) students.all.forEach(student => student.state = "unassigned");
        packages.add(packageTeams);
    }
    function nameOf(team: Team) {
        const { t } = useUtilitiesStore();
        console.log(query({state: team.state}));
        console.log(query({state: team.state}).indexOf(team));
        return team?.name || `${util.capitalizeFirstLetter(t("team"))} ${indexOf(team) + 1}`;
    }
    function indexOf(team: Team) {
        switch (team.state) {
            case "proposed":
                return query({state: "proposed"}).indexOf(team);
            case "packaged":
                return packages.all.find(pack => pack.teams.includes(team.id))?.teams.indexOf(team.id) || 0;
        }
    }
    return {
        all,
        // removeStudent,
        clearStudent,
        add,
        deleteTeam,
        query,
        bestFor,
        assignStudent,
        checkFull,
        teamOf,
        limitOf,
        evaluateBelbin,
        ofPackage,
        packageProposed,
        nameOf,
        init,
        mounted,
        indexOf
    };
});