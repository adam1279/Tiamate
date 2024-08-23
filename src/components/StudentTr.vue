<script setup lang="ts">
import { EditIcon, TrashIcon, CircleXIcon, CircleCheckIcon, CircleUserIcon, EllipsisVerticalIcon, ChevronDown, SquareUserIcon, SquareIcon, SquareCheckBigIcon, SquareCheckIcon } from 'lucide-vue-next';
import { computed, ref } from 'vue';
import OptionsButton from './OptionsButton.vue';
import OptionsItem from './OptionsItem.vue';
import IconButton from './IconButton.vue';
import BelbinRole from './BelbinRole.vue';
import OptionsDropdown from './OptionsDropdown.vue';
import { useUtilitiesStore } from '../stores/useUtilities';
import IconToggle from './IconToggle.vue';
import { Student } from 'src/classes/Student';
const props = defineProps<{
    student: Student
}>();
const util = useUtilitiesStore();
const { t } = util;
const emit = defineEmits(["update", "delete"]);
// const _student = ref(props.student);
const localName = ref(props.student.name);
const localGender = ref(props.student.gender);
function confirm() {
    // console.log(_student.value);
    props.student.editing = false;
    props.student.adding = false;
    props.student.name = localName.value;
    props.student.gender = localGender.value;
    emit("update");
    // emit("update", _student.value);
}
function cancel() {
    if (props.student.adding) emit("delete");
    else {
        // _student.value = props.student;
        props.student.editing = false;
        // emit("update", _student.value);
    }
    emit("update");
}
function edit() {
    localName.value = props.student.name;
    localGender.value = props.student.gender;
    props.student.editing = true;
    emit("update");
}
const editingOrAdding = computed(() => props.student.editing || props.student.adding);
</script>
<template>
    <tr class="group ">
        <td class=" align-top">
            <div class=" flex gap-1">
                <!-- <CircleUserIcon class=" text-gray" :stroke-width="1" ></CircleUserIcon> -->
                <!-- <CircleUserIcon class=" text-gray shrink-0 stroke-1" ></CircleUserIcon> -->
                <div class="flex">
                    <CircleUserIcon v-if="!student.selected"
                        :data-editing="!!student.editing" class=" data-[editing=false]:group-hover:hidden text-gray shrink-0 stroke-1" ></CircleUserIcon>
                    <IconToggle
                        extend-class="text-gray shrink-0 stroke-1"
                        size="size-6"
                        :data-editing="!!student.editing"
                        :data-selected="student.selected" class=" data-[selected=false]:hidden data-[editing=false]:group-hover:flex"
                        v-model="student.selected"
                        :states="[{
                            icon: SquareIcon,
                            tooltip: 'select'
                        }, {
                            icon: SquareCheckBigIcon,
                            tooltip: 'select'
                        }]"
                    ></IconToggle>
                </div>
                <input v-if="props.student.editing || props.student.adding" :placeholder="`${t('Name')}...`" class="outline-none w-full standard" v-model="localName">
                <span v-else class="border-b border-b-transparent">{{ props.student.name }}</span>
                
            </div>
        </td>
        <td>
            <OptionsDropdown
                :options="Object.entries(util.genderColor).map(([gender, color]) => {
                    return {
                        text: t(gender),
                        click: () => {localGender = gender}
                    }
                })"
                :data-editing="editingOrAdding"
                class=" data-[editing=false]:pointer-events-none w-fit"
                v-if="editingOrAdding"
                :style="`--color: ${util.genderToColor(localGender)}`"
            >
                <div
                    class="flex rounded cursor-pointer overflow-hidden"
                >
                    <div v-if="editingOrAdding" class="bg-[var(--color)] opacity-10 absolute w-full h-full rounded"></div>
                    <div class=" w-full pl-1 text-[color:var(--color)] flex ">
                        <span v-if="editingOrAdding" class="first-letter:uppercase">{{ localGender ? t(localGender) : "-" }}</span>
                        <ChevronDown v-if="editingOrAdding" class="stroke-1"></ChevronDown>
                    </div>

                </div>
            </OptionsDropdown>
            <div v-else class="flex">
                <span :style="`--color: ${util.genderToColor(student.gender)}`" class="first-letter:uppercase text-[color:var(--color)]">{{ student.gender ? t(student.gender) : "-" }}</span>

            </div>

        </td>
        <td class=" text-xs align-top">
            <div class="flex gap-1 flex-wrap">
                <BelbinRole v-for="role of student.roles" :role="role"></BelbinRole>
            </div>
        </td>
        <td>
            <!-- {{ student.previousTeams }} -->
            <div class="flex gap-1">
                <div v-for="previousTeam of student.previousTeams"
                    class=" bg-gray-light px-1 rounded"
                >
                    {{ previousTeam }}
                </div>
            </div>
        </td>
        <td class=" flex flex-row justify-end">
            <div v-if="editingOrAdding" class="flex justify-end gap-1">
                <IconButton :icon="CircleXIcon" tooltip="Cancel" color="red" @click="cancel"></IconButton>
                <IconButton :icon="CircleCheckIcon" tooltip="Confirm" color="green" @click="confirm"></IconButton>
            </div>
            <!-- <OptionsButton v-else>
                <OptionsItem :icon="EditIcon" @click="edit">{{ t("Edit") }}</OptionsItem>
                <OptionsItem :icon="TrashIcon" red @click="$emit('delete')">
                    {{ t("Delete") }}
                </OptionsItem>
            </OptionsButton> -->
            <OptionsDropdown v-else :options="[
                {
                    text: t('edit'),
                    icon: EditIcon,
                    click: () => {edit()}
                },
                {
                    text: t('delete'),
                    icon: TrashIcon,
                    click: () => $emit('delete'),
                    red: true
                }
            ]">
                <IconButton :icon="EllipsisVerticalIcon" :tooltip="t('option', 2)"></IconButton>
            </OptionsDropdown>
        </td>
    </tr>
</template>