import { defineStore } from "pinia";
import { computed, onMounted, ref, watch } from "vue";
import { useTeamsStore } from "./useTeams";
import { useUtilitiesStore } from "./useUtilities";
import { useI18n } from "vue-i18n";
import { IStudent, Student } from "../classes/Student";
import { Team } from "../classes/Team";

export const useStudentsStore = defineStore("students", () => {
    // const { t } = useI18n();
    const all = ref<Student[]>();
    const teams = useTeamsStore();
    const util = useUtilitiesStore();
    onMounted(async () => {
        all.value = (await window.electron.data.get()).students.map(student => new Student(student));
    });
    function get(...ids: string[]) {
        let students: Student[] = [];
        ids.forEach(id => {
            const student = all.value.find(student => student.id == id);
            if (student) students.push(student);
        });
        return students;
    }
    // function query(...queryInfos: Partial<IStudent>[]) {
    //     const _query: Student[] = queryInfos.reduce((pile, queryInfo) => pile = pile.concat(all.value?.filter(student => util.objectMatch(queryInfo, student))), []);
    //     return all.value ? _query : [];
    // }
    function query(...queryInfos: Partial<IStudent>[]): Student[] {
        return util.query(all.value, ...queryInfos);
    }
    function add(...students: Partial<Student>[]) {
        if (students.length > 0) all.value.push(...students.map(student => new Student(student)));
        else all.value.push(new Student);
    }
    function deleteStudent(...students: Student[]) {
        // students.forEach(student => {
        //     console.log(student);
        //     const index = all.value.indexOf(student);
        //     console.log(index);
        //     if (index <= 0) {
        //         all.value.splice(index, 1);
        //         teams.clearStudent(student);
        //     }
        // });
        students.forEach(student => teams.clearStudent(student));
        util.removeArrayItem(all.value, ...students);
    }
    function ofTeam(...teams: Team[]) {
        const students: Student[] = [];
        if (all.value) {
            teams.forEach(team => {
                students.push(...team.members.map(id => all.value.find(student => student.id == id)));
            });
        }
        return students;
    }
    function unassign(...students: Student[]) {
        students.forEach(student => {
            student.state = "unassigned";
            teams.clearStudent(student);
        });
    }
    function previousTeamsInCommon(subject: Student, ...students: Student[]) {
        let _previousTeamsInCommon = 0;
        subject.previousTeams.forEach(previousTeam => {
            _previousTeamsInCommon += students.filter(student => {
                if (subject == student) return false;
                return student.previousTeams.includes(previousTeam)
            }).length;
        });
        return _previousTeamsInCommon;
    }
    // const previewing = computed(() => {
    //     return all.value ? all.value.filter(student => student.previewing) : [];
    // });
    // const sorted = computed(() => {
    //     return 
    // });
    return {
        all,
        get,
        add,
        deleteStudent,
        ofTeam,
        // previewing,
        query,
        unassign,
        previousTeamsInCommon
    };
});