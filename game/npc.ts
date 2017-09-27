// NOTE: this might split out to monster & npc separately

import {ObjectRenderable,Renderable,Renderer} from "./render";
import {AI} from "./ai";
import {Attributes} from "./attr";
import {Map} from "./map";
import {Move} from "./move";

import Three = require("three");
import {Tween} from "@tweenjs/tween.js";

export class NPC {
    ai: AI;
    renderable: NPCRenderable;
    kind: string; // used to determine AI and model asset
    name: string; // may be blank
    attributes: Attributes;
    map: Map;
    move: Move;

    time: number = 0;

    constructor(map: Map) {
        this.map = map;
        this.attributes = new Attributes();
        this.attributes.health = 100;

        // NOTE: party or summonables will require a slight rework-- iterate each and check distances, etc
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
                action: () => {
                    if (this.map.renderer.clock.elapsedTime - this.time > 1.5) {
                        this.time = this.map.renderer.clock.elapsedTime;
                        this.move_set(this.map.player.position_get());
                    }
                 },
                release: () => {
                    let end = false;
                    end = ((this.map.player.attributes.health < 1) ||
                        (this.attributes.health < 1));
                    
                    if (!end) {
                        let player_pos = this.map.player.position_get();
                        end = (player_pos.distanceTo(this.position_get()) > 40); // TODO: impl sight attribute
                    }

                    if (end) {
                        this.move.tween.stop();
                        this.move = null;

                        return true
                    }
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
        setTimeout(() => {
            this.renderable.npc = this;
            this.renderable.renderable.fn = function () { ai.process(); };
        }, 1000);
    }

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

    move_set(to: Three.Vector3) {
        let from = this.position_get();
        if (this.move) { 
            this.move.tween.stop();
            this.move = new Move(
                from, 
                to,
                this.map, 
                from
            );
        }
        else this.move = new Move(from, to, this.map);

        this.move.render({
            renderer: this.renderable.renderable.renderer, 
            update: (pos: {x,z}) => {
                let y = this.renderable.mesh.position.y;
                let point = this.map.get_snap_height(this.renderable, new Three.Vector3(pos.x, y, pos.z), );
                
                if (point) {
                    if (point.y<5) this.position_set({x:point.x,z:point.z,y:point.y});
                    else if (this.move) {
                        this.move.tween.stop();
                        this.move = null;
                    }
                }
            },
            final: () => { }
        });

        this.renderable.draw_tween(this.move.tween);
    }
}


export class NPCRenderable extends ObjectRenderable {
    npc: NPC;

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

    draw_tween (tween:Tween) {
        this.renderable.fn = (r: Renderer) => {
            tween.update(r.time);
            this.npc.ai.process();
        };
    }
}