<script setup lang="ts">
import { Data, IPage } from "src/classes";
import Page from "../Page.vue"
import PageSection from "../PageSection.vue";
import { EggIcon, FileBoxIcon, FileSpreadsheetIcon, FileTextIcon, PackageIcon } from "lucide-vue-next";
import IconButton from "../IconButton.vue";
import OptionsDropdown from "../OptionsDropdown.vue";
import Widget from "../Widget.vue";
import { computed, onMounted, ref } from "vue";
import { useTeamsStore } from "../../stores/useTeams";
import { usePackagesStore } from "../../stores/usePackages";
import PackageWidget from "../PackageWidget.vue";
const props = defineProps<{
    page: IPage,
    currentPage: string
}>();
const teams = useTeamsStore();
const packages = usePackagesStore();
const unpackagedTeams = computed(() => {
    return teams.all.filter(t => t.state == "unpackaged");
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
            <!-- <Widget v-for="pckge of packages.all">
            </Widget> -->
            <div class="flex flex-col grow">
                <PackageWidget v-for="(pckge, index) of packages.all" :package="pckge" :index="index"></PackageWidget>
                <!-- <PackageWidget :index="1"></PackageWidget> -->
            </div>
        </PageSection>
    </Page>
</template>