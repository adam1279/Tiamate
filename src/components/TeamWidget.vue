<script setup lang="ts">
// import { IStudent, ITeam } from 'src/classes';
import BelbinCompass from './BelbinCompass.vue';
import Widget from './Widget.vue';
import TabNav from './TabNav.vue';
import { CircleAlertIcon, CircleSlash2Icon, CircleUserIcon, CompassIcon, EggIcon, EggOffIcon, HistoryIcon, LockIcon, LockOpenIcon, PieChartIcon, ScaleIcon, SettingsIcon, TrashIcon } from 'lucide-vue-next';
import IconButton from './IconButton.vue';
import { computed, onMounted, reactive, ref, watch } from 'vue';
import IconToggle from './IconToggle.vue';
import StudentWidget from './StudentWidget.vue';
import TransitionTemplate from './TransitionTemplate.vue';
import { useStudentsStore } from '../stores/useStudents';
import { useTeamsStore } from '../stores/useTeams';
import PieChart from './PieChart.vue';
import PercentageBar from './PercentageBar.vue';
import { useUtilitiesStore } from '../stores/useUtilities';
// import { useI18n } from 'vue-i18n';
import MemberSlotBar from './MemberSlotBar.vue';
import { useSettingsStore } from '../stores/useSettings';
import { Team } from 'src/classes/Team';
import TooltipItem from './TooltipItem.vue';
import gsap from 'gsap';
import EvalLabel from './EvalLabel.vue';
import SettingComponent from './SettingComponent.vue';
import NumberAnimation from './NumberAnimation.vue';
// const { t } = useI18n();
const props = defineProps<{
    team: Team,
    // currentTab: string
}>();
const currentTab = defineModel<string>("currentTab")
const localCurrentTab = ref<string>("members");
const teams = useTeamsStore();
const students = useStudentsStore();
const util = useUtilitiesStore();
const { t, tm } = util;
const settings = useSettingsStore();
watch(currentTab, () => {
    update();
});
watch(() => settings.all.tabsLinked, () => {
    update();
})
function update() {
    if (settings.all.tabsLinked) {
        localCurrentTab.value = currentTab.value;
    }
}
// watch(localCurrentTab, () => {
//     if (settings.all.tabsLinked) {
//         console.log("localCurrentTab");
//         currentTab.value = currentTab.value;
//     }
// })
const assignedStudents = computed(() => students.ofTeam(props.team));
const previewedStudents = computed(() => props.team?.state != "packaged" ? students.query({previewing: true}) : []);
const allStudents = computed(() => assignedStudents.value.concat(previewedStudents.value));
const inactive = ref(false);
const genderMakeup = computed(() => {
    console.log(props.team.members);
    const array = allStudents.value.map(member => member.gender);
    console.log(array);
    const obj: {[k:string]: number} = {};
    array.forEach(gender => {
        obj[gender] = (obj[gender] || 0) + 1;
    });
    const colors = ["var(--color-tiamate-blue)", "var(--color-tiamate-red)", "var(--color-purple)"];
    return Object.keys(obj).map((key, index) => {
        return {percentage: obj[key]/array.length, color: colors[index], title: t(key, 2)}
    });
});
const balanceTweened = reactive({
    number: 0
});
const balance = computed(() => Math.round(teams.evaluateBelbin(allStudents.value) * 1000) / 10);
function updateBalance() {
    gsap.to(balanceTweened, { duration: 0.5, number: Number(balance.value) || 0 });
}
watch(balance, updateBalance);
onMounted(() => {
    console.log(props.team);
    updateBalance();
});
const previousTeamsTally = computed(async () => {
    // await teams.init();
    // console.log("popop");
    return util.tally(allStudents.value.flatMap(student => student.previousTeams));
})
const previousTeamsTallySorted = computed(() => {
    return Object.entries(previousTeamsTally.value).sort((a, b) => {
        if (a[1] > b[1]) return -1;
        if (a[1] < b[1]) return 1;
        if (a[0] > b[0]) return 1;
        if (a[0] < b[0]) return -1;
    });
})
// const defaultTitle = computed(() => util.capitalizeFirstLetter(`${t('team', 1)} ${props.index + 1}`));
</script>
<template>
        
    <!-- <Widget class="flex-col gap-1 w-64"> -->
    <Widget class="flex-col gap-1 h-[21rem] overflow-hidden" v-if="team">
        <!-- {{ team.state }} -->
        <div class="flex">
            <div class="flex gap-1">
                <span class=" inline-block font-bold text-gray-dark">
                    {{ /*team.name && team.name != '' ? team.name : defaultTitle*/ teams.nameOf(team) }}
                </span>
                <!-- <span class=" text-gray text-ellipsis shrink">#{{ team.id }}</span> -->
            </div>
            <div class="flex grow justify-end gap-1 items-center">
                <!-- <IconButton :icon="EggIcon" :tooltip="`${t('forward')} ${$tc('unpackaged', 1)}`"></IconButton> -->
                <!-- <IconToggle :current-state="0" :states="[
                    {
                        icon: EggIcon,
                        tooltip: `${t('forward')} ${$tc('unpackaged', 1)}`,
                        value: false
                    },
                    {
                        icon: EggOffIcon,
                        tooltip: `${t('undo')} ${$tc('forward_2', 1)}`,
                        value: true
                    }
                ]" @update="state => {inactive = state; console.log(state)}"></IconToggle> -->
                <TooltipItem :text="`${t('member limit')} ${t('exceeded')}`">
                    <CircleAlertIcon v-if="team.members.length > teams.limitOf(team)" class=" stroke-tiamate-red size-4"></CircleAlertIcon>
                </TooltipItem>
                <IconToggle v-if="team.state != 'packaged'" v-model="team.locked" :states="[
                    {
                        icon: LockOpenIcon,
                        tooltip: `${t('lock')}`,
                    },
                    {
                        icon: LockIcon,
                        tooltip: `${t('unlock')}`,
                    }
                ]"></IconToggle>
                <IconButton v-if="team.state != 'packaged'" :icon="TrashIcon" tooltip="delete" color="red" @click="teams.deleteTeam(team)"></IconButton>
            </div>
        </div>
        <!-- {{ localCurrentTab }} -->
        <!-- <PercentageBar :sections="genderMakeup" :limit="6" :amount="allStudents.length"></PercentageBar> -->
        <MemberSlotBar :members="allStudents" :limit="teams.limitOf(team)" class="shrink-0"></MemberSlotBar>
        <TabNav :data-inactive="team.locked" class=" data-[inactive=true]:opacity-50 data-[inactive=true]:grayscale grow" v-model:current-tab="localCurrentTab" @tab-change="tab => { currentTab = localCurrentTab}"
            :tabs="[
                {
                    title: t('member', 2),
                    icon: CircleUserIcon,
                    id: 'members'
                },
                {
                    title: t('belbin_compass', 1),
                    icon: CompassIcon,
                    id: 'compass'
                },
                {
                    title: `${t('previous', 2)} ${t('team', 2)}`,
                    icon: HistoryIcon,
                    id: 'previousTeams'
                }
            ]"
            :end-tabs="[
                
                {
                    title: t('setting', 2),
                    icon: SettingsIcon,
                    id: 'settings'
                }
            ]"
        >
        <!-- @tab-change="tab => $emit('tabChange', tab)" -->
        <!-- @tab-change="tab => { if (settings.all.tabsLinked) currentTab = tab}" -->
            <template #members>
                <div class="flex flex-col gap-1">
                    <TransitionTemplate group fade>
                        <StudentWidget :state="team.state != 'packaged' ? 'assigned' : 'packaged'" v-for="student of assignedStudents" :student="student" :data-key="student?.id" :key="student.id" :other-students="allStudents"></StudentWidget>
                        <StudentWidget state="previewed" v-for="student of previewedStudents" :student="student" :key="team?.id + student?.id" :other-students="allStudents"></StudentWidget>
                    </TransitionTemplate>
                    
                </div>
            </template>
            <template #compass>
                <div class="flex grow justify-center">
                    <BelbinCompass :previewed-students="previewedStudents" :students="assignedStudents" :diameter="200" include-icons :teamId="team.id">
                    </BelbinCompass>
                </div>
                <!-- <div class="flex p-1 rounded text-xs items-center gap-1 w-fit font-bold text-gray-dark absolute bottom-2 right-2 font-mono border border-gray bg-gray-light/50">
                    <ScaleIcon class="size-4 stroke-2"></ScaleIcon>
                    <span>{{ balanceTweened.number.toString().slice(0, 4).replace(".", t("decimalPoint")) }}%</span>
                </div> -->
                <EvalLabel :tooltip="`${tm(['team', ''], ['balance'])}`" :icon="ScaleIcon">
                    {{ balanceTweened.number.toString().slice(0, 4).replace(".", t("decimalPoint")) }}%
                    <!-- <NumberAnimation :number="balance"></NumberAnimation> -->
                </EvalLabel>
                <!-- <EvalLabel :tooltip="`${t('team')} ${t('balance')}`" :icon="ScaleIcon" :values="[teams.evaluateBelbin(allStudents)]">

                </EvalLabel> -->

            </template>
            <!-- <template #pie>
                {{ team.members }} -->
                <!-- {{ (Math.round(teams.evaluateBelbin(team).eval * 1000) / 10) }}% -->
                <!-- {{ teams.evaluateBelbin(allStudents).eval }}
                {{ teams.evaluateBelbin(allStudents).belbinSums }} -->
                <!-- {{ teams.evaluateBelbin(team) }} -->
                <!-- <PieChart :sections="[{color: 'red', percentage: 0.2}, {color: 'green', percentage: 0.2}, {color: 'blue', percentage: 0.6}]"></PieChart> -->
                <!-- <PieChart :sections="genderMakeup"></PieChart> -->
            <!-- </template> -->
            <template #previousTeams>
                <div class="flex flex-col gap-1">
                    <div v-for="[title, amount] of previousTeamsTallySorted"
                        class=" flex pl-1 rounded bg-gray-light items-end border border-gray"
                    >
                        <span class="grow">{{ title }}</span>
                        <span class=" self-end px-1 rounded-r border-l border-gray bg-white font-mono">{{ amount }}</span>
                    </div>
                </div>
                <!-- <EvalLabel :tooltip="`${t('average')} ${t('')}`" :icon="CircleSlash2Icon"> -->
                    <!-- {{ (previousTeamsTally) ? util.average(Object.values(previousTeamsTally)).toString().replace(".", t("decimalPoint")) : "" }} -->
                <!-- </EvalLabel> -->
            </template>
            <template #settings>
                <div class="flex flex-col gap-1">
                    <!-- <span class="grow uppercase text-xs text-gray">{{ `${t("custom")} ${t("member limit")}` }}</span>
                    <input type="number" v-model.number="team.customLimit" :placeholder="settings.all.memberLimit.toString()"
                        class="shrink min-w-6 standard"
                    > -->
                    <SettingComponent v-model="team.name"
                        :title="`${t('team')}${t('connectingSpace')}${t('name')}`"
                        horizontal
                        type="text"
                        :placeholder="teams.nameOf(team)"
                    >

                    </SettingComponent>
                    <SettingComponent v-if="team.state != 'packaged'" v-model.number="team.customLimit" type="number" horizontal :title="`${t('custom')} ${t('member limit')}`"
                        class="w-full"
                        :placeholder="settings.all.memberLimit.toString()"
                    ></SettingComponent>
                </div>
            </template>
        </TabNav>
    </Widget>
</template>
<style>
</style>