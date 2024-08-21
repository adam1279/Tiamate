<script setup lang="ts">
import { EyeIcon, GripVerticalIcon, SquareDotIcon, ViewIcon, XIcon } from 'lucide-vue-next';
import TooltipItem from './TooltipItem.vue';
import IconToggle from './IconToggle.vue';
import IconButton from './IconButton.vue';
import { useStudentsStore } from '../stores/useStudents';
import { useTeamsStore } from '../stores/useTeams';
import { Student } from 'src/classes/Student';
import { useUtilitiesStore } from '../stores/useUtilities';
import { computed } from 'vue';

const props = defineProps<{
    student: Student,
    state?: "assigned" | "previewed" | "unassigned" | "packaged",
    otherStudents?: Student[]
}>();
const util = useUtilitiesStore();
const students = useStudentsStore();
const teams = useTeamsStore();
function removeFromTeam() {
    teams.clearStudent(props.student);
    props.student.state = "unassigned";
}
const previousTeamCount = computed(() => (props.otherStudents) ? students.previousTeamsInCommon(props.student, ...props.otherStudents) : 0);
</script>
<template>
    <div :draggable="state != 'previewed' && state != 'packaged'" :data-state="state" class=" flex p-1 bg-white rounded shadow text-gray select-none items-center border border-gray gap-1 data-[state=previewed]:shadow-none data-[state=packaged]:shadow-none data-[state=previewed]:bg-gray-light/80 shrink max-w-64" data-broken="broken" 
        @dragstart="util.dragStudent(student)"
        @dragend="util.dragStudentEnd"
    >
        <TooltipItem v-if="state == 'assigned'" :text="$t('move')">
            <GripVerticalIcon :size="20" class=" cursor-move shrink-0" ></GripVerticalIcon>
        </TooltipItem>
        <EyeIcon v-else :size="20" class=" shrink-0" ></EyeIcon>
        <TooltipItem :text="student.name+(otherStudents ? ` - ${previousTeamCount} ${$t('previous')} ${$t('team')+$t('connectingSpace')+$t('member', previousTeamCount > 1 ? 2 : 1)}` : '')" class=" flex overflow-hidden grow items-center gap-1" >
            <span class=" text-black text-ellipsis overflow-hidden text-nowrap grow">
                {{ student.name }}
            </span>
            <span class=" font-mono text-xs px-1" v-if="state != 'unassigned'">{{ previousTeamCount }}</span>
        </TooltipItem>
        <IconToggle v-if="!state || state == 'unassigned'"
            v-model="student.previewing"
            :states="[
                {
                    tooltip: $t('preview'),
                    icon: SquareDotIcon,
                },
                {
                    tooltip: $t('preview'),
                    icon: ViewIcon,
                }
            ]"
            extend-class=" text-gray/80 stroke-2 hover:text-gray/100 shrink-0"
            size="size-6"
        ></IconToggle>
        <!-- <TooltipItem :text="`${$t('previous')} ${$t('team')+$t('connectingSpace')+$t('member', 2)}`">
            <span class=" font-mono text-xs" v-if="state != 'unassigned'">{{ previousTeamCount }}</span>
        </TooltipItem> -->
        <IconButton v-if="state == 'assigned'" :icon="XIcon" :tooltip="$t('remove')" color="red" extend-class="text-gray stroke-2"
            @click="removeFromTeam()"
        ></IconButton>
    </div>
</template>