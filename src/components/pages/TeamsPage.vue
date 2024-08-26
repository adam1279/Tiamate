<script setup lang="ts">
import { Data, IPage } from "src/ipc";
import Page from "../Page.vue"
import PageSection from "../PageSection.vue";
import { CheckIcon, CheckSquareIcon, CircleDotIcon, CircleIcon, DownloadIcon, EggIcon, FileBoxIcon, FileDownIcon, FileSpreadsheetIcon, FileTextIcon, FolderOpenIcon, Link2Icon, Loader2Icon, OctagonXIcon, PackageIcon, Settings2Icon, SmileIcon, SquareCheckBigIcon, SquareIcon, Unlink2Icon, XIcon } from "lucide-vue-next";
import IconButton from "../IconButton.vue";
import OptionsDropdown from "../OptionsDropdown.vue";
import Widget from "../Widget.vue";
import { computed, onMounted, ref } from "vue";
import { useTeamsStore } from "../../stores/useTeams";
import { usePackagesStore } from "../../stores/usePackages";
import PackageWidget from "../PackageWidget.vue";
import { useUtilitiesStore } from "../../stores/useUtilities";
import IconToggle from "../IconToggle.vue";
import { useStudentsStore } from "../../stores/useStudents";
import { Package } from "../../classes/Package";
import RadioButton from "../RadioButton.vue";
import { useSettingsStore } from "../../stores/useSettings";
import SettingComponent from "../SettingComponent.vue";
import Disablable from "../Disablable.vue";
const props = defineProps<{
    page: IPage,
    currentPage: string
}>();
const teams = useTeamsStore();
const students = useStudentsStore();
const util = useUtilitiesStore();
const settings = useSettingsStore();
const { t, tm } = util;
const packages = usePackagesStore();
const unpackagedTeams = computed(() => {
    return teams.all.filter(t => t.state == "unpackaged");
});
// const exportType = ref<"spreadsheet" | "pdf">("spreadsheet");
const currentTab = ref("members");
const awaitingDownload = ref(false);
const downloadResult = ref<boolean | "">("");
async function downloadExport() {
    awaitingDownload.value = true;
    util.loading = true;
    const result = await packages.downloadExport(...packages.query({selected: true}));
    downloadResult.value = result;
    awaitingDownload.value = false;
    util.loading = false;
}
</script>
<template>
    <Page :page="page" :current-page="currentPage">
        <!-- <PageSection :icon="EggIcon" :title="`${t('unpackaged', 2)} ${t('team', 2)}`" >
            <template #options>
                
            </template>
            <Widget v-for="team of unpackagedTeams">

            </Widget>
        </PageSection> -->
        <PageSection :icon="PackageIcon" :title="t('package', 2)" class=" overflow-y-hidden">
            <template #options>
                <!-- <OptionsDropdown :options="[
                    {
                        text: `${t('export')} ${t('as')} ${t('spreadsheet')}`,
                        click: () => {},
                        icon: FileSpreadsheetIcon
                    },
                    {
                        text: `${t('export')} ${t('as')} ${t('PDF')}`,
                        click: () => {},
                        icon: FileTextIcon
                    }
                ]">
                    <IconButton :icon="FileBoxIcon" :tooltip="`${t('export')} ${t('package', 2)}`">

                    </IconButton>
                </OptionsDropdown> -->
            </template>
            <template #tray>

                <SettingComponent v-model="settings.all.tabsLinked" :title="`${t('link_2')} ${t('tab', 2)}`"
                    :states="[
                        {
                            icon: Unlink2Icon,
                        },
                        {
                            icon: Link2Icon,
                        },
                    ]"
                    class=" shadow-sm"
                ></SettingComponent>
            </template>
            <!-- <Widget v-for="pckge of packages.all">
            </Widget> -->
            <div class="flex flex-col grow gap-3 overflow-y-auto">
                <PackageWidget v-for="(pckge, index) of packages.all" :package="pckge" :index="index" v-model:current-tab="currentTab"></PackageWidget>
                <!-- <PackageWidget :index="1"></PackageWidget> -->
                <span v-if="packages.all.length == 0" class="italic text-gray">
                    {{ t('letsbegin', 1, {msg: t('package', 2)}) }}
                </span>
            </div>
        </PageSection>
        <PageSection :title="t('export2')" :icon="FileBoxIcon">
            <template #options>
                <!-- <IconButton v-if="awaitingDownload" :icon="Loader2Icon" tooltip="" class=" animate-spin pointer-events-none"></IconButton>
                <IconButton v-else-if="downloadResult" :icon="CheckIcon" tooltip="" class=" pointer-events-none"></IconButton>
                <IconButton v-else-if="downloadResult == false" :icon="OctagonXIcon" tooltip="" class=" pointer-events-none"></IconButton> -->
                <div class=" *:size-5 *:stroke-1 flex text-gray">
                    <Loader2Icon v-if="awaitingDownload" class=" animate-spin"></Loader2Icon>
                    <CheckIcon v-else-if="downloadResult" class="stroke-green-700"></CheckIcon>
                    <XIcon v-else-if="downloadResult === false" class=" stroke-red-700"></XIcon>
                </div>
                <IconButton :tooltip="tm(['download', 1], ['export2', 1, '-'], ['file'])" :icon="DownloadIcon"
                    :click="downloadExport" :disabled="packages.query({selected: true}).length == 0"
                ></IconButton>
            </template>
            <Widget class="grow flex divide-x-2 divide-gray-light [&_>div]:px-1 [&_>div:first-child]:pl-0 [&_>div:first-child]:pr-0 max-h-36 overflow-y-hidden">
                <!-- <div class="flex gap-1 items-center"><span>Ikke færdig endnu </span><SmileIcon class=" stroke-1 size-5"></SmileIcon></div>. -->
                <div class="export group basis-1/3">
                    <div class="flex gap-1 items-center">
                        <!-- <IconToggle :states="[{
                            icon: SquareIcon
                        }, {
                            icon: SquareCheckBigIcon
                        }]"></IconToggle> -->
                        <PackageIcon class=" size-5 stroke-gray-dark group-hover:hidden"></PackageIcon>
                        <div class="hidden group-hover:flex">
                            <IconButton v-if="packages.query({selected: true}).length == packages.all.length" :icon="SquareCheckBigIcon" tooltip="" @click="packages.all.forEach(pack => pack.selected = false)"></IconButton>
                            <IconButton v-else :icon="SquareIcon" tooltip="" @click="packages.all.forEach(pack => pack.selected = true)" ></IconButton>
                        </div>
                        <span class=" text-xs uppercase font-bold text-gray-dark">{{ t('package', 2) }}</span>
                    </div>
                    <div class="flex flex-col flex-wrap h-full">
                        <div v-for="(pckge, index) of packages.all" class=" flex gap-1 items-center">
                            <IconToggle v-model="pckge.selected" :states="[{icon: SquareIcon}, {icon: CheckSquareIcon}]"></IconToggle>
                            <span>{{ packages.nameOf(pckge) }}</span>
                        </div>
                    </div>
                </div>
                <div class="export basis-1/6">
                    <div class="flex items-center gap-1">
                        <FileTextIcon v-if="settings.all.export.fileType == 'pdf'" class=" size-5 stroke-gray-dark"></FileTextIcon>
                        <FileSpreadsheetIcon v-if="settings.all.export.fileType == 'xlsx'" class=" size-5 stroke-gray-dark">

                        </FileSpreadsheetIcon>
                        <span class="text-xs uppercase font-bold text-gray-dark">{{ tm(["file", 1, ""], ["type"]) }}</span>
                    </div>
                    <div class="flex flex-col">
                        <div class="flex gap-1 items-center">
                            <RadioButton v-model="settings.all.export.fileType" value="xlsx"></RadioButton>
                            <span>Excel</span>
                        </div>
                        <div class="flex gap-1 items-center">
                            <RadioButton v-model="settings.all.export.fileType" value="pdf"></RadioButton>
                            <span>PDF</span>
                        </div>
                    </div>
                </div>
                <div class="export basis-1/6">
                    <div class="flex gap-1 items-center">
                        <FolderOpenIcon class="size-5 stroke-gray-dark"></FolderOpenIcon>
                        <span class="text-xs uppercase font-bold text-gray-dark">{{ tm(["open"], ["file"]) }}</span>
                    </div>
                    <div class="flex flex-col">
                        <div class="flex gap-1 items-center">
                            <IconToggle v-model="settings.all.export.openFile" :states="[{icon: SquareIcon}, {icon: CheckSquareIcon}]"></IconToggle>
                            <span class=" first-letter:uppercase">{{ tm(["in"], ["default", 1, ""], ["app"]) }}</span>
                        </div>
                        <div class="flex gap-1 items-center">
                            <IconToggle v-model="settings.all.export.openInFolder" :states="[{icon: SquareIcon}, {icon: CheckSquareIcon}]"></IconToggle>
                            <span class=" first-letter:uppercase">{{ tm(["in"], ["folder"]) }}</span>
                        </div>
                    </div>
                </div>
                <div class="export group">
                    <div class="flex items-center gap-1">
                        <Settings2Icon class=" stroke-gray-dark size-5"></Settings2Icon>
                        <span class="text-xs uppercase font-bold text-gray-dark">{{ t("option", 2) }}</span>
                    </div>
                    <div class="flex flex-col">
                        <Disablable :disabled="settings.all.export.fileType != 'pdf'" class="flex gap-1 items-center">
                            <IconToggle v-model="settings.all.export.includeCompass" :states="[{icon: SquareIcon}, {icon: CheckSquareIcon}]"></IconToggle>
                            <span class=" first-letter:uppercase">{{ tm(["include"], ["belbin_compass"]) }}</span>
                        </Disablable>
                        <Disablable :disabled="settings.all.export.fileType != 'pdf'" class="flex gap-1 items-center">
                            <IconToggle v-model="settings.all.export.includeStats" :states="[{icon: SquareIcon}, {icon: CheckSquareIcon}]"></IconToggle>
                            <span class=" first-letter:uppercase">{{ tm(["include"], ["stat", 2]) }}</span>
                        </Disablable>
                    </div>
                </div>
            </Widget>
        </PageSection>
    </Page>
</template>
<style lang="postcss" scoped>
div.export {
    @apply flex;
    @apply flex-col;
    @apply gap-1;
    @apply h-full;
    @apply overflow-hidden;
}
</style>