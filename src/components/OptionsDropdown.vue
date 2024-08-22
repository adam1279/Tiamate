<script setup lang="ts">
import DropdownMenu from './DropdownMenu.vue';
import OptionsItem from './OptionsItem.vue';
export interface Option {
    text: string,
    icon?: object,
    click?: (...args: any) => any,
    red?: boolean,
    value?: any
}
const value = defineModel<any>()
const props = defineProps<{
    options: Option[]
}>();
function select(option: Option) {
    if (option.click) option.click();
    if (value.value != undefined) value.value = option.value;
}
</script>
<template>
    <DropdownMenu>
        <template #source>
            <slot></slot>
        </template>
        <ul class=" divide-y divide-gray">
            <OptionsItem v-for="option of options" :icon="option.icon" @click="select(option)" :red="option.red">
                <span class=" first-letter:uppercase inline-block">{{ option.text }}</span>
            </OptionsItem>
        </ul>
    </DropdownMenu>
</template>