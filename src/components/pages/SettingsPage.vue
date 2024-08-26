<script setup lang="ts">
import { IPage as _Page } from "src/ipc";
import Page from "../Page.vue"
import { onMounted, ref } from "vue";
import OptionsDropdown from "../OptionsDropdown.vue";
import { ChevronDownIcon, LanguagesIcon, UsersIcon } from "lucide-vue-next";
import Widget from "../Widget.vue";
import PageSection from "../PageSection.vue";
import { Language, languages, useSettingsStore } from "../../stores/useSettings";
import { language } from "src/language";
import SettingComponent from "../SettingComponent.vue";
const props = defineProps<{
    page: _Page,
    currentPage: string
}>();
const settings = useSettingsStore();
</script>
<template>
    <Page :page="page" :current-page="currentPage">
        <PageSection :title="t('language')" :icon="LanguagesIcon">
            <Widget class="grow grid">
                <span class=" inline-block first-letter:uppercase grow">{{ t("language") }}</span>
                <div class="">
                    <OptionsDropdown
                        :options="languages.map(language => (
                            {
                                text: t(language),
                                value: language
                            }
                        ))"
                        v-model="settings.all.language"
                    >
                        <div class="flex bg-white cursor-pointer capitalize">
                            {{ t(settings.all.language) }}
                            <ChevronDownIcon></ChevronDownIcon>
                        </div>
                    </OptionsDropdown>

                </div>
                <SettingComponent :title="t('language')"
                    :options="languages.map(language => (
                        {
                            text: t(language),
                            value: language
                        }
                    ))"
                    v-model="settings.all.language"
                >
                    
                </SettingComponent>
            </Widget>

        </PageSection>
        <!-- <PageSection :title="`${t('team')}${t('connectingSpace')}${t('setting', 2)}`" :icon="UsersIcon">
            <Widget class="grow">
                <div class="flex">
                    <span class="first-letter:uppercase">{{ t('member limit') }}</span>
                    <input class="" type="number" v-model.number="settings.all.memberLimit" @focusout="() => {if (typeof settings.all.memberLimit == 'string') settings.all.memberLimit = 6}">
                </div>
            </Widget>
        </PageSection> -->
        <!-- <input v-model="$i18n.locale"> -->
    </Page>
</template>