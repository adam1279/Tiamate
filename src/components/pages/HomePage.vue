<script setup lang="ts">
import { IPage as _Page } from "src/ipc";
import Page from "../Page.vue";
import Widget from "../Widget.vue";
import PageSection from "../PageSection.vue";
import {HandIcon, Squircle} from "lucide-vue-next"
import IconButton from "../IconButton.vue";
import { useStudentsStore } from "../../stores/useStudents";
import { useUtilitiesStore } from "../../stores/useUtilities";
import { useSettingsStore } from "../../stores/useSettings";
const props = defineProps<{
    page: _Page,
    currentPage: string
}>();
const students = useStudentsStore();
const util = useUtilitiesStore();
const { t, tm } = util;
const settings = useSettingsStore();
</script>
<template>
    <Page :page="page" :current-page="currentPage">
        <template #options>
        </template>
        <PageSection :title="t(`welcome`)" :icon="HandIcon">
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
            <Widget class="w-full flex-col">
                <span class=" font-bold text-gray-dark">Hey!</span>
                <div class="flex flex-col *:*:first-letter:uppercase *:first-letter:uppercase">
                    <p>Velkommen til Tiamate!</p>
                    <p>Her kan grupper dannes ud fra følgende parametre:</p>
                    <ul class=" list-disc indent-4 list-inside my-2">
                        <li>{{ t("gender_distribution") }}</li>
                        <li>{{ tm(["team", ""], ["balance"]) }} ({{ tm(["based"], ["on", 2], ["belbin_role", 2]) }})</li>
                        <li>{{ tm(["previous", 2], ["team", 2]) }}</li>
                    </ul>
                    <p>Grupperingen kan faciliteres manuelt eller automatisk med programmets algoritme.</p>
                    <br>
                    <p>I bunden af programmet vises supplerende info om elementer, når musen svæver over disse.</p>
                </div>
            </Widget>
            <!-- <span>{{ t("member", 2) }}</span> -->
            <!-- <span>{{ tm(['unfilled', 2], ['role', 2]) }}</span> -->
        </PageSection>
        <!-- <button @click="saveExcel">Save Excel</button> -->
        
    </Page>
</template>