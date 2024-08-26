import { ipcInterface } from "src/ipc";

declare global {
    interface Window {
        electron: ipcInterface,
        data: Data
    }
}