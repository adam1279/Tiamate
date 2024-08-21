import { app, BrowserWindow, dialog, ipcMain, ipcRenderer } from 'electron';
import path from 'path';
import { Data, DataKey } from './classes';
import fs from "fs";
import * as XLSX from "xlsx";
import readXlsxFile from 'read-excel-file/node';
import convertToJson from "read-excel-file/map"
import { IStudent, Student } from './classes/Student';
import { Schema } from 'read-excel-file';
import { Belbin } from './classes/Belbin';
import { Language } from './stores/useSettings';
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
const createWindow = () => {
	// Create the browser window.
	mainWindow = new BrowserWindow({
		minWidth: 800,
		minHeight: 600,
		webPreferences: {
			preload: __dirname + '/preload.js'
		},
		frame: false,
		icon: 'src/icons/icon.ico',
		show: false
	});
	mainWindow.maximize();
	mainWindow.show();
	// and load the index.html of the app.
	if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
		mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
	} else {
		mainWindow.loadFile(path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`));
	}

	// Open the DevTools.
	// mainWindow.webContents.openDevTools();

	mainWindow.on("maximize", () => {
		// console.log(true);
		mainWindow.webContents.send("onMaximize", true);
	});
	mainWindow.on("unmaximize", () => {
		// console.log(false);
		mainWindow.webContents.send("onMaximize", false);
	});
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.

let data: Partial<Data>;
let dataString: string = "";
const ipcKeys: {
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
	"data:get": () => {
		return data;
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
	downloadTemplate: async () => {
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
			fs.promises.copyFile("src/template_da.xlsx", saveDialog.filePath);
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
			const { rows, errors } = await readXlsxFile(Buffer.from(fs.readFileSync(openDialog.filePaths[0])), { schema: schemas[language] as Schema });
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
		console.log(dataString);
		const appData = app.getPath("appData");
		fs.promises.writeFile(path.join(appData, "data.json"), dataString);
		// data = JSON.parse((await fs.promises.readFile(path.join(app.getPath("appData"), "data.json"))).toString("utf-8"));
	}
};
app.on('ready', async () => {
	// if (!fs.existsSync(path.join(app.getPath("userData"), "settings.json"))) setSetting("language", "da");
	if (fs.existsSync(path.join(app.getPath("appData"), "data.json"))) {
		console.log(path.join(app.getPath("appData"), "data.json"));
		data = JSON.parse((await fs.promises.readFile(path.join(app.getPath("appData"), "data.json"))).toString("utf-8"));
	}
	for (let ipcKey of Object.keys(ipcKeys)) {
		ipcMain.handle(ipcKey, ipcKeys[ipcKey]);
	}
	createWindow();

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
		createWindow();
	}
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
interface XlsxStudent {
	name: string,
	gender: "Mand" | "Kvinde" | "Ikke-binær",
	initialPreviousTeams: string,
	previousTeams?: string[]
	initialRoles: {
		[k: string]: number
	}
	roles?: Belbin[]
};
const daSchema = {
	"NAVN": {
		prop: "name",
		type: String
	},
	"KØN": {
		prop: "gender",
		type: String,
		oneOf: [
			"Mand",
			"Kvinde",
			"Ikke-binær"
		]
	},
	"TIDL. GRUPPER": {
		prop: "initialPreviousTeams",
		type: String
	},
	"BELBIN ROLES": {
		prop: "initialRoles",
		type: {
			"KOORDINATOR": {
				prop: "Co-ordinator",
				type: Number,
				format: "0%"
			},
			"FORMIDLER": {
				prop: "Teamworker",
				type: Number,
				format: "0%"
			},
			"KONTAKTSKABER": {
				prop: "Resource Investigator",
				type: Number,
				format: "0%"
			},
			"OPSTARTER": {
				prop: "Shaper",
				type: Number,
				format: "0%"
			},
			"AFSLUTTER": {
				prop: "Completer Finisher",
				type: Number,
				format: "0%"
			},
			"SPECIALIST": {
				prop: "Specialist",
				type: Number,
				format: "0%"
			},
			"IDÉMAND": {
				prop: "Plant",
				type: Number,
				format: "0%"
			},
			"ANALYSATOR": {
				prop: "Monitor Evaluator",
				type: Number,
				format: "0%"
			},
			"ORGANISATOR": {
				prop: "Implementer",
				type: Number,
				format: "0%"
			}
		}
	}
};
const enSchema = {
	"NAME": {
		prop: "name",
		type: String
	},
	"GENDER": {
		prop: "gender",
		type: String,
		oneOf: [
			"Mand",
			"Kvinde",
			"Ikke-binær"
		]
	},
	"PREV. TEAMS": {
		prop: "initialPreviousTeams",
		type: String
	},
	"BELBIN ROLES": {
		prop: "initialRoles",
		type: {
			"CO-ORDINATOR": {
				prop: "Co-ordinator",
				type: Number,
				format: "0%"
			},
			"TEAMWORKER": {
				prop: "Teamworker",
				type: Number,
				format: "0%"
			},
			"RESOURCE INVESTIGATOR": {
				prop: "Resource Investigator",
				type: Number,
				format: "0%"
			},
			"SHAPER": {
				prop: "Shaper",
				type: Number,
				format: "0%"
			},
			"COMPLETER FINISHER": {
				prop: "Completer Finisher",
				type: Number,
				format: "0%"
			},
			"SPECIALIST": {
				prop: "Specialist",
				type: Number,
				format: "0%"
			},
			"PLANT": {
				prop: "Plant",
				type: Number,
				format: "0%"
			},
			"MONITOR EVALUATOR": {
				prop: "Monitor Evaluator",
				type: Number,
				format: "0%"
			},
			"IMPLEMENTER": {
				prop: "Implementer",
				type: Number,
				format: "0%"
			}
		}
	}
};
const schemas: Record<Language, Schema> = {
	"da": daSchema,
	"en": enSchema
}
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
