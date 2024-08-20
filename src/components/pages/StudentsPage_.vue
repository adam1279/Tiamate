<script setup lang="ts">
import { IPage, IStudent } from "src/classes";
import BelbinRole from "../BelbinRole.vue";
import OptionsItem from "../OptionsItem.vue";
// import { Student } from "src/classes2";
import Page from "../Page.vue";
import IconButton from "../IconButton.vue";
import { Import, FileSpreadsheetIcon, DownloadIcon, UserIcon, CircleUserIcon, EllipsisVerticalIcon, TrashIcon, EditIcon, icons, PlusIcon, CircleCheckIcon, CircleXIcon } from "lucide-vue-next";
import { computed, onMounted, ref } from "vue";
import Widget from "../Widget.vue";
import OptionsButton from "../OptionsButton.vue";
import StudentTr from "../StudentTr.vue";
import TableHead from "../TableHead.vue";
const props = defineProps<{
    page: IPage,
    currentPage: string
}>();
const students = ref<IStudent[]>([]);
onMounted(async () => {
    students.value = (await window.electron.data.get()).students;
});
window.electron.data.onUpdate((data, changedKey) => {
    students.value = data.students;
});


// let id = students.value.length;
const sortedStudents = computed(() => {
    students.value.forEach((student) => {
        student.roles.sort((a,b) => b.percentage - a.percentage);
    });
    return students.value;
});
const editingStudent = computed(() => {
    return students.value.some((s) => s.editing || s.adding);
});
function addStudent() {
    // addingStudent.value = true;
    // students.value.push({
    //     name: "",
    //     roles: [],
    //     previousTeams: [],
    //     adding: true,
    //     id: id
    // });
    // id++;
    window.electron.data.new("students");
}
function update() {
    // console.log(newStudent);
    // let index = sortedStudents.value.indexOf(oldStudent);
    // students.value[index] = newStudent;
    window.electron.data.set("students", JSON.stringify(students.value));
}
function deleteStudent(student: IStudent) {
    let index = sortedStudents.value.indexOf(student);
    students.value.splice(index, 1);
    update();
}
function downloadTemplate() {
    window.electron.downloadTemplate();
}
async function importTemplate() {
    console.log(await window.electron.importTemplate());
}
</script>
<template>
    <Page :page="page" :current-page="currentPage">
        <template #options>
            <IconButton :icon="Import" :tooltip="`${$t('import')} ${$t('filled-out')} ${$t('spreadsheet template')}`" @click="importTemplate"></IconButton>
            <IconButton :icon="FileSpreadsheetIcon" :tooltip="`Download ${$t('spreadsheet template')}`" @click="downloadTemplate"></IconButton>
        </template>
        <div class=" p-3 overflow-y-auto">
            <Widget>
                <table class="table-auto w-full">
                    <!-- <colgroup>
                        <col span="1" class=" w-1">
                    </colgroup> -->
                    <tr>
                        <th>{{ $t("name") }}</th>
                        <th>{{ $t("belbin_role", 2) }}</th>
                        <th>{{ $t("previous") }} {{$t("team", 2) }}</th>
                    </tr>
                    <!-- <TableHead sort-by="name" :cols="[
                            {
                                title: `${$t('Name')}`,
                                id: 'name'
                            },
                            {
                                title: `${$t('Belbin roles')}`,
                                id: 'roles'
                            },
                            {
                                title: `${$t('Previous')} ${$t('teams')}`,
                                id: 'previousTeams'
                            }
                        ]"></TableHead> -->
                    <TransitionGroup>
                        <StudentTr v-for="student of sortedStudents" :student="student" @update="newStudent => update()" @delete="() => deleteStudent(student)" :key="student.id"></StudentTr>
                    </TransitionGroup>
                    <!-- <Transition enter-active-class="transition ease-out duration-100" enter-from-class="transform opacity-0 scale-95" enter-to-class="transform opacity-100 scale-100">
                        
                    </Transition> -->
                    <tr>
                        <td class="" colspan="4">
                            <div :data-disabled="editingStudent" class="flex justify-center p-1 text-gray-dark hover:bg-gray/10 transition-colors rounded-md mx-auto px-10 w-fit cursor-pointer data-[disabled=true]:pointer-events-none data-[disabled=true]:text-gray/50 border border-gray shadow-sm items-center text-sm" @click="addStudent">
                                <PlusIcon class="" :size="20"></PlusIcon>
                                <span class=" first-letter:uppercase inline-block">{{ $t("add") }} {{ $t("student") }}</span>
                            </div>
                        </td>
                    </tr>
                </table>
            </Widget>
            <!-- <ul>
                <TransitionGroup name="students">
                    <li v-for="student of sortedStudents">{{ student.name }}</li>
                </TransitionGroup>
            </ul> -->
            <!-- <button @click="">
                Add
            </button> -->
        </div>
        
    </Page>
</template>
<style scoped>
.students-move,
.students-enter-active,
.students-leave-active {
  transition: all 0.5s ease;
}
.students-enter-from,
.students-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
.students-leave-active {
  position: absolute;
}
</style>