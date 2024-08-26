<script setup lang="ts">
const props = defineProps<{
    disabled?: boolean
}>();

</script>
<template>
    <div :data-disabled="!!disabled" class=" data-[disabled=true]:text-gray [&_*]:data-[disabled=true]:stroke-gray data-[disabled=true]:pointer-events-none transition-colors [&_*]:transition-colors">
        <slot></slot>
    </div>
</template>