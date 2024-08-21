export class Package {
    public name?: string;
    public teams: string[] = [];
    public id: string;
    constructor(init?: Partial<Package>) {
        this.id = Date.now().toString(36) + Math.random().toString(36).substring(2);
        Object.assign(this, init);
    }
}
export interface IPackage extends Package {}