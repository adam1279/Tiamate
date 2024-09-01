import { Student } from "./Student";

export class Team {
    public name?: string;
    public members: string[] = [];
    // public previewMembers: string[] = [];
    public id: string;
    public state: Team.State = "proposed";
    public customLimit?: number;
    public full: boolean = false;
    public currentPackage: string;
    public locked: boolean = false;
    constructor(init?: Partial<Team>) {
        this.id = Date.now().toString(36) + Math.random().toString(36).substring(2);
        Object.assign(this, init);
    }
    assignStudent(...students: Student[]) {
        students.forEach((student) => {
            this.members.push(student.id);
            student.state = "assigned";
        });
    }
    // public addMember(member: Student, previous?: boolean) {
    //     this.members.push(member.id);
    //     if (previous) member.previousTeams.push(this.id);
    // }
    // public removeMember(memberId: string) {
    //     const index = this.members.indexOf(memberId);
    //     if (index > -1) this.members.splice(index, 1);
    // }
}
export module Team {
    export type State = "proposed" | "packaged" | "unpackaged" | "previous";
}
export interface ITeam extends Team {}