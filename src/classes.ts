import { ipcRenderer } from "electron";
// import { CogIcon, CrosshairIcon, HeartHandshakeIcon, LightbulbIcon, MegaphoneIcon, PhoneIcon, RocketIcon, SearchIcon, WrenchIcon } from "lucide-vue-next";
import { LanguageVariant } from "typescript";
import { Component } from "vue";
import { Translations } from "vue3-gettext";
import { IPackage } from "./stores/usePackages";
import { ISettings, Language } from "./stores/useSettings";
import { IStudent } from "./classes/Student";
import { ITeam } from "./classes/Team";

export interface IPage {
    title: string,
    id: string,
    icon: Component,
    component: Component,
    main?: boolean
};
// export interface Data {
//     students: Student[],
//     teams: Team[],
//     packages: Package[]
// }
export interface Data {
    students: IStudent[],
    teams: ITeam[],
    packages: IPackage[],
    settings: ISettings
}
export type DataKey = "students" | "teams" | "packages";
type IpcType = { [K: string]: ((...args: any[]) => any) | ((callback: Function) => any ) | IpcType };
export const ipcKeys: IpcType = {
    closeWindow: () => ipcRenderer.invoke("closeWindow"),
    minimizeWindow: () => ipcRenderer.invoke("minimizeWindow"),
    maximizeWindow: () => ipcRenderer.invoke("maximizeWindow"),
    windowIsMaximized: () => ipcRenderer.invoke("windowIsMaximized"),
    unmaximizeWindow: () => ipcRenderer.invoke("unmaximizeWindow"),
    onMaximize: (callback: Function) => ipcRenderer.on("onMaximize", (e, bool: boolean) => callback(bool)),
    updateTooltip: (text: string) => ipcRenderer.invoke("updateTooltip", text),
    onTooltipUpdate: (callback: Function) => ipcRenderer.on("onTooltipUpdate", (e, text: string) => callback(text)),
    data: {
        set: (key: DataKey, value: string) => ipcRenderer.invoke("data:set", key, value),
        get: () => ipcRenderer.invoke("data:get"),
        onUpdate: (callback: Function) => ipcRenderer.on("data:update", (e, data: Data, changedKey: string) => callback(data, changedKey)),
        new: (type: DataKey) => ipcRenderer.invoke("data:new", type),
        assign: (type: DataKey, ids: string[] | string, destination?: string) => ipcRenderer.invoke("data:assign", type, ids, destination)
    },
    printToPDF: () => ipcRenderer.invoke("printToPDF"),
    downloadTemplate: () => ipcRenderer.invoke("downloadTemplate"),
    importTemplate: (language: Language) => ipcRenderer.invoke("importTemplate", language),
    globalUpdate: (jsonData: string) => ipcRenderer.invoke("globalUpdate", jsonData)
    // BelbinIcons: () => BelbinIcons
};
console.log(typeof ipcKeys);
// export type ipcInterface = typeof ipcKeys;
export interface ipcInterface {
    closeWindow: () => Promise<void>,
    minimizeWindow: () => Promise<void>,
    maximizeWindow: () => Promise<void>,
    windowIsMaximized: () => Promise<boolean>,
    unmaximizeWindow: () => Promise<void>,
    onMaximize: (callback: Function) => boolean,
    updateTooltip: (text: string) => Promise<void>,
    onTooltipUpdate: (callback: Function) => string,
    data: {
        set: (key: DataKey, value: string) => Promise<void>
        get: () => Promise<Data>,
        onUpdate: (callback: (data: Data, changedKey: string) => void) => Data,
        new: (type: DataKey) => Promise<number>,
        assign: (type: DataKey, ids: string[] | string, destination?: string) => Promise<void>
    },
    printToPDF: () => Promise<void>,
    downloadTemplate: () => Promise<void>,
    importTemplate: (language: Language) => Promise<IStudent[]>,
    globalUpdate: (jsonData: string) => Promise<void>
}


// export class Student {
//     public name: string;
//     public roles: Belbin[] = [];
//     public previousTeams: string[] = [];
//     public currentTeam?: string;
//     public id: string;
//     public editing?: boolean;
//     public adding?: boolean;
//     public previewing?: boolean;
//     public state: "unassigned" | "moving" | "assigned" = "unassigned";
//     constructor(init?: Partial<Student>) {
//         this.id = Date.now().toString(36) + Math.random().toString(36).substring(2);
//         Object.assign(this, init);
//     }
// }
// export class Team {
//     public name?: string;
//     public members: string[] = [];
//     public previewMembers: string[] = [];
//     public id: string;
//     public state: "proposed" | "packaged" | "unpackaged" | "previous" = "proposed";
//     public currentPackage: string;
//     constructor(init?: Partial<Team>) {
//         this.id = Date.now().toString(36) + Math.random().toString(36).substring(2);
//         Object.assign(this, init);
//     }
//     // public addMember(member: Student, previous?: boolean) {
//     //     this.members.push(member.id);
//     //     if (previous) member.previousTeams.push(this.id);
//     // }
//     // public removeMember(memberId: string) {
//     //     const index = this.members.indexOf(memberId);
//     //     if (index > -1) this.members.splice(index, 1);
//     // }
// }
// export class Package {
//     public name?: string;
//     public teams: string[] = [];
//     public id: string;
//     constructor(init?: Partial<Package>) {
//         this.id = Date.now().toString(36) + Math.random().toString(36).substring(2);
//         Object.assign(this, init);
//     }
// }
// export interface IStudent extends Student {

// }
// export interface ITeam extends Team {

// }
// export interface IPackage extends Package {

// }