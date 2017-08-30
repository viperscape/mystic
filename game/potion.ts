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

    render (r:Renderer) {
        this.renderable = new PotionRenderable(r);
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

    constructor (r:Renderer) {
        let mat = { color: 0x0, opacity: 1 };
        var cone = new Three.ConeGeometry(0.5, 1);
        mat.color = 0x40E0D0;
        var material = new Three.MeshBasicMaterial(mat);
        let mesh = new Three.Mesh(cone, material);
        mesh.position.y = 0.5;
        r.scene.add(mesh);

        this.mesh = mesh;
        
        let draw = (r: Renderer) => {
        };

        this.renderable = r.new(draw);
    }

    rotate () {
        let draw = (r: Renderer) => {
            var delta = r.clock.getDelta();
            this.mesh.rotation.y += 3.2 * delta;
        };
        this.renderable.fn = draw;
    }
}