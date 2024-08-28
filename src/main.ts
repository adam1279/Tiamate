import { app, BrowserWindow, dialog, ipcMain, ipcRenderer, shell } from 'electron';
import path from 'path';
import { Data, DataKey } from './ipc';
import fs from "fs";
import * as XLSX from "xlsx";
import readXlsxFile from 'read-excel-file/node';
import convertToJson from "read-excel-file/map"
import { IStudent, Student } from './classes/Student';
import { Schema } from 'read-excel-file';
import { Belbin } from './classes/Belbin';
import { ExportFileType, Language } from './stores/useSettings';
import { mergedSchema, schemas, XlsxStudent } from './xlsx';
// import { IStudent, Student } from './stores/useStudents';
// import * as cptable from 'xlsx/dist/cpexcel.full.mjs';
// XLSX.set_cptable(cptable);
// XLSX.set_cptable("iso-8859-1");
// import { promises, readFile, readFileSync } from 'original-fs';
// import { Translations } from 'vue3-gettext';
// const EXTENSIONS = "xls|xlsx|xlsm|xlsb|xml|csv|txt|dif|sylk|slk|prn|ods|fods|htm|html|numbers".split("|");

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
	app.quit();
}
let mainWindow: BrowserWindow;
// const createWindow = (construct?: Partial<Electron.BrowserWindowConstructorOptions>, search: string = "") => {
const windowNames = ["main", "print"] as const;
type WindowName = typeof windowNames[number];
const createWindow = (name: WindowName, construct?: Partial<Electron.BrowserWindowConstructorOptions>) => {
	// Create the browser window.
	const { show, ...constructRest } = construct || {show: false};
	const params: Electron.BrowserWindowConstructorOptions = {
		minWidth: 800,
		minHeight: 600,
		webPreferences: {
			preload: __dirname + '/preload.js',
			nodeIntegration: false,
			contextIsolation: true
		},
		frame: false,
		icon: 'src/icons/icon.ico',
		show: false
	};
	Object.assign(params, constructRest);
	const window = new BrowserWindow(params);
	let _url: string;
	let _name: string;
	switch (name) {
		case 'main':
			_url = MAIN_WINDOW_VITE_DEV_SERVER_URL;
			_name = MAIN_WINDOW_VITE_NAME;
			// _name = "";
			break;
		case 'print':
			_url = PRINT_WINDOW_VITE_DEV_SERVER_URL;
			_name = `${PRINT_WINDOW_VITE_NAME}`;
			break;
	}
	// and load the index.html of the app.
	if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
		console.log(MAIN_WINDOW_VITE_DEV_SERVER_URL);
		console.log(MAIN_WINDOW_VITE_NAME);
		// console.log(path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html${search}`));
		// window.loadURL(`${MAIN_WINDOW_VITE_DEV_SERVER_URL}${search}`);
		window.loadURL(_url);
	} else {
		// window.loadFile(path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`));
		window.loadFile(path.join(__dirname, `../renderer/${_name}/index.html`));
	}
	if (show) window.show();
	// Open the DevTools.
	// mainWindow.webContents.openDevTools();

	window.on("maximize", () => {
		// console.log(true);
		window.webContents.send("onMaximize", true);
	});
	window.on("unmaximize", () => {
		// console.log(false);
		window.webContents.send("onMaximize", false);
	});
	return window;
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.

let data: Partial<Data>;
let dataString: string = "";
const dataFilePath = path.join(app.getPath("userData"), "data.json");
export const ipcFunctions: {
	[K: string]: (event: Electron.IpcMainInvokeEvent, ...args: any[]) => any
} = {
	closeWindow: () => {
		mainWindow?.close();
	},
	minimizeWindow: () => {
		mainWindow?.minimize();
	},
	maximizeWindow: () => {
		mainWindow?.maximize();
	},
	windowIsMaximized: () => {
		return mainWindow?.isMaximized();
	},
	unmaximizeWindow: () => {
		mainWindow?.unmaximize();
	},
	updateTooltip: (e, text: string) => {
		mainWindow.webContents.send("onTooltipUpdate", text);
	},
	// "data:set": (e, key: DataKey, value: string) => {
	// 	console.log(key);
	// 	console.log(value);
	// 	data[key] = JSON.parse(value);
	// 	mainWindow.webContents.send("data:update", data, "students");
	// },
	"data:get": async () => {
		// return data;
		return getData();
		// return 
	},
	// "data:new": (e, type: DataKey, state?: string): string => {
	// 	switch (type) {
	// 		case "students":
	// 			let student = new Student({ adding: true, state: state as ("unassigned" | "moving" | "assigned" | undefined) });
	// 			data.students.push(student);
	// 			mainWindow.webContents.send("data:update", data, type);
	// 			return student.id;
	// 		case "teams":
	// 			let team = new Team();
	// 			data.teams.push(team);
	// 			mainWindow.webContents.send("data:update", data, type);
	// 			return team.id;
	// 		case "packages":
	// 			let _package = new Package();
	// 			data.packages.push(_package);
	// 			mainWindow.webContents.send("data:update", data, type);
	// 			return _package.id;
	// 	}
	// },
	printToPDF: async () => {
		const saveDialog = await dialog.showSaveDialog(mainWindow, {
			title: "Save to PDF",
			filters: [
				{
					extensions: ["pdf"],
					name: "PDF"
				}
			]
		});
		if (saveDialog.canceled) return;
		const data = await mainWindow.webContents.printToPDF({
			landscape: true,
			scale: 2,
			pageSize: "A4",
			margins: {
				top: 0,
				bottom: 0,
				left: 0,
				right: 0
			},
			printBackground: true,
			preferCSSPageSize: true
		});
		fs.promises.writeFile(saveDialog.filePath, data);
	},
	downloadTemplate: async (e, language: Language) => {
		// console.log(path.join(__dirname, "template_da.xlsx"));
		const saveDialog = await dialog.showSaveDialog(mainWindow, {
			title: "Download template",
			filters: [
				{
					extensions: ["xlsx"],
					name: "Excel file"
				}
			]
		});
		// console.log(path.join(__dirname, "template_da.xlsx"));
		if (!saveDialog.canceled) {
			fs.promises.copyFile(`src/template_${language}.xlsx`, saveDialog.filePath);
		}
	},
	importTemplate: async (e, language: Language) => {
		const openDialog = await dialog.showOpenDialog(mainWindow, {
			title: "Import template",
			filters: [
				{
					extensions: ["xlsx"],
					name: "Spreadsheet file"
				}
			],
			properties: [
				"openFile"
			]
		});
		if (!openDialog.canceled) {
			// console.log(0);
			const { rows, errors } = await readXlsxFile(Buffer.from(fs.readFileSync(openDialog.filePaths[0])), { schema: schemas[language] });
			// const { rows, errors } = await readXlsxFile(Buffer.from(fs.readFileSync(openDialog.filePaths[0])), { schema: mergedSchema as Schema });
			console.log(rows);
			// console.log(1);
			const importedStudents = rows as unknown as XlsxStudent[];
			// console.log(2);
			const newStudents: IStudent[] = [];
			// console.log(3);
			for (let importedStudent of importedStudents) {
				// console.log(importedStudent);
				importedStudent.roles = Object.entries(importedStudent.initialRoles).map(v => { return { "role": v[0], "percentage": v[1] } }) as Belbin[];
				delete importedStudent.initialRoles
				// importedStudent.previousTeams = importedStudent.initialPreviousTeams.replaceAll(" ", "").split(/[,;|]/).map(teamName => {
				//   // console.log(teamName);
				//   const id = data.teams.find(({name}) => name == teamName)?.id;
				//   if (id == undefined) {
				//     const team = new Team({state: "previous", name: teamName});
				//     data.teams.push(team);
				//     // console.log(data.teams);
				//     return team.id;
				//   } else {
				//     return id;
				//   }
				// });
				importedStudent.previousTeams = importedStudent.initialPreviousTeams?.replaceAll(" ", "").split(/[,;|]/);
				delete importedStudent.initialPreviousTeams;
				newStudents.push(new Student(importedStudent));
			}
			// data.students.push(...newStudents);
			// mainWindow.webContents.send("data:update", data, "students");
			return newStudents;
			// const {rows} = convertToJson(rows, schema, {});
			// return rows;
			// console.log(rows);
			// const workbook = XLSX.readFile(openDialog.filePaths[0]);

			// return XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]], {header: ["name", "gender", "previousTeams"]});
			// const file = XLSX.read(openDialog.filePaths[0])
			// console.log(XLSX.utils.sheet_to_html(file.Sheets[file.SheetNames[0]], {editable: true}));
			// const xlsx = XLSX.readFile(openDialog.filePaths[0], {type: "file", codepage: 28591});
			// console.log(XLSX.utils.sheet_to_json(xlsx.Sheets[xlsx.SheetNames[0]]));
			// console.log(Buffer.from('S├©ren', "utf-8").toString());
		}
	},
	globalUpdate: async (e, jsonData: string) => {
		dataString = jsonData;
		// data = JSON.parse(dataString);
		// console.log(dataString);
		// const appData = app.getPath("appData");
		fs.promises.writeFile(dataFilePath, dataString);
		// data = JSON.parse((await fs.promises.readFile(path.join(app.getPath("appData"), "data.json"))).toString("utf-8"));
	},
	downloadExport: async (e, jsonData?: string) => {
		const { settings } = await getData();
		const { fileType, openFile, openInFolder, portrait } = settings.export;
		const extName: Record<ExportFileType, string> = {
			"pdf": "PDF file",
			"xlsx": "Excel file"
		}
		console.log(fileType, extName[fileType]);
		const saveDialog = await dialog.showSaveDialog(mainWindow, {
			title: "Download export",
			filters: [
				{
					extensions: [fileType],
					name: extName[fileType]
				}
			],
			
		});
		let ret: boolean;
		if (!saveDialog.canceled) {
			switch (fileType) {
				case 'xlsx':
					if (jsonData) {
						console.log(jsonData);
						const parsedData: {
							[packageName:string]: {
								name: string,
								members: string[],
								stats?: {
									belbinEval: number,
									averagePreviousTeamMembers: number
								}
							}[]
						} = JSON.parse(jsonData);
						const workbook = XLSX.utils.book_new();
						let maxWidth = 10;
						let columnCounts: number[] = [];
						Object.entries(parsedData).forEach(([name, teams]) => {
							columnCounts.push(teams.length);
							const maxMemberCount = teams.reduce((p, c) => p = Math.max(c.members.length, p), 0);
							const rows: {[k:string]: string}[] = []
							for (let i = 0; i < maxMemberCount; i++) {
								const row: {[k:string]: string} = {};
								teams.forEach(team => {
									row[team.name] = team.members[i];
									maxWidth = Math.max(maxWidth, team.members[i]?.length || 0, team.name.length);
								});
								rows.push(row);
							}
							// const worksheet = XLSX.utils.json_to_sheet(teams.map(team => ({name: team.teamName, members: team.teamMembers.toString()})));
							const worksheet = XLSX.utils.json_to_sheet(rows);
							XLSX.utils.book_append_sheet(workbook, worksheet, name);
						});
						Object.entries(workbook.Sheets).forEach(([name, sheet], index) => {
							sheet['!cols'] = Array(columnCounts[index]).fill({wch: maxWidth});
						});
						XLSX.writeFile(workbook, saveDialog.filePath);
						ret = true;
						break;
					} else {
						ret = false;
						break;
					}
				case 'pdf':
					const printWindow = createWindow("print", {show: false, title: "Print Tiamate Packages"});
					ret = await new Promise<boolean>((resolve, reject) => {
						printWindow.webContents.on("did-finish-load", () => {
							setTimeout(async () => {
								
								printWindow.webContents.printToPDF({
									printBackground: true,
									landscape: !portrait,
									pageSize: "A4",
									// footerTemplate: `<div id="header-template">
									// 					<span class="pageNumber" style="float: right;"></span>
									// 				</div>`,
									// displayHeaderFooter: true
								}).then(data => {
									fs.writeFile(saveDialog.filePath, data, (error) => {
										// if (error) throw error
										if (error) resolve(false);
										console.log(`Wrote PDF successfully to ${saveDialog.filePath}`);
										resolve(true);
									})
								}).catch(error => {
									console.log(`Failed to write PDF to ${saveDialog.filePath}: `, error);
									resolve(false);
								});
								const printData = await printWindow.webContents.printToPDF({});
							}, 1000);
						});
					});
					printWindow.close();
					break;
			}
			if (ret && openFile) shell.openPath(saveDialog.filePath);
			if (ret && openInFolder) shell.showItemInFolder(saveDialog.filePath);
			return ret;
		}
	},
	openUrl: (e, url: string) => {
		return shell.openExternal(url);
	}
};
async function getData() {
	const fileString = (await fs.promises.readFile(dataFilePath)).toString("utf-8");
	if (fileString[0] == "{" && fileString[fileString.length - 1] == "}") {
		return JSON.parse(fileString) as Partial<Data>;
	}
}
app.on('ready', async () => {
	// if (!fs.existsSync(path.join(app.getPath("userData"), "settings.json"))) setSetting("language", "da");
	console.log(dataFilePath);
	if (fs.existsSync(dataFilePath)) {
		const fileString = (await fs.promises.readFile(dataFilePath)).toString("utf-8");
		if (fileString[0] == "{" && fileString[fileString.length - 1] == "}") {
			data = JSON.parse(fileString);
		}
	}
	for (let ipcKey of Object.keys(ipcFunctions)) {
		ipcMain.handle(ipcKey, ipcFunctions[ipcKey]);
	}
	mainWindow = createWindow("main", {title: "Tiamate"});
	mainWindow.maximize();
	mainWindow.on("closed", () => {
		app.quit();
	})
});
// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
	// const appData = app.getPath("appData");
	// // fs.promises.writeFile(path.join(appData, "data.json"), JSON.stringify(data));
	// fs.promises.writeFile(path.join(appData, "data.json"), dataString);
	if (process.platform !== 'darwin') {
		app.quit();
	}
});

app.on('activate', () => {
	// On OS X it's common to re-create a window in the app when the
	// dock icon is clicked and there are no other windows open.
	if (BrowserWindow.getAllWindows().length === 0) {
		mainWindow = createWindow("main", {title: "Tiamate"});
	}
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.

// const schema = [
//   {
//     column: "NAVN",
//     type: String,
//     value: (student: XlsxStudent) => student.name
//   },
//   {
//     column: "KØN",
//     type: String,
//     value: (student: XlsxStudent) => student.gender
//   },
//   {
//     column: "TIDL. GRUPPER",
//     type: String,
//     value: (student: XlsxStudent) => student.previousTeams
//   },
//   {
//     column: "ORGANISATOR",
//     type: Number,
//     value: (student: XlsxStudent) => student.implementer,
//     format: "0%"
//   }
// ];
