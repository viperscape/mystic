import {Renderable,Renderer} from "./render";
import {Attributes, Player} from "./player";
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

    render (r:Renderer, cb?: () => void) {
        this.renderable = new PotionRenderable(r,this, cb);
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

class PotionRenderable {
    renderable: Renderable;
    mesh: Three.Mesh;
    position = {x:0,y:0,z:0};

    constructor (r:Renderer, potion: Potion, cb?: () => void) {
        let mat = { color: 0x0, opacity: 0.85 };
        
        if (potion.kind == "mindful") mat.color = 0x40E0D0;
        else if (potion.kind == "berzerk") mat.color = 0xFF0000;
        else mat.color = 0x222222;

        let loader = new Three.JSONLoader();
        loader.load('./assets/models/potion.json', (geometry, materials) => {
            var material = materials[0];
            material.setValues(mat);
            this.mesh = new Three.Mesh(geometry, material);

            r.scene.add(this.mesh);

            let draw = (r: Renderer) => {
                this.mesh.position.x = this.position.x;
                this.mesh.position.y = this.position.y;
                this.mesh.position.z = this.position.z;
            };
    
            this.renderable = r.new(draw);

            if (cb) cb();
        });
    }

    rotate () {
        let draw = (r: Renderer) => {            
            this.mesh.position.x = this.position.x;
            this.mesh.position.y = this.position.y;
            this.mesh.position.z = this.position.z;
            this.mesh.rotation.y += r.delta * 45 * Math.PI / 180;
        };
        this.renderable.fn = draw;
    }
}