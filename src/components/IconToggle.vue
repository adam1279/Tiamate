<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import IconButton from './IconButton.vue';
import { useUtilitiesStore } from '../stores/useUtilities';
import { LucideIcon, SquareIcon } from 'lucide-vue-next';
export interface State {
    icon?: LucideIcon,
    click?: Function,
    tooltip?: string
    value?: any
}
const props = defineProps<{
    states: [State, State],
    currentState?: boolean,
    extendClass?: string,
    size?: string
}>();
const util = useUtilitiesStore();
const emit = defineEmits(['update']);
const currentStateLocal = defineModel<boolean>();
// const currentStateLocal = ref(false);
// onMounted(() => {
//     currentStateLocal.value = props.currentState;
// });
// watch(() => props.currentState, (n, o) => {
//     currentStateLocal.value = props.currentState;
// });
function performAction() {
    if (props.states[currentStateLocal.value ? 1 : 0].click) props.states[currentStateLocal.value ? 1 : 0].click();
    currentStateLocal.value = !currentStateLocal.value;
    if (props.states[currentStateLocal.value ? 1 : 0].value != undefined) emit('update', props.states[currentStateLocal.value ? 1 : 0].value);
}
</script>
<template>
    <IconButton :size="size" :icon="states[currentStateLocal ? 1 : 0].icon || SquareIcon" :tooltip="states[currentStateLocal ? 1 : 0].tooltip || ''" @click="performAction" :extend-class="extendClass"></IconButton>
</template>