// NOTE: this might split out to monster & npc separately

import {ObjectRenderable,Renderable,Renderer} from "./render";
import {AI} from "./ai";
import {Attributes} from "./attr";
import {Map} from "./map";

import Three = require("three");

export class NPC {
    ai: AI;
    renderable: NPCRenderable;
    kind: string; // used to determine AI and model asset
    name: string; // may be blank
    attributes: Attributes;
    map: Map;

    constructor(map: Map) {
        this.map = map;
        this.attributes = new Attributes();
        this.attributes.health = 100;

        let ai_states = {
            flee: {
                trigger: () => { return (this.attributes.health < 20) },
                action: () => { console.log("flee"); },
                release: () => { return (this.attributes.health > 25) }
            },
            attack: {
                trigger: () => {
                    let player_pos = this.map.player.position_get();
                    return (player_pos.distanceTo(this.position_get()) < 20) // TODO: impl sight attribute
                },
                action: () => { },
                release: () => {
                    if ((this.map.player.attributes.health < 1) ||
                        (this.attributes.health < 1)) return true;
                    
                    
                    let player_pos = this.map.player.position_get();
                    return (player_pos.distanceTo(this.position_get()) > 40) // TODO: impl sight attribute
                }
            },
            default: {
                trigger: () => { return (this.ai.state.length < 1) },
                action: () => { }
            },
        };

        this.ai = new AI(this.attributes, ai_states);
    }

    from(obj: Object) {
        this.name = obj["name"];
        this.kind = obj["kind"];

        if (!this.kind) console.error("No NPC kind stated")
    }

    run_ai() {
        if (!this.renderable) return;
        let ai = this.ai;
        this.renderable.renderable.fn = function () { ai.process(); };
    }

        // sets position of renderable and also grid position based on rounding
        position_set (pos: {x,z, y?}) {
            if (this.renderable) {
                this.renderable.mesh.position.x = pos.x;
                this.renderable.mesh.position.z = pos.z;
                if (pos.y) this.renderable.mesh.position.y = pos.y;
                else this.map.snap_to_terrain(this.renderable)
            }
        }
        position_get(): Three.Vector3 {
            if (this.renderable) return this.renderable.mesh.position
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