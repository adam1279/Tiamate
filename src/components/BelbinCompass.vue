<script setup lang="ts">
import TooltipItem from './TooltipItem.vue';
import { CircleAlertIcon, CogIcon, CrosshairIcon, HeartHandshakeIcon, LightbulbIcon, MegaphoneIcon, MicroscopeIcon, PhoneIcon, RocketIcon, WrenchIcon } from 'lucide-vue-next';
import { computed, markRaw, ref } from 'vue';
import TransitionTemplate from './TransitionTemplate.vue';
import { Student } from 'src/classes/Student';
import { Belbin } from '../classes/Belbin';
import { useUtilitiesStore } from '../stores/useUtilities';

const props = defineProps<{
    students?: Student[],
    previewedStudents?: Student[]
    diameter: number,
    includeIcons?: boolean,
    teamId?: string
}>();
const _3rd = 30;
const _half = 45;
const util = useUtilitiesStore();
// const { t } = util;
// const belbinLib = new Map<Belbin.Role, {angle: number, icon: Object, add?: number}>([
//     ["Resource Investigator", {
//         angle: _3rd,
//         icon: PhoneIcon,
//         add: -_3rd
//     }],
//     ["Teamworker", {
//         angle: 2*_3rd,
//         icon: HeartHandshakeIcon,
//         add: -_3rd
//     }],
//     ["Co-ordinator", {
//         angle: 3*_3rd,
//         icon: MegaphoneIcon,
//         add: -_3rd
//     }],
//     ["Implementer", {
//         angle: 90+_half,
//         icon: CogIcon,
//         add: -_half
//     }],
//     ["Monitor Evaluator", {
//         angle: 180,
//         icon: MicroscopeIcon,
//         add: -_half
//     }],
//     ["Plant", {
//         angle: 180+_3rd,
//         icon: LightbulbIcon,
//         add: -_3rd
//     }],
//     ["Specialist", {
//         angle: 180+2*_3rd,
//         icon: CrosshairIcon,
//         add: -_3rd
//     }],
//     ["Completer Finisher", {
//         angle: 180+3*_3rd,
//         icon: WrenchIcon,
//         add: -_3rd
//     }],
//     ["Shaper", {
//         angle: 360,
//         icon: RocketIcon,
//         add: -90
//     }]
// ]);
// function toCoordinates(_angle: number, percentage?: number): [
//     number,
//     number
// ] {
//     const initAngle = 180 - _angle + 180;
//     const angle = initAngle*Math.PI/180;
//     // console.log(initAngle);
//     let mult = (percentage != undefined) ? percentage : 1;
//     let cxRel = Math.cos(angle)*mult*40+50;
//     let cyRel = Math.sin(angle)*mult*40+50;
//     // console.log(cxRel, cyRel);
//     return [cxRel, cyRel];
// }
function toCoordinates(_angle: number, add: number, percentage?: number, points?: Belbin[], role?: Belbin): [
    number,
    number
] {
    const addDiv = (points) ? 1 + points.length : 2;
    const addMult = (points) ? 1 + points.indexOf(role) : 1;
    let initAngle = 180 - _angle - (add / addDiv) * addMult + 180;
    const angle = initAngle*Math.PI/180;
    // console.log(initAngle);
    let mult = (percentage != undefined) ? percentage * (props.includeIcons ? 0.70 : 0.87) : 0.87;
    let cxRel = Math.cos(angle)*mult*50;
    let cyRel = Math.sin(angle)*mult*50;
    // console.log(cxRel, cyRel);
    return [cxRel, cyRel];
}
function toCoordinatesRole(role: Belbin): [
    number,
    number
] {
    // console.log(points.value);
    const p = round(role.percentage * 100, 20, 0).toString() + "%";
    return toCoordinates(Belbin.data[role.role].angle as number, Belbin.data[role.role].add, role.percentage, points.value[role.role][p], role);
}
const allStudents = computed(() => props.students.concat(props.previewedStudents));
const points = computed(() => {
    let obj: {
        [k:string]: {
            [k:string]: Belbin[]
        }
    } = {};
    for (let key of Object.keys(Belbin.data)) {
        Object.defineProperty(obj, key, {
            value: {},
            writable: true
        });
    }
    allStudents.value.forEach(({roles}) => {
        roles.forEach((role) => {
            const p = round(role.percentage * 100, 20, 0).toString() + "%";
            if (obj[role.role][p] == undefined) {
                obj[role.role][p] = [];
            }
            obj[role.role][p].push(role);
        })
    });
    return obj;
});
function round(number: number, increment: number, offset: number) {
    return Math.ceil((number - offset) / increment ) * increment + offset;
}
const topStudent = ref<Student>(null);
</script>
<template>
    <svg :data-icons="includeIcons" :height="diameter" :width="diameter" viewBox="-50 -50 100 100" class=" data-[icons=true]:p-1 rounded-full data-[icons=true]:border data-[icons=true]:border-gray">
        <image :x="includeIcons ? -40 : -50" :y="includeIcons ? -40: -50" :height="includeIcons ? 80 : 100" href="../imgs/Belbin.svg"/>
        <!-- <circle r="61%" class=" fill-none stroke-gray-light"></circle> -->
        <g v-if="includeIcons" v-for="[title, belbin] of Object.entries(Belbin.data)" :style="`transform: translate(${toCoordinates(belbin.angle, belbin.add)[0]-5}px, ${toCoordinates(belbin.angle, belbin.add)[1]-5}px)`" class=" z-20">
            <component :is="belbin.icon" class=" text-gray" :size="10" :stroke-width="1"></component>
        </g>
        <TransitionGroup leave-from-class="opacity-100 scale-100" leave-to-class="opacity-0 scale-125" leave-active-class="transition-all" enter-to-class="opacity-100 scale-100" enter-from-class="opacity-0 scale-0" enter-active-class="transition-all" >
            <g v-for="student of allStudents" class=" group" :key="student.id" :id="'id' + ((teamId) ? teamId : '') + student.id" @mouseover="topStudent = student" @mouseleave="topStudent = null" :data-hover="topStudent == student">
                <TooltipItem v-for="role of student.roles" :text="`${student.name} - ${$t(role.role)} ${Math.round(role.percentage * 100)}%`" svg>
                    <circle :data-preview="previewedStudents.includes(student)" :cx="toCoordinatesRole(role)[0] + ''" :cy="toCoordinatesRole(role)[1] + ''" r="4%" class=" hover:stroke-[2%] group-hover:stroke-white z-10 stroke-[0.7%] group-hover:z-30 fill-gray-dark stroke-gray-dark data-[preview=true]:fill-gray-dark/50 transition-all data-[nohover=true]:pointer-events-none" :data-nohover="topStudent != student && topStudent != null"/>
                </TooltipItem>
            </g>
        </TransitionGroup>
        <!-- <g>
            <use v-for="role of topStudent.roles" :href="'#id' + topStudent.id + role.role" fill-opacity="0" class=" pointer-events-none"></use>
        </g> -->
        <TransitionTemplate fade>
            <use v-show="topStudent" :href="'#id' + ((teamId) ? teamId : '') + topStudent?.id" class=" pointer-events-none"></use>
        </TransitionTemplate>
    </svg>
    <!-- <span v-for="previewedStudent of previewedStudents">{{ previewedStudent.name }}</span> -->
</template> 