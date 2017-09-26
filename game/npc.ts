// NOTE: this might split out to monster & npc separately

import {ObjectRenderable,Renderable,Renderer} from "./render";
import Three = require("three");

export class NPC {
    ai: {}; // TODO: type of ai
    renderable: NPCRenderable;
    kind: string; // used to determine AI and model asset
    name: string; // may be blank

    constructor() {}

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