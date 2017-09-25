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

        let loader = new Three.JSONLoader();
        loader.load("./assets/models/"+npc.kind+".json", (geometry, materials) => {
            this.mesh = new Three.Mesh(geometry, materials[0]);
            if (cb) cb();
        });
    }

    clone(): NPCRenderable {
        let r = new NPCRenderable(); //build blank class
        r.mesh = this.mesh.clone(); 
        return r;
    }

    build (r:Renderer, cb?: () => void) {
        r.scene.add(this.mesh);

        this.renderable = r.new(function(){});

        if (cb) cb();
    }

    stop () {
        this.renderable.stop(this.mesh);
    }
}