<script setup lang="ts">
import { IPage as _Page } from "src/classes";
import Page from "../Page.vue";
import Widget from "../Widget.vue";
import PageSection from "../PageSection.vue";
import {HandIcon, Squircle} from "lucide-vue-next"
import IconButton from "../IconButton.vue";
import { useStudentsStore } from "../../stores/useStudents";
import { useUtilitiesStore } from "../../stores/useUtilities";
const props = defineProps<{
    page: _Page,
    currentPage: string
}>();
const students = useStudentsStore();
const util = useUtilitiesStore();
</script>
<template>
    <Page :page="page" :current-page="currentPage">
        <template #options>
        </template>
        <PageSection :title="$t(`welcome`)" :icon="HandIcon">
            <!-- <Widget>
                <IconButton :icon="Squircle" tooltip="Love"></IconButton>
            </Widget> -->
            <!-- {{ util.mergeDeep({a: 1, b: 2, c: 4}, {a: 2, b: 3}) }}
            <div v-for="student of students.all">
                <Widget>
                    <table>
                        <tr v-for="[key, value] of Object.entries(student)">
                            <td><span class=" uppercase font-bold text-xs text-gray">{{ key }}</span></td>
                            <td><span>{{ value }}</span></td>
                        </tr>
                    </table>
                </Widget>
            </div> -->
            <span>Hey!</span>
        </PageSection>
        <!-- <button @click="saveExcel">Save Excel</button> -->
    </Page>
</template>