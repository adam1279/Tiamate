<script setup lang="ts">
import { EllipsisVerticalIcon } from "lucide-vue-next";
import IconButton from "../components/IconButton.vue";
import { Ref, VNodeRef, onMounted, ref } from "vue";
const showOptions = ref(false);
const options = ref(null);
function click() {
    showOptions.value = !showOptions.value;
    setTimeout(() => options.value.focus(), 10);
}
</script>
<template>
    <IconButton :icon="EllipsisVerticalIcon" tooltip="options" @click="click"></IconButton>
    <Transition enter-active-class="transition ease-out duration-100" enter-from-class="transform opacity-0 scale-95" enter-to-class="transform opacity-100 scale-100" leave-active-class="transition ease-in duration-75" leave-from-class="transform opacity-100 scale-100" leave-to-class="transform opacity-0 scale-95">
        <ul tabindex="1" ref="options" v-show="showOptions" @focusin="showOptions = true" @focusout="showOptions = false" @click="showOptions = false" class=" absolute bg-white mt-6 z-10 origin-top-right divide-y divide-gray border-gray border rounded gap-1 outline-none select-none">
            <slot></slot>
        </ul>
    </Transition>
</template>