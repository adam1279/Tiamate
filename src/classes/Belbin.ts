import { CogIcon, createLucideIcon, HeartHandshakeIcon, LightbulbIcon, LucideProps, MegaphoneIcon, MicroscopeIcon, PhoneIcon, RocketIcon, WrenchIcon } from "lucide-vue-next";
import { crosshair2 } from "@lucide/lab";
import { FunctionalComponent } from "vue";
const Crosshair2Icon = createLucideIcon("Crosshair2", crosshair2);
const _3rd = 30;
const _half = 45;
export class Belbin {
    public static roles = ["Co-ordinator", "Teamworker", "Resource Investigator", "Shaper", "Completer Finisher", "Specialist", "Plant", "Monitor Evaluator", "Implementer"] as const;
    // public static icons = [MegaphoneIcon, HeartHandshakeIcon, PhoneIcon, RocketIcon, WrenchIcon, Crosshair2Icon, LightbulbIcon, MicroscopeIcon, CogIcon];
    public static data: Record<Belbin.Role, {angle: number, icon:FunctionalComponent<LucideProps>, add: number}> = {
        "Resource Investigator": {
            angle: _3rd,
            icon: PhoneIcon,
            add: -_3rd
        },
        "Teamworker": {
            angle: 2*_3rd,
            icon: HeartHandshakeIcon,
            add: -_3rd
        },
        "Co-ordinator": {
            angle: 3*_3rd,
            icon: MegaphoneIcon,
            add: -_3rd
        },
        "Implementer": {
            angle: 90+_half,
            icon: CogIcon,
            add: -_half
        },
        "Monitor Evaluator": {
            angle: 180,
            icon: MicroscopeIcon,
            add: -_half
        },
        "Plant": {
            angle: 180+_3rd,
            icon: LightbulbIcon,
            add: -_3rd
        },
        "Specialist": {
            angle: 180+2*_3rd,
            icon: Crosshair2Icon,
            add: -_3rd
        },
        "Completer Finisher": {
            angle: 180+3*_3rd,
            icon: WrenchIcon,
            add: -_3rd
        },
        "Shaper": {
            angle: 360,
            icon: RocketIcon,
            add: -90
        }
    }
    //     {
    //         name: "Resource Investigator",
    //         icon: PhoneIcon
    //     },
    //     {
    //         name: "Teamworker",
    //         icon: HeartHandshakeIcon
    //     },
    //     {
    //         name: "Co-ordinator",
    //         icon: MegaphoneIcon
    //     },
    //     {
    //         name: "Plant",
    //         icon: LightbulbIcon
    //     },
    //     {
    //         name: "Monitor Evaluator",
    //         icon: MicroscopeIcon
    //     },
    //     {
    //         name: "Specialist",
    //         icon: Crosshair2Icon
    //     },
    //     {
    //         name: "Shaper",
    //         icon: RocketIcon
    //     },
    //     {
    //         name: "Implementer",
    //         icon: CogIcon
    //     },
    //     {
    //         name: "Completer Finisher",
    //         icon: WrenchIcon
    //     }
    // ];
    public role: Belbin.Role;
    public percentage: number;
    public static sums(n: number = 0) {
        let belbinSums: {[k:string]: number} = {};
        Belbin.roles.forEach(role => belbinSums[role] = n);
        return belbinSums as Record<Belbin.Role, number>;
    }
}
export module Belbin {
    export type Role = typeof Belbin.roles[number];
}
export interface IBelbin extends Belbin {}