/**
 * This file will automatically be loaded by vite and run in the "renderer" context.
 * To learn more about the differences between the "main" and the "renderer" context in
 * Electron, visit:
 *
 * https://electronjs.org/docs/tutorial/application-architecture#main-and-renderer-processes
 *
 * By default, Node.js integration in this file is disabled. When enabling Node.js integration
 * in a renderer process, please be aware of potential security implications. You can read
 * more about security risks here:
 *
 * https://electronjs.org/docs/tutorial/security
 *
 * To enable Node.js integration in this file, open up `main.ts` and enable the `nodeIntegration`
 * flag:
 *
 * ```
 *  // Create the browser window.
 *  mainWindow = new BrowserWindow({
 *    width: 800,
 *    height: 600,
 *    webPreferences: {
 *      nodeIntegration: true
 *    }
 *  });
 * ```
 */

import './index.css';

import { createApp } from "vue";
import App from "./App.vue";
import { createI18n } from 'vue-i18n';
import { createPinia } from 'pinia';
import { language } from './language';
// import translations from "./src/language/translations.json";
async function languageSetup() {
    
}
(async () => {
    let lang = await window.electron.settings.get("language") as string;
    const i18n = createI18n({
        legacy: false,
        locale: lang,
        fallbackLocale: "en",
        messages: language
    });
    const pinia = createPinia();
    const app = createApp(App);
    app.use(i18n);
    app.use(pinia);
    app.mount("#app");
})();

// window.electron.lang().then((t) => {
//     app.use(createGettext({translations: t}));
//     app.mount("#app");
// });