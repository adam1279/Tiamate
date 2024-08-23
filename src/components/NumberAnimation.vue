<script setup lang="ts">
import gsap from 'gsap';
import { useUtilitiesStore } from '../stores/useUtilities';
import { computed, onMounted, reactive, watch } from 'vue';
// import { useI18n } from 'vue-i18n';
// const { t } = useI18n();
const util = useUtilitiesStore();
const { t } = util;
const props = defineProps<{
    number: number,
    post?: (number: number) => string,
    decimalAmount?: number
}>();
const animatedNumber = reactive({
    number: 0
});
function update() {
    gsap.to(animatedNumber, {duration: 0.5, number: Number(props.number) || 0});
}
onMounted(update);
watch(() => props.number, update);
function postProcess(number: number) {
    let processed = number;
    if (props.post) return props.post(number);
    return number;
}
const processedNumber = computed(() => {
    let processed = props.post ? props.post(animatedNumber.number) : animatedNumber.number.toString();
    const indexOfPoint = processed.indexOf(".");
    if (indexOfPoint > -1) {
        // Removing excess decimals
        processed = processed.slice(0, indexOfPoint) + processed.slice(indexOfPoint, indexOfPoint + 1 + (props.decimalAmount || 1));
        // Localizing decimal point
        processed = processed.replace(".", t("decimalPoint"));
    }
    return processed;
})
</script>
<template>
    {{ processedNumber }}
</template>