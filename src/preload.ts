// See the Electron documentation for details on how to use preload scripts:

import { contextBridge } from "electron";
import { ipcKeys } from "./ipc";

// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
contextBridge.exposeInMainWorld("electron", ipcKeys);