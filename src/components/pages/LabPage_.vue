<script setup lang="ts">
import { Data, IStudent, ITeam, IPage as _Page } from "src/classes";
import Page from "../Page.vue";
import IconButton from "../IconButton.vue";
import { BotIcon, BotOffIcon, BrainCogIcon, FlaskConicalIcon, GraduationCapIcon, GripVerticalIcon, Import, Link2Icon, Link2OffIcon, PackageIcon, PackagePlusIcon, PlusCircleIcon, PlusIcon, RotateCwIcon, SettingsIcon, SquareDotIcon, UsersIcon, ViewIcon } from "lucide-vue-next";
import PageSection from "../PageSection.vue";
import Widget from "../Widget.vue";
import BelbinCompass from "../BelbinCompass.vue";
import { computed, onMounted, ref } from "vue";
import TooltipItem from "../TooltipItem.vue";
import computedStyleToInlineStyle from "computed-style-to-inline-style";
import TeamWidget from "../TeamWidget.vue";
import IconToggle from "../IconToggle.vue";
import StudentWidget from "../StudentWidget.vue";
import TransitionTemplate from "../TransitionTemplate.vue";
import OptionsDropdown from "../OptionsDropdown.vue";
const props = defineProps<{
    page: _Page,
    currentPage: string
}>();
const root = ref<HTMLDivElement | null>(null);
const data = ref<Data>();
const unassignedStudents = computed(() => {
    return data.value ? data.value.students.filter(student => student.currentTeam == undefined) : [];
});
const students = computed(() => {
    return data.value ? data.value.students : [];
});
const teams = computed(() => {
    return data.value ? data.value.teams : [];
});
const previewedStudents = computed(() => {
    return data.value ? data.value.students.filter(student => student.previewing) : [];
})
onMounted(async () => {
    data.value = (await window.electron.data.get());
    console.log(data.value);
});
window.electron.data.onUpdate((_data) => {
    data.value = _data;
    console.log(data.value);
});
function teamStudents(team: ITeam): IStudent[] {
    // return data.value.students.filter((student) => team.members.includes(student.id));
    return team.members.map(id => data.value.students.find(student => student.id == id));
}
function updateStudents() {
    // console.log(students.value);
    window.electron.data.set("students", JSON.stringify(students.value));
}
function updateTeams() {
    window.electron.data.set("teams", JSON.stringify(teams.value));
}
function newTeam() {
    window.electron.data.new("teams");
}
function print() {
    const clone = root.value.cloneNode(true) as HTMLDivElement;
    computedStyleToInlineStyle(clone, {
        recursive: true
    });
    console.log(clone);
    // window.electron.printToPDF();
}
function deleteTeam(team: ITeam) {
    // const _team = data.value.proposedTeams.filter((t, i) => t.id == team.id)[0];
    const index = data.value.teams.indexOf(team)
    data.value.teams.splice(index, 1);
    updateTeams();
}
const currentTab = ref('members');
const tabsLinked = ref(true);
const draggedStudent = ref<IStudent>();
const dragStudent = (student: IStudent) => {
    console.log(student);
    draggedStudent.value = student;
    draggedStudent.value.previewing = false;
    console.log(data.value);
    // data.value.proposedTeams.forEach(t => {console.log(t); t.removeMember(draggedStudent.value.id)});
    updateStudents();
    updateTeams();
};
const dropStudent = (team: ITeam) => {
    // draggedStudent.value.currentTeam = team.id;
    // team.members.push(draggedStudent.value.id);
    // updateStudents();
    // updateTeams();
    window.electron.data.assign("students", draggedStudent.value.id, team.id);
}
const dropStudentBack = () => {
    window.electron.data.assign("students", draggedStudent.value.id);
}
function reload() {
    data.value.students.forEach(student => window.electron.data.assign("students", student.id));
}
function packageTeams() {
    
}
</script>
<template>
    <Page :page="page" :current-page="currentPage">
        <!-- Options -->
        <template #options>
        </template>

        <!-- Students -->
        <PageSection :icon="GraduationCapIcon" :title="$t('student', 2)" class=" max-h-[25%]" custom>
            <template #options>
                <IconButton :icon="RotateCwIcon" :tooltip="`${$t('reload')} ${$t('student', 2)}`" @click="reload"></IconButton>
            </template>
            <div class=" flex grow flex-wrap gap-1 overflow-y-auto select-none drag-none snap-y snap-mandatory" @dragover="e => e.preventDefault()" @drop="dropStudentBack">
                <TransitionTemplate fade group>
                    <StudentWidget class=" snap-start snap-always" v-for="student of unassignedStudents" :student="student" @update="updateStudents" @dragstart="dragStudent(student)"></StudentWidget>
                </TransitionTemplate>
            </div>
        </PageSection>

        <!-- Teams -->
        <PageSection :icon="UsersIcon" :title="$t('team', 2)" class=" overflow-y-hidden">
            <template #options>
                <IconButton :icon="PackagePlusIcon" :tooltip="`${$t('package_2')} ${$t('team', 2)}`"></IconButton>
                <IconToggle :current-state="0" :states="[
                    {
                        icon: Link2Icon,
                        tooltip: `${$t('unlink')} ${$t('tab', 2)}`,
                        value: true
                    },
                    {
                        icon: Link2OffIcon,
                        tooltip: `${$t('link_2')} ${$t('tab', 2)}`,
                        value: false
                    }
                ]" @update="state => tabsLinked = state"></IconToggle>
                <IconButton :icon="PlusCircleIcon" :tooltip="`${$t('new')} ${$t('team')}`" @click="newTeam" ></IconButton>
                <OptionsDropdown :options="[
                    {
                        icon: Link2Icon,
                        text: `${$t('unlink')} ${$t('tab', 2)}`,
                        click: () => {}
                    }
                ]">
                    <IconButton :icon="SettingsIcon" :tooltip="$t('setting', 2)"></IconButton>
                </OptionsDropdown>
            </template>
            <!-- <TransitionGroup leave-from-class="opacity-100" leave-to-class="opacity-0" leave-active-class="transition-all" enter-to-class="opacity-100" enter-from-class="opacity-0" enter-active-class="transition-all">
                <TeamWidget :index="index" :team="team" :assigned-students="teamStudents(team)" :previewed-students="previewedStudents" v-for="(team, index) of teams" :key="team.id" :current-tab="(tabsLinked) ?currentTab : undefined" @tab-change="tab => currentTab = tab" @delete="deleteTeams(team)">
                    
                </TeamWidget>
            </TransitionGroup> -->
            <div class=" min-h-72 flex-wrap flex flex-row gap-3">
                <TransitionTemplate group fade>
                    <TeamWidget :index="index" :team="team" :assigned-students="teamStudents(team)" :previewed-students="previewedStudents" v-for="(team, index) of teams" :key="team.id" :current-tab="(tabsLinked) ?currentTab : undefined" @tab-change="tab => currentTab = tab" @delete="deleteTeam(team)" @drop="dropStudent(team)" @dragover="e => e.preventDefault()" @student-drag-start="dragStudent">
                        
                    </TeamWidget>
                </TransitionTemplate>
            </div>
        </PageSection>


        <PageSection :icon="BotIcon" :title="`${$t('automatic')} ${$t('team creation')}`"></PageSection>

        <!-- <button @click="print">PRINT</button> -->
    </Page>
</template>