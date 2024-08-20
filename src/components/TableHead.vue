<script setup lang="ts">
import { ChevronDownIcon, ChevronUpIcon } from 'lucide-vue-next';
import { computed, ref } from 'vue';
interface Col {
    title: string,
    id: string,
    descending?: boolean
}
const emit = defineEmits(["sort"]);
const props = defineProps<{
    cols: Col[],
    sortBy: string
}>();
const sortBy = ref(props.sortBy);
const _cols = ref(props.cols);
function click(col: Col) {
    console.log(col);
    if (sortBy.value == col.id) {
        console.log(props.cols);
        props.cols[_cols.value.indexOf(col)].descending = !col.descending;
        console.log(props.cols);
    } else {
        sortBy.value = col.id;
    }
    _cols.value = props.cols;
}
function sort(id: string) {
    emit("sort", id);
}
// const _cols = computed(() => {
//     return props.cols;
// })
</script>
<template>
    <tr>
        <th v-for="col of _cols" @click="click(col)" class=" cursor-pointer select-none">
            <div class="flex items-center">
                {{ col.title }}
                <div v-if="col.id == sortBy">
                    <span>{{ col }}</span>
                    <ChevronUpIcon v-if="col.descending" :size="20"></ChevronUpIcon>
                    <ChevronDownIcon v-if="!col.descending" :size="20"></ChevronDownIcon>
                </div>
            </div>
        </th>
    </tr>
</template>