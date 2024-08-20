<script setup lang="ts">
import { Data, IPage as _Page } from "src/classes";
import Page from "../Page.vue"
import PageSection from "../PageSection.vue";
import { EggIcon, FileBoxIcon, FileSpreadsheetIcon, FileTextIcon, PackageIcon } from "lucide-vue-next";
import IconButton from "../IconButton.vue";
import OptionsDropdown from "../OptionsDropdown.vue";
import Widget from "../Widget.vue";
import { computed, onMounted, ref } from "vue";
const props = defineProps<{
    page: _Page,
    currentPage: string
}>();
const data = ref<Data>({
    students: [],
    packages: [],
    teams: []
});
onMounted(async () => {
    data.value = await window.electron.data.get();
});
window.electron.data.onUpdate((_data) => {
    data.value = _data;
});
const unpackagedTeams = computed(() => {
    return data.value.teams.filter(t => t.state == "unpackaged");
});
</script>
<template>
    <Page :page="page" :current-page="currentPage">
        <PageSection :icon="EggIcon" :title="`${$t('unpackaged', 2)} ${$t('team', 2)}`" >
            <template #options>
                
            </template>
            <Widget v-for="team of unpackagedTeams">

            </Widget>
        </PageSection>
        <PageSection :icon="PackageIcon" :title="$t('package', 2)" >
            <template #options>
                <OptionsDropdown :options="[
                    {
                        text: `${$t('export')} ${$t('as')} ${$t('spreadsheet')}`,
                        click: () => {},
                        icon: FileSpreadsheetIcon
                    },
                    {
                        text: `${$t('export')} ${$t('as')} ${$t('PDF')}`,
                        click: () => {},
                        icon: FileTextIcon
                    }
                ]">
                    <IconButton :icon="FileBoxIcon" :tooltip="`${$t('export')} ${$t('package', 2)}`">

                    </IconButton>
                </OptionsDropdown>
            </template>
            <Widget v-for="pckge of data.packages">
            </Widget>
        </PageSection>
    </Page>
</template>