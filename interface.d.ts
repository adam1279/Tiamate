import { Data, IStudent, Student, ipcInterface } from "src/classes";

declare global {
    interface Window {
        electron: ipcInterface,
        data: Data
    }
}