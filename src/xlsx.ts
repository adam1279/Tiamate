import { Schema } from "read-excel-file";
import { Belbin } from "./classes/Belbin";
import { Language } from "./stores/useSettings";

export interface XlsxStudent {
	name: string,
	gender: "Mand" | "Kvinde" | "Ikke-binær" | "Man" | "Woman" | "Non-binary",
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
			"Man",
			"Woman",
			"Non-binary"
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
export const schemas: Record<Language, Schema> = {
	"da": daSchema,
	"en": enSchema,
}
export const mergedSchema = {...daSchema, ...enSchema};