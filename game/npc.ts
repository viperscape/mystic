// NOTE: this might split out to monster & npc separately

import {ObjectRenderable,Renderable,Renderer} from "./render";
import {AI} from "./ai";
import {Attributes} from "./attr";

import Three = require("three");

export class NPC {
    ai: AI;
    renderable: NPCRenderable;
    kind: string; // used to determine AI and model asset
    name: string; // may be blank
    attributes: Attributes;

    constructor() {
        this.attributes = new Attributes();
        this.attributes.health = 100;
        let ai_states = {
            flee: {
                trigger: () => { (this.attributes.health < 20) },
                action: () => { console.log("flee"); },
                release: () => { (this.attributes.health > 25) }
            },
            attack: {
                trigger: () => { false }, //disabled trigger
                action: () => { console.log("attack"); }
                // TODO: actually impl a release strategy based on target health == 0
            },
            default: {
                trigger: () => { (this.ai.state.length < 1) },
                action: () => { console.log("patrol"); }
            },
        };

        this.ai = new AI(this.attributes, ai_states);
    }

    from(obj: Object) {
        this.name = obj["name"];
        this.kind = obj["kind"];

        if (!this.kind) console.error("No NPC kind stated")
    }
}


export class NPCRenderable extends ObjectRenderable {

    constructor (npc?: NPC, cb?: () => void) {
        super();
        if (!npc || !npc.kind) return; // we have this so we can build blank classes to clone into

        this.load("./assets/models/"+npc.kind+".json",cb);
    }

    clone(): NPCRenderable {
        let r = new NPCRenderable(); //build blank class
        r.mesh = this.mesh.clone(); 
        return r;
    }
}