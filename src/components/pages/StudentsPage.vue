<script setup lang="ts">
import { IPage } from 'src/classes';
import { useStudentsStore } from '../../stores/useStudents';
import Page from '../Page.vue';
import { BarChart3Icon, FileSpreadsheetIcon, GraduationCapIcon, HistoryIcon, ImportIcon, PlusCircleIcon, PlusIcon, TrashIcon } from 'lucide-vue-next';
import IconButton from '../IconButton.vue';
import Widget from '../Widget.vue';
import StudentTr from '../StudentTr.vue';
import { computed, ref } from 'vue';
import { useSettingsStore } from '../../stores/useSettings';
import PageSection from '../PageSection.vue';
import TeamWidget from '../TeamWidget.vue';
import { useTeamsStore } from '../../stores/useTeams';
const props = defineProps<{
    page: IPage,
    currentPage: string
}>();
const students = useStudentsStore();
const settings = useSettingsStore();
const teams = useTeamsStore();
async function importTemplate() {
    students.add(...await window.electron.importTemplate(settings.all.language));
}
function downloadTemplate() {
    window.electron.downloadTemplate();
}
const editingOrAdding = computed(() => {
    return (students.query({adding: true}, {editing: true}).length > 0);
});
const selectedStudents = computed(() => students.query({selected: true}));
const currentTab = ref("members");
const addStudentRow = ref<HTMLDivElement>(null);
function addStudent() {
    students.add({adding: true});
    // console.log(studentsSection.value.scrollHeight);
    // studentsSection.value.scrollTop = studentsSection.value.scrollHeight;
    addStudentRow.value.scrollIntoView();
}
</script>
<template>
    <Page :page="page" :current-page="currentPage" class=" overflow-hidden">
        <PageSection :icon="GraduationCapIcon" :title="$t('student', 2)" class=" overflow-hidden">
            <template #options>
                <IconButton v-if="selectedStudents.length > 0" :icon="TrashIcon" :tooltip="`${$t('delete')} ${$t('selected', 2)}`" :bubble="selectedStudents.length.toString()" bubble-background="gray-light" @click="students.deleteStudent(...selectedStudents)"></IconButton>
                <IconButton
                    :icon="PlusCircleIcon"
                    :tooltip="`${$t('add')} ${$t('student')}`"
                    @click="addStudent"
                ></IconButton>
                <IconButton :icon="ImportIcon" :tooltip="`${$t('import')} ${$t('filled-out')} ${$t('spreadsheet template')}`" @click="importTemplate"></IconButton>
                <IconButton :icon="FileSpreadsheetIcon" :tooltip="`Download ${$t('spreadsheet template')}`" @click="downloadTemplate"></IconButton>
            </template>
            <div class="flex flex-col grow overflow-y-auto" ref="studentsSection">
                <Widget class="flex grow">
                    <table class=" w-full">
                        <tr>
                            <th>{{ $t("name") }}</th>
                            <th>{{ $t("gender") }}</th>
                            <th>{{ $t("belbin_role", 2) }}</th>
                            <th>{{ $t("previous") }} {{$t("team", 2) }}</th>
                        </tr>
                        <TransitionGroup>
                            <StudentTr v-for="student of students.all"
                                :student="student"
                                @delete="() => students.deleteStudent(student)"
                                :key="student.id">
                            </StudentTr>
                        </TransitionGroup>
                        <tr>
                            <td class="" colspan="5">
                                <div :data-disabled="editingOrAdding" class="flex justify-center p-1 text-gray-dark hover:bg-gray/10 transition-colors rounded-md mx-auto px-10 w-fit cursor-pointer data-[disabled=true]:pointer-events-none data-[disabled=true]:text-gray/50 border border-gray shadow-sm items-center text-sm" @click="addStudent" ref="addStudentRow">
                                    <PlusIcon class="" :size="20"></PlusIcon>
                                    <span class=" first-letter:uppercase inline-block">{{ $t("add") }} {{ $t("student") }}</span>
                                </div>
                            </td>
                        </tr>
                    </table>
                </Widget>
            </div>
        </PageSection>
        <PageSection :icon="HistoryIcon" :title="`${$t('previous', 2)} ${$t('team', 2)}`" closed>
            <div>
                <TeamWidget
                    v-for="(previousTeam, index) of teams.query({state: 'previous'})"
                    :team="previousTeam"
                    :current-tab="currentTab"
                    :index="index"
                ></TeamWidget>
            </div>
        </PageSection>
        <PageSection :icon="BarChart3Icon" :title="$t('analysis')" closed>

        </PageSection>
    </Page>
</template>