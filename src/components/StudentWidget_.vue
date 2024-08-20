<script setup lang="ts">
import { EyeIcon, GripVerticalIcon, SquareDotIcon, ViewIcon } from 'lucide-vue-next';
import { IStudent } from 'src/classes';
import TooltipItem from './TooltipItem.vue';
import IconToggle from './IconToggle.vue';
import IconButton from './IconButton.vue';

const props = defineProps<{
    student: IStudent,
    state?: "assigned" | "previewed" | "unassigned"
}>();

</script>
<template>
    <div :draggable="state != 'previewed'" :data-state="state" class=" flex p-1 bg-white rounded shadow text-gray select-none items-center border border-gray gap-1 data-[state=previewed]:shadow-none data-[state=previewed]:opacity-70 data-[state=previewed]:pointer-events-none data-[state=previewed]:bg-gray-light shrink max-w-64" data-broken="broken">
        <EyeIcon v-if="state == 'previewed'" :size="20" class=" cursor-move shrink-0" ></EyeIcon>
        <GripVerticalIcon v-else :size="20" class=" cursor-move shrink-0" ></GripVerticalIcon>
        <TooltipItem :text="student.name" class=" flex overflow-hidden" >
            <span class=" text-black text-ellipsis overflow-hidden text-nowrap">
                {{ student.name }}
            </span>
        </TooltipItem>
        <div class="grow"></div>
        <IconToggle v-if="!state || state == 'unassigned'" :current-state="(student.previewing) ? 1 : 0" :states="[
            {
                tooltip: $t('preview'),
                icon: SquareDotIcon,
                click: () => {student.previewing = true; $emit('update')}
            },
            {
                tooltip: $t('preview'),
                icon: ViewIcon,
                click: () => {student.previewing = false; $emit('update')}
            }
        ]" extend-class=" text-gray/80 stroke-2 hover:text-gray/100 shrink-0" :size="22"></IconToggle>
    </div>
</template>