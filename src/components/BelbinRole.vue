<script setup lang="ts">
import { CogIcon, CrosshairIcon, HeartHandshakeIcon, LightbulbIcon, MegaphoneIcon, MicroscopeIcon, PhoneIcon, RocketIcon, ScaleIcon, SearchIcon, WrenchIcon } from "lucide-vue-next";
import TooltipItem from "./TooltipItem.vue";
import { computed } from "vue";
import { IBelbin } from "src/classes/Belbin";
const props = defineProps<{
    role: IBelbin
}>();
const BelbinIcons = {
    "Co-ordinator": MegaphoneIcon,
    "Teamworker": HeartHandshakeIcon,
    "Resource Investigator": PhoneIcon,
    "Shaper": RocketIcon,
    "Completer Finisher": WrenchIcon,
    "Specialist": CrosshairIcon,
    "Plant": LightbulbIcon,
    "Monitor Evaluator": MicroscopeIcon,
    "Implementer": CogIcon
};
function getPerc(num: number) {
    return Math.round(num*10)*10;
}
const color = computed(() => {
    if (props.role.percentage <= 0.3) return "red";
    if (props.role.percentage <= 0.6) return "yellow";
    return "green";
})
</script>
<template>
    <TooltipItem :text="`${$t(role.role)} ${Math.round(role.percentage*100)}%`" :class="`flex bg-gradient-to-t from-${color}-700/20 to-${getPerc(role.percentage)}% to-gray-light from-${getPerc(role.percentage)}% w-fit rounded-lg text-${color}-700 items-center p-1`">
        <component :is="BelbinIcons[role.role]" :size="18"></component>
    </TooltipItem>
</template>