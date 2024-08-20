import { Belbin } from "./Belbin";

export class Student {
    public name: string;
    public roles: Belbin[] = [];
    public previousTeams: string[] = [];
    public gender: Student.Gender | string;
    // public currentTeam?: string;
    public id: string;
    public editing?: boolean;
    public adding?: boolean;
    public previewing?: boolean;
    public state: Student.State = "unassigned";
    public selected: boolean = false;
    constructor(init?: Partial<Student>) {
        this.id = Date.now().toString(36) + Math.random().toString(36).substring(2);
        const genderLang = {
            "Mand": "man",
            "Kvinde": "woman",
            "Ikke-binær": "non-binary"
        };
        if (init?.gender in genderLang) init.gender = genderLang[init.gender as keyof typeof genderLang];
        // Object.keys(init).forEach((key: keyof typeof init) => {
        //     console.log(key);
        //     console.log(key in Student)
        //     if ((key in Student)) {
        //         // delete init[key];
        //         // console.log(key);
        //     }
        // })
        Object.assign(this, init);
    }
}
export module Student {
    export type State = "unassigned" | "moving" | "assigned";
    export type Gender = "man" | "woman" | "non-binary";
}
export interface IStudent extends Student {}