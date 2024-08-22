<script setup lang="ts">
import { Data, IPage as _Page } from "src/classes";
import Page from "../Page.vue";
import IconButton from "../IconButton.vue";
import { ArmchairIcon, BotIcon, BotOffIcon, BrainCogIcon, FlaskConicalIcon, GraduationCapIcon, GripVerticalIcon, Import, Link2Icon, Link2OffIcon, PackageIcon, PackagePlusIcon, PlayIcon, PlusCircleIcon, PlusIcon, RotateCwIcon, SettingsIcon, SparklesIcon, SquareDotIcon, Unlink2Icon, UsersIcon, ViewIcon } from "lucide-vue-next";
import PageSection from "../PageSection.vue";
import Widget from "../Widget.vue";
import BelbinCompass from "../BelbinCompass.vue";
import { computed, onMounted, reactive, ref, watch } from "vue";
import TooltipItem from "../TooltipItem.vue";
import computedStyleToInlineStyle from "computed-style-to-inline-style";
import TeamWidget from "../TeamWidget.vue";
import IconToggle from "../IconToggle.vue";
import StudentWidget from "../StudentWidget.vue";
import TransitionTemplate from "../TransitionTemplate.vue";
import OptionsDropdown from "../OptionsDropdown.vue";
import { useStudentsStore } from "../../stores/useStudents";
import { useTeamsStore } from "../../stores/useTeams";
import { Student } from "src/classes/Student";
import { Team } from "src/classes/Team";
import { useUtilitiesStore } from "../../stores/useUtilities";
import { useSettingsStore } from "../../stores/useSettings";
import gsap from "gsap";
import SettingComponent from "../SettingComponent.vue";
import TeamContainer from "../TeamContainer.vue";
import { Panel, PanelGroup, PanelResizeHandle } from "vue-resizable-panels";
const props = defineProps<{
    page: _Page,
    currentPage: string
}>();
const root = ref<HTMLDivElement | null>(null);
// const data = ref<Data>();
const students = useStudentsStore();
const teams = useTeamsStore();
const util = useUtilitiesStore();
const settings = useSettingsStore();
const unassignedStudents = computed(() => {
    // return students.all?.filter(student => student.state == "unassigned");
    return students.query({state: "unassigned"});
});
function print() {
    const clone = root.value.cloneNode(true) as HTMLDivElement;
    computedStyleToInlineStyle(clone, {
        recursive: true
    });
    console.log(clone);
    // window.electron.printToPDF();
}
const currentTab = ref('members');
const tabsLinked = ref(true);

function reload() {
    // data.value.students.forEach(student => window.electron.data.assign("students", student.id));
    // students.all.forEach(student => student.state = "unassigned");
    const reloadStudents = students.ofTeam(...teams.query({state: "proposed", locked: false}));
    students.unassign(...reloadStudents);
    reloadStudents.forEach(student => student.previewing = false);
}
const trialCount = ref(0);
const animatedTrialCount = reactive({number: 0});
// watch(trialCount, () => {
//     gsap.to(animatedTrialCount, {duration: .5, number: Number(trialCount.value) || 0})
// });
function runAlgorithm() {
    const _runAlgorithm = () => {
        // students.query({state: "unassigned"}).sort(() => Math.random() - 0.5).forEach(student => {
        //     // teams.query({locked: false, state: "proposed"})[0].assignStudent(student);
            
        //     // console.log(teams.bestFor(student).full);
            
        // })
        // for (let i = 0; i < settings.all.automation.trialLimit; i++) {
        trialCount.value = 0;
        const interval = setInterval(() => {
            for (let student of students.query({state: "unassigned"}).sort(() => Math.random() - 0.5)) {
                const bestFor = teams.bestFor(student);
                if (bestFor) {
                    teams.assignStudent(bestFor, student);
                }
                else {
                    reload();
                    break;
                }
            }
            trialCount.value++;
            if (students.query({state: "unassigned"}).length == 0 || trialCount.value == settings.all.automation.trialLimit) {
                clearInterval(interval);
            }
        }, 10);
        //     console.log(i);
        //     if (students.query({state: "unassigned"}).length == 0) {
        //         console.log(i);
        //         break;
        //     }
        // }
    };
    if (students.query({state: "unassigned"}).length == 0) {
        reload();
        trialCount.value = 0;
        setTimeout(_runAlgorithm, 500);
    } else _runAlgorithm();
}
const seats = computed(() => teams.query({state: 'proposed'}).reduce((sum, team) => sum += teams.limitOf(team), 0));
</script>
<template>
    <Page :page="page" :current-page="currentPage">

        <!-- Students ################################################################################################## -->
        <PanelGroup direction="vertical">
            <Panel :default-size="30" :min-size="20">
            <PageSection :icon="GraduationCapIcon" :title="$t('student', 2)" class=" h-full" :overflow-hidden="true" custom @dragover="e => e.preventDefault()" @drop="util.dropStudentBack" :non-collapsible="true">
                <template #options>
                    <IconButton :icon="RotateCwIcon" :tooltip="`${$t('reset')} ${$t('student', 2)}`" @click="reload"></IconButton>
                </template>
                <div class=" flex grow flex-wrap gap-1 overflow-y-auto select-none drag-none snap-y snap-mandatory">
                    <!-- <TransitionTemplate fade group
                        :transition="{
                            leaveFrom: 'max-w-10',
                            leaveTo: 'max-w-0'
                        }"
                    > -->
                        <StudentWidget v-for="student of unassignedStudents"
                            class=" snap-start snap-always"
                            :student="student"
                            :key="student.id"
                            state="unassigned"
                        >
                        </StudentWidget>
                        <!-- <div v-if="students.query({state: 'unassigned'}).length == 0" class=""></div> -->
                    <!-- </TransitionTemplate> -->
            
                    <div v-if="students.all?.length == 0" class=" italic text-gray">
                        {{ $t("letsbegin", {msg: $t("student", 2)}) }}
                    </div>
                </div>
            </PageSection></Panel>
            <PanelResizeHandle class="h-[1px] w-full bg-gray transition-all items-center flex z-50 group">
                <div class=" h-1 group-hover:w-32 group-hover:h-2 w-10 bg-white border border-gray mx-auto rounded-full transition-all"></div>
            </PanelResizeHandle>

            <!-- Teams ###################################################################################################### -->
            <Panel class=" border-b border-gray">
            <PageSection :icon="UsersIcon" :title="$t('team', 2)" class=" h-full" :overflow-hidden="true" :non-collapsible="true">
                <template #options>
                    <TooltipItem :text="`${students.all?.length} ${$t('student', 2)} / ${seats} ${$t('seat', 2)}`" class="flex text-xs font-bold items-center gap-1 rounded bg-white/80 p-1 border border-gray text-gray-dark font-mono">
                        <GraduationCapIcon class=" size-4"></GraduationCapIcon>
                        <span> {{ students.all?.length }}</span>
                        <span>/</span>
                        <ArmchairIcon class=" size-4"></ArmchairIcon>
                        <span>{{ seats }}</span>
                    </TooltipItem>
                    <IconButton :icon="PackagePlusIcon" :tooltip="`${$t('package_2')} ${$t('team', 2)}`"
                        @click="teams.packageProposed"
                    ></IconButton>
            
                    <IconButton :icon="PlusCircleIcon" :tooltip="`${$t('new')} ${$t('team')}`" @click="teams.add" ></IconButton>
                    <!-- <OptionsDropdown :options="[
                        {
                            icon: Link2Icon,
                            text: `${$t('unlink')} ${$t('tab', 2)}`,
                            click: () => {}
                        }
                    ]">
                        <IconButton :icon="SettingsIcon" :tooltip="$t('setting', 2)"></IconButton>
                    </OptionsDropdown> -->
                </template>
                <template #tray>
                    <div class="flex gap-1 flex-wrap">
                        <!-- <IconToggle v-model="settings.all.tabsLinked" :states="[
                            {
                                icon: Link2OffIcon,
                                tooltip: `${$t('link_2')} ${$t('tab', 2)}`,
                            },
                            {
                                icon: Link2Icon,
                                tooltip: `${$t('unlink')} ${$t('tab', 2)}`,
                            },
                        ]"></IconToggle> -->
                        <SettingComponent v-model="settings.all.tabsLinked" :title="`${$t('link_2')} ${$t('tab', 2)}`"
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
                        <SettingComponent
                            v-model="settings.all.memberLimit"
                            :title="`${$t('member limit')}`"
                            type="number"
                            :default-value="settings.allDefault.memberLimit"
                            input-width="w-60"
                            class=" shadow-sm"
                        ></SettingComponent>
                        <SettingComponent
                            v-model="settings.all.resetOnPackaging"
                            :title="`${$t('reset')} ${$t('student', 2)} ${$t('on')} ${$t('packaging')}`"
                            class=" shadow-sm"
                        >
                        </SettingComponent>
                    </div>
                </template>
                <!-- <TransitionGroup leave-from-class="opacity-100" leave-to-class="opacity-0" leave-active-class="transition-all" enter-to-class="opacity-100" enter-from-class="opacity-0" enter-active-class="transition-all">
                    <TeamWidget :index="index" :team="team" :assigned-students="teamStudents(team)" :previewed-students="previewedStudents" v-for="(team, index) of teams" :key="team.id" :current-tab="(tabsLinked) ?currentTab : undefined" @tab-change="tab => currentTab = tab" @delete="deleteTeams(team)">
            
                    </TeamWidget>
                </TransitionGroup> -->
                <!-- <div class=" min-h-72 flex-wrap flex flex-row gap-3"> -->
                <TeamContainer class="">
                    <TransitionTemplate group fade>
                        <TeamWidget :index="index"
                            :team="team"
                            v-for="(team, index) of teams.query({state: 'proposed'})"
                            :key="team.id"
                            :current-tab="(settings.all.tabsLinked) ? currentTab : undefined"
                            @tab-change="tab => currentTab = tab"
                            @delete="teams.deleteTeam(team)"
                            @drop="util.dropStudent(team)"
                            @dragover="e => e.preventDefault()"
                            :data-full="team.full && util.draggedStudent != undefined"
                            class=" data-[full=true]:cursor-no-drop"
                        >
            
                        </TeamWidget>
                    </TransitionTemplate>
                    <div v-if="teams.query({state: 'proposed'}).length == 0" class="italic text-gray">
                        {{ $t("letsbegin", {msg: $t("team", 2)}) }}
                    </div>
                </TeamContainer>
            </PageSection></Panel>
            <!-- <PanelResizeHandle class="h-1 w-full bg-gray"/> -->

            <!-- Automation ################################################################################################### -->
            <PageSection :icon="SparklesIcon" :title="`${$t('automatic')} ${$t('team creation')}`">
                <template #options>
                    <span>{{ trialCount }}</span>
                    <IconButton :icon="PlayIcon" :tooltip="`${$t('run')} ${$t('automatic')} ${$t('team creation')}`" @click="runAlgorithm"></IconButton>
                </template>
                <div class="flex flex-col grow">
                    <Widget class=" grow items-start grid lg:grid-cols-3 gap-1">
                        <SettingComponent
                            v-model.number="settings.all.automation.trialLimit"
                            :title="`${$t('trial')}${$t('connectingSpace2')}${$t('limit')}`"
                            class=""
                            type="number"
                            :default-value="settings.allDefault.automation.trialLimit"
                            horizontal
                        >
                        </SettingComponent>
                        <SettingComponent
                            v-model.number="settings.all.automation.maxUnfilledRoles"
                            :title="`${$t('max')}. # ${$t('unfilled', 2)} ${$t('role', 2)} (ikke færdig)`"
                            type="number"
                            :default-value="settings.allDefault.automation.maxUnfilledRoles"
                            horizontal
                        >
                        </SettingComponent>
                        <!-- <input type="number" v-model.number="settings.all.automation.trialLimit">
                        <input type="number" v-model.number="settings.all.automation.maxUnfilledRoles"> -->
                        <!-- <div class="flex p-1 rounded bg-gray-light">
                            <IconButton :icon="PlayIcon" :tooltip="$t('play')" @click="runAlgorithm"></IconButton>
                        </div> -->
                    </Widget>
                </div>
            </PageSection>
            <!-- <PanelGroup direction="vertical">
                <Panel>
                    <Widget></Widget>
                </Panel>
                <PanelResizeHandle class=" bg-red-700 h-1 w-full"/>
                <Panel>
                    <Widget></Widget>
                </Panel>
            </PanelGroup> -->
        </PanelGroup>
    </Page>
</template>