import {Items} from "./items";
import {Renderable,Renderer} from "./render";
import Three = require("three");

export class Player {
    items: Items;
    attributes: Attributes;
    renderable: PlayerRenderable;
    position: [number,number]; //tile position

    constructor() {
        this.items = new Items;
        this.attributes = new Attributes;
    }

    render(r:Renderer, cb?: () => void) {
        this.renderable = new PlayerRenderable(r,this,cb);
    }
}

export class Attributes {
    strength = 0;
    stamina = 0;
    health = 0;
    concentration = 0;
    insight = 0;

    from(obj: Object) { // make sure no value is missing!
        var or_default = function (x:number): number {
            return (x === undefined)? 0:x;
        };

        this.strength = or_default(obj["strength"]);
        this.stamina = or_default(obj["stamina"]);
        this.health = or_default(obj["health"]);
        this.concentration = or_default(obj["concentration"]);
        this.insight = or_default(obj["insight"]);
    }
}

export class PlayerRenderable {
    renderable: Renderable;
    mesh: Three.Mesh;
    position: {x:number, y:number, z:number};

    constructor (r:Renderer, player: Player, cb?: () => void) {
        let loader = new Three.JSONLoader();
        loader.load('./assets/models/player.json', (geometry, materials) => {
            var material = materials[0];
            this.mesh = new Three.Mesh(geometry, material);
            this.position = {x:0,y:0,z:0};
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
}