<script setup lang="ts">
import { computed, markRaw, onMounted, ref } from 'vue';
import Sidebar from './components/Sidebar.vue';
import { IPage } from './classes';
import LabPage from './components/pages/LabPage.vue'
import HomePage from './components/pages/HomePage.vue';
import TitleBarButton from './components/TitleBarButton.vue';
import { HomeIcon, PencilRulerIcon, SidebarCloseIcon, SidebarOpenIcon, GraduationCapIcon, MinusIcon, SquareIcon, XIcon, UsersIcon, SettingsIcon, CopyIcon, MegaphoneIcon, HeartHandshakeIcon, PhoneIcon, RocketIcon, WrenchIcon, CrosshairIcon, LightbulbIcon, SearchIcon, CogIcon, InfoIcon, LanguagesIcon, GlobeIcon } from 'lucide-vue-next';
import TeamsPage from './components/pages/TeamsPage.vue';
import SettingsPage from './components/pages/SettingsPage.vue';
import InfoPage from './components/pages/InfoPage.vue';
import StudentsPage from './components/pages/StudentsPage.vue';
import { useStudentsStore } from './stores/useStudents';
import { usePackagesStore } from './stores/usePackages';
import { useSettingsStore, languages } from './stores/useSettings';
import { useTeamsStore } from './stores/useTeams';
import { useUtilitiesStore } from './stores/useUtilities';
const sidebarDeployed = ref(true);
const pages = ref<IPage[]>([
    {
        title: "Home",
        id: "home",
        icon: HomeIcon,
        component: markRaw(HomePage),
        main: true
    },
    {
        title: "Students",
        id: "students",
        icon: GraduationCapIcon,
        // component: StudentsPage,
        component: markRaw(StudentsPage),
        main: true
    },
    {
        title: "Lab",
        id: "lab",
        icon: PencilRulerIcon,
        component: markRaw(LabPage),
        main: true
    },
    {
        title: "Teams",
        id: "teams",
        icon: UsersIcon,
        component: markRaw(TeamsPage),
        main: true
    },
    {
        title: "Info",
        id: "info",
        icon: InfoIcon,
        component: markRaw(InfoPage),
        main: true
    },
    // {
    //     title: "Settings",
    //     id: "settings",
    //     icon: SettingsIcon,
    //     component: SettingsPage,
    //     main: true
    // }
]);
const students = useStudentsStore();
const teams = useTeamsStore();
const packages = usePackagesStore();
const settings = useSettingsStore();
const util = useUtilitiesStore();
const currentPage = ref("home");
function closeWindow() {
    window.electron.closeWindow();
}
function maximizeWindow() {
    if (windowMaximized.value) {
        window.electron.unmaximizeWindow();
    } else {
        window.electron.maximizeWindow();
    }
}
function minimizeWindow() {
    window.electron.minimizeWindow();
}
async function windowIsMaximized(): Promise<boolean> {
    return window.electron.windowIsMaximized();
}
const windowMaximized = ref(false);
window.electron.onMaximize((bool: boolean) => {
    // console.log(bool);
    windowMaximized.value = bool;
});
onMounted(async () => {
    windowMaximized.value = await windowIsMaximized();
    // console.log(windowMaximized.value);
});
const toolTip = ref("Made w/ ♥");
const infoNodes = ref<{
    text: string
}[]>([]);
infoNodes.value.push({text: "Hey"});
infoNodes.value.push({text: "Made w/ ♥"});

window.electron.onTooltipUpdate((text: string) => {
    // console.log(text);
    toolTip.value = text;
});
document.addEventListener('mousedown', function(event) {
  if (event.detail > 1) {
    event.preventDefault();
    // of course, you still do not know what you prevent here...
    // You could also check event.ctrlKey/event.shiftKey/event.altKey
    // to not prevent something useful.
  }
}, false);
</script>
<template>
    <div class="flex flex-col bottom-0 top-0 left-0 right-0 absolute">
        <div class="flex flex-row bg-gray-darker">
            <TitleBarButton @click="sidebarDeployed = !sidebarDeployed">
                <SidebarCloseIcon v-if="sidebarDeployed" :size="18" :stroke-width="1"></SidebarCloseIcon>
                <SidebarOpenIcon v-else :size="18" :stroke-width="1"></SidebarOpenIcon>
            </TitleBarButton>
            <div class=" region-drag grow"></div>
            <TitleBarButton :icon="MinusIcon" wide @click="minimizeWindow"></TitleBarButton>
            <TitleBarButton wide small @click="maximizeWindow">
                <CopyIcon v-if="windowMaximized" :size="13" class=" rotate-90" :stroke-width="1"></CopyIcon>
                <SquareIcon v-else :size="13" :stroke-width="1"></SquareIcon>
            </TitleBarButton>
            <TitleBarButton :icon="XIcon" wide red @click="closeWindow"></TitleBarButton>
        </div>
        <div class="flex flex-row flex-grow overflow-y-hidden">
            <Sidebar :pages="pages" :deployed="sidebarDeployed" :current-page="currentPage" @page-select="(selectedPage) => currentPage = selectedPage"></Sidebar>
            <component v-for="page of pages" :is="page.component" :page="page" :current-page="currentPage" :key="page.id"></component>
        </div>
        <div class="flex flex-row bg-gray-dark select-none gap-2 px-2 text-xs text-white font-mono items-center">
            <div class=" p-1" >
                Info: <span class=" first-letter:uppercase inline-block">{{ util.tooltip }}</span>
            </div>
            <div class="grow"></div>
            <!-- <div class=" p-1">Made w/ love</div> -->
        </div>
    </div>
</template>