import { defineStore } from "pinia";
import { computed, onMounted, ref, watch } from "vue";
// import { useI18n } from "vue-i18n";
import { useUtilitiesStore } from "./useUtilities";
export interface ISetting<T> {
    value: T,
    text: string
}
export const languages = ["da", "en"] as const;
export type Language = typeof languages[number];
export const exportFileTypes = ["pdf", "xlsx"] as const;
export type ExportFileType = typeof exportFileTypes[number];
export const defaultSettings = {
    memberLimit: 5,
    language: "da" as Language,
    lockOnMemberLimitReached: false,
    tabsLinked: true,
    automation: {
        minBalance: 0.65,
        trialLimit: 1000,
        maxUnfilledRoles: 2
    },
    resetOnPackaging: true,
    export: {
        fileType: "xlsx" as ExportFileType,
        openFile: false,
        openInFolder: false,
        includeCompass: true,
        includeStats: true,
        portrait: false
    }
};
export type ISettings = typeof defaultSettings;
export const useSettingsStore = defineStore("settings", () => {
    // const { t, locale } = useI18n();
    const all = ref({...defaultSettings, automation: {...defaultSettings.automation}});
    const allDefault = ref(defaultSettings);
    const mounted = ref(false);
    const util = useUtilitiesStore();
    const { t } = util;
    async function init() {
        let savedSettings = (await window.electron.data.get())?.settings;
        if (savedSettings) {
            savedSettings.automation = Object.assign(all.value.automation, savedSettings.automation || {});
            savedSettings.export = Object.assign(all.value.export, savedSettings.export || {});
            Object.assign(all.value, savedSettings);
        }
        // if (savedSettings) {
        //     const [automation, _export] = (["automation", "export"] as (keyof ISettings)[]).map(subObject => {
        //         return Object.assign(all.value[subObject], savedSettings[subObject]);
        //     });
        //     Object.assign(all.value, savedSettings);
        // }
        return all.value;
    }
    onMounted(async () => {
        await init();
        mounted.value = true;
        console.log("useSettings mounted");
        // locale.value = all.value.language;
    });
    // watch(() => all.value.language, (newLanguage, oldLanguage) => {
    //     if (newLanguage != oldLanguage) locale.value = newLanguage;
    // });
    // const memberLimit = ref<Setting<number>>({
    //     value: 6,
    //     text: "member limit"
    // });
    // const language = ref<Setting<string>>({
    //     value: "da",
    //     text: "language"
    // });
    // const all = {
    //     memberLimit,
    //     language
    // };
    return {
        all,
        allDefault,
        init,
        mounted
    };
});