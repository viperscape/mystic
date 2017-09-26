import {Renderable,ObjectRenderable,Renderer} from "./render";
import {Attributes, Player} from "./player";
import {Map} from "./map";

import Three = require("three");

export class Potion {
    name: string;
    kind: string;
    // TODO: add a description field?

    //modifiers
    attributes: Attributes;

    debuff = new Debuff;
    renderable: PotionRenderable;

    constructor () {
        this.name = "unknown potion";
        this.kind = "unknown kind";
        this.attributes = new Attributes;
    }

    from(obj: Object) {
        this.name = obj["name"];
        this.kind = obj["kind"];
        this.debuff.from(obj["debuff"]);
        this.attributes.from(obj);
    }

    use(p: Player) {
        for (var i in this.attributes) { // assumes Attributes match!
            if (this.attributes.hasOwnProperty(i)) { // only properties!
                p.attributes[i] += this.attributes[i]; // apply modifiers
            }
        }

        // TODO: we need to convert this to game time, so it can be paused entirely
        if (this.debuff.time != undefined) {
            setTimeout(() => {
                this.unuse(p,this.debuff.ignore);
            }, this.debuff.time);
        }
    }
    unuse(p: Player, ignore?: string[]) {
        for (var i in this.attributes) { // assumes Attributes match!
            if ((ignore) && (ignore.indexOf(i) > -1)) continue; //ignore perm buffs

            if (this.attributes.hasOwnProperty(i)) { // only properties!
                p.attributes[i] -= this.attributes[i]; // apply modifiers
            }
        }
    }

    position_set (pos: {x,z, y?}) {
        if (this.renderable) {
            this.renderable.mesh.position.x = pos.x;
            this.renderable.mesh.position.z = pos.z;
            if (pos.y) this.renderable.mesh.position.y = pos.y;
            else {}
        }
    }
    position_get(): Three.Vector3 {
        if (this.renderable) return this.renderable.mesh.position
    }
}

export class Debuff {
    time: number;
    ignore: string[] = [];

    from(obj: Object) {
        if (!obj) { return }
        this.time = 
            ((obj["time"] === undefined) ||
            (typeof obj["time"] != 'number'))? 
                undefined:obj["time"];

        this.ignore = 
            ((obj["ignore"] === undefined) ||
            (obj["ignore"].constructor != Array))? 
                []:obj["ignore"];
    }
}

export class PotionRenderable extends ObjectRenderable {

    constructor (potion?: Potion, cb?: () => void) {
        super();
        if (!potion) return; // we have this so we can build blank classes to clone into

        this.load("./assets/models/potions/"+potion.kind+".json",cb);
    }

    clone(): PotionRenderable {
        let r = new PotionRenderable(); //build blank class
        r.mesh = this.mesh.clone(); 
        return r;
    }

    draw_rotate() {
        this.renderable.fn = (r:Renderer) => {
            this.mesh.rotation.y += r.delta * 45 * Math.PI / 180;
        };
    }
}