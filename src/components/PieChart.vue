<script setup lang="ts">
import { CircleIcon, SquareIcon } from 'lucide-vue-next';
import TransitionTemplate from './TransitionTemplate.vue';
import { computed, reactive, ref, watch } from 'vue';
import gsap from 'gsap';
interface Section {
    color: string,
    percentage: number,
    title: string
}
const props = defineProps<{
    sections: Section[]
}>();
const diameter = ref(400);
function toCoordinates(index: number) {
    console.log(tweeneds);
    // const percentage = props.sections.slice(0, index + 1).reduce((p, c) => p += tweeneds[c.title], 0);
    const percentage = props.sections.slice(0, index + 1).reduce((p, c) => p += c.percentage, 0);
    const degree = 360 * percentage - 90;
    const x = Math.cos((Math.PI/180)*degree) * (diameter.value/2-5);
    const y = Math.sin((Math.PI/180)*degree) * (diameter.value/2-5);
    return {
        x,
        y,
        str: `${x} ${y}`
    };
}
const tweeneds = reactive<{
    [k:string]: number
}>({});
// watch(() => props.sections, () => {
//     const obj: {[k:string]: number} = {
//         duration: 0.5
//     };
//     props.sections.forEach(section => obj[section.title] = section.percentage || 0);
//     gsap.to(tweeneds, obj)
// });
// const number = ref(0)
// const tweened = reactive({
//   number: 0
// })

// watch(number, (n) => {
//   gsap.to(tweened, { duration: 0.5, number: Number(n) || 0 })
// })
</script>
<template>
    <div class="flex flex-col gap-2 items-center">
        <svg height="150" width="150" viewBox="0 0 20 20" class="hidden">
            <circle r="10" cx="10" cy="10" fill="lightgray" />
            <g v-for="(section, index) of sections" :transform="`rotate(-${90 + 360 * sections.slice(0, index + 1).reduce((p, c) => p += c.percentage, 0)})`" class=" origin-center transition-all">
                <circle r="5" cx="10" cy="10" fill="transparent"
                        stroke-width="10"
                        :stroke-dasharray="`calc(${section.percentage * 100} * 31.4 / 100) 31.4`"
                        
                        class=" origin-center transition-all stroke-tiamate-blue scale-90 hover:scale-100"
                        :style="`filter: hue-rotate(${160 * index}deg); --rotate: -${90 + 360 * sections.slice(0, index + 1).reduce((p, c) => p += c.percentage, 0)}`"
                        :key="index" />

            </g>
        </svg>
        <svg height="100" width="100" :viewBox="`-${diameter/2} -${diameter/2} ${diameter} ${diameter}`">
            <circle :r="diameter/2-5"
                class=" fill-gray-light"
            />
            <g v-for="(section, index) of sections" class="stroke-white stroke-[10px]">
                <path v-if="section.percentage < 1"
                    :d="`M 0 0
                        L ${index > 0 ? toCoordinates(index - 1).str : '0 -' + (diameter/2-5)}
                        A ${diameter/2-5} ${diameter/2-5}, 0, ${section.percentage < 0.5 ? 0 : 1}, 1, ${toCoordinates(index).str}
                        L 0 0
                        Z`"
                    class="  "
                    :fill="section.color"
                    stroke-linejoin="round"
                >
                </path>
                <circle v-else :fill="section.color" :r="diameter/2-5"></circle>
            </g>
            <!-- <path
                :d="`M 0 0
                    L ${diameter/2-5} 0
                    A ${diameter/2-5} ${diameter/2-5}, 0, 0, 1, 0 ${diameter/2-5}
                    L 0 0`"
                class=" fill-black/10 stroke-white stroke-4">

            </path> -->
        </svg>
        <div class="flex gap-3 justify-center">
            <div v-for="(section) of sections" class="flex gap-1 items-center">
                <SquareIcon :style="`--color: ${section.color}`" class=" stroke-[var(--color)] fill-[var(--color)] size-5"></SquareIcon>
                <!-- <span>{{ section.percentage * 100 }}%</span> -->
                <span class=" capitalize">{{ section.title }}</span>
            </div>
        </div>
        <!-- Type a number: <input v-model.number="number" />
        <p>{{ tweened.number.toFixed(0) }}</p>  -->

    </div>
</template>