<script setup lang="ts">
import { computed } from 'vue';
import OptionsDropdown, { Option } from './OptionsDropdown.vue';
import { CheckSquareIcon, ChevronDownIcon, RotateCcwIcon, SquareIcon } from 'lucide-vue-next';
import IconToggle, { State } from './IconToggle.vue';
import IconButton from './IconButton.vue';
import { useUtilitiesStore } from '../stores/useUtilities';
type AcceptableType = string | number | boolean;
const value = defineModel<AcceptableType>();
// const inputType = computed(() => {
//     switch (typeof value.value) {
//         case "string": 
//             return 
//     }
// });
const util = useUtilitiesStore();
const { t } = util;
const props = defineProps<{
    options?: Option[],
    title: string,
    type?: "text" | "number",
    horizontal?: boolean,
    placeholder?: string,
    states?: [State, State],
    inputWidth?: string,
    defaultValue?: any,
    percentage?: boolean
}>();
const _states = computed(() => {
    if (props.states) return props.states;
    return [
        {
            icon: SquareIcon,
        },
        {
            icon: CheckSquareIcon
        }
    ] as [State, State];
});
const computedValue = computed({
    get() {
        if (props.percentage && typeof value.value == "number") {
            console.log(value.value);
            return `${Math.round(value.value * 100)}%`.replace(".", t("decimalPoint"));
        }
        return value.value;
    },
    set(newValue) {
        if (props.percentage && typeof value.value == "number" && typeof newValue == "string") {
            value.value = (Math.round(Number(newValue.replace("%", "").replace(",", "."))) / 100);
            // console.log(newValue);
            // console.log((Number(newValue.replace("%", "").replace(",", "."))) / 100);
        }
        else value.value = newValue;
    }
});
const computedType = computed(() => {
    if (typeof computedValue.value == "number") return "number";
    if (typeof computedValue.value == "string") return "text";
    return props.type;
});
const computedDefaultValue = computed(() => {
    if (props.percentage) return `${Math.round(props.defaultValue * 100)}%`.replace(".", t("decimalPoint"));
    return props.defaultValue;
});
</script>
<template>

    <div :data-horizontal="horizontal" class="flex data-[horizontal=true]:flex-col first-letter:uppercase data-[horizontal=false]:items-center data-[horizontal=true]:gap-1 bg-white rounded">
        <div :data-horizontal="horizontal" class="flex uppercase text-gray text-xs data-[horizontal=false]:px-2 shrink-0 border-gray data-[horizontal=false]:border-l data-[horizontal=false]:border-y h-full items-center rounded-l">
            <span class="">{{ title }}</span>
        </div>
        <div :data-horizontal="horizontal" class="flex border border-gray rounded data-[horizontal=false]:rounded-l-none h-full shrink [horizontal=true]:w-full grow items-center bg-gray-light bg-opacity-50 focus-within:bg-opacity-100 focus-within:shadow-inner transition-all">
            <OptionsDropdown v-model="value" v-if="options" :options="options" class="w-full px-1 bg-gray-light border-l border-gray rounded-r">
                <div class="flex w-full">
                    <span>{{ value }}</span>
                    <ChevronDownIcon></ChevronDownIcon>
                </div>
            </OptionsDropdown>
            <div class="flex bg-gray-light bg-opacity-50 rounded-r hover:bg-opacity-100 transition-colors" v-else-if="typeof value =='boolean'">
                <IconToggle 
                    v-model="value"
                    :states="_states"
                    class=" p-1"
                >
                
                </IconToggle>
            </div>
            <div class="flex min-h-full w-full items-center" v-else>
                <input :data-horizontal="horizontal" :type="computedType" v-model="computedValue" class=" rounded data-[horizontal=false]:rounded-l-none w-full min-h-full min-w-10 bg-transparent grow flex" :placeholder="placeholder">
                <IconButton v-if="value != defaultValue" :tooltip="`${t('reset')} ${t('to')} ${computedDefaultValue || placeholder}`" :icon="RotateCcwIcon" size="size-4" class="px-1 text-gray" @click="value = defaultValue"></IconButton>
            </div>
        </div>
    </div>
</template>