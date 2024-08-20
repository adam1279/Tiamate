<script setup lang="ts">
import { ref, Transition, TransitionGroup } from 'vue';
export interface ITransition {
    enterFrom?: string,
    enterActive?: string,
    enterTo?: string,

    leaveFrom?: string,
    leaveActive?: string,
    leaveTo?: string
};
const props = defineProps<{
    group?: boolean,
    fade?: boolean,
    transition?: ITransition
}>();
const fade: ITransition = {
    enterFrom: "opacity-0",
    enterActive: "transition-all",
    enterTo: "opacity-100",

    leaveFrom: "opacity-100",
    leaveActive: "transition-all",
    leaveTo: "opacity-0"
};
const get = (key: keyof ITransition): string => {
    let str = '';
    if (props.fade) str += fade[key] + " ";
    if (props.transition) {
        if (props.transition[key]) str += props.transition[key] + " ";
    }
    return str;
};
</script>
<template>
    <component :is="group ? TransitionGroup : Transition"
        :enter-to-class="get('enterTo')"
        :enter-active-class="get('enterActive')"
        :enter-from-class="get('enterFrom')"
        :leave-from-class="get('leaveFrom')"
        :leave-active-class="get('leaveActive')"
        :leave-to-class="get('leaveTo')"
    >
        <slot></slot>
    </component>
    <!-- <Transition :enter-to-class="get('enterTo')" :enter-active-class="get('enterActive')" :enter-from-class="get('enterFrom')" :leave-from-class="get('leaveFrom')" :leave-active-class="get('leaveActive')" :leave-to-class="get('leaveTo')" v-else>
        <slot></slot>
    </Transition> -->
</template>