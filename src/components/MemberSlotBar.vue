<script setup lang="ts">
import { Student } from '../classes/Student';
import { useUtilitiesStore } from '../stores/useUtilities';
import { computed } from 'vue';
const util = useUtilitiesStore();
const props = defineProps<{
    members: Student[],
    limit: number
}>();
interface Slot {
    member?: Student
}
const orderedMembers = computed(() => {
    const groupedByGender = util.groupBy(props.members.slice(0, props.limit), member => member?.gender);
    let _orderedMembers: Student[] = [];
    Object.values(groupedByGender).forEach(members => {
        _orderedMembers.push(...members.sort((a) => a.previewing ? 1 : -1));
    });
    return _orderedMembers;
})
const slots = computed(() => {
    let _slots: Slot[] = [];
    for (let i = 0; i < props.limit; i++) {
        // _slots.push({member: props.members.sort((a, b) => (a.gender > b.gender ? 1 : -1))[i]});
        // _slots.push({member: props.members[i]})
        _slots.push({member: orderedMembers.value[i]})
    }
    return _slots;
});
</script>
<template>
    <div class="flex h-1 gap-1">
        <div v-for="slot of slots"
            class=" h-full bg-gray-light grow rounded-full overflow-hidden"
        >
            <div class="h-full w-0 data-[active=true]:w-full transition-all bg-[var(--color)] data-[previewing=true]:opacity-50"
                :style="`--color: ${util.genderToColor(slot.member?.gender || '')}`"
                :data-active="!!slot.member"
                :data-previewing="slot.member?.previewing"
            ></div>
        </div>
    </div>
</template>