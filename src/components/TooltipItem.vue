<script setup lang="ts">
import { useUtilitiesStore } from '../stores/useUtilities';

const props = defineProps<{
    text: string,
    // wrapper?: Object,
    svg?: boolean
}>();
const util = useUtilitiesStore();
function updateTooltip(clear?: boolean) {
    // if (clear) window.electron.updateTooltip("");
    // else window.electron.updateTooltip(props.text);
    if (clear) util.tooltip = "";
    else util.tooltip = props.text;
}
</script>
<template>
    <!-- <component v-if="(wrapper)" :is="wrapper" @mouseenter="e => updateTooltip()" @mouseleave="e => updateTooltip(true)">
        <slot></slot>
    </component> -->
    <g v-bind="$attrs" v-if="svg" @mouseenter="e => updateTooltip()" @mouseleave="e => updateTooltip(true)">
        <slot></slot>
    </g>
    <div v-bind="$attrs" v-else @mouseenter="e => updateTooltip()" @mouseleave="e => updateTooltip(true)">
        <slot></slot>
    </div>
    <!-- <slot @mouseenter="e => updateTooltip()" @mouseleave="e => updateTooltip(true)"></slot> -->
</template>