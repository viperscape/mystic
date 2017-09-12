import {Items} from "./items";
import {Renderable,Renderer} from "./render";
import {Move} from "./move";
import {Map} from "./map";

import Three = require("three");
import events = require("events");
import {Tween} from "@tweenjs/tween.js";

export class Player {
    items: Items;
    attributes: Attributes;
    renderable: PlayerRenderable;
    position: [number,number]; //tile position

    map: Map;
    move: Move;

    constructor() {
        this.items = new Items;
        this.attributes = new Attributes;
    }

    render(r:Renderer, cb?: () => void) {
        this.renderable = new PlayerRenderable(r,this,cb);
    }

    handler(ev: events) {
        ev.on("input", (e) => {
            if (e.tile) { // player selects a tile?
                if (!this.map) return;

                this.move = new Move(this.position, [e.tile.x,e.tile.z], this.map);
                let tween: Tween = this.move.render(this.renderable.renderable.renderer, 
                    (pos: [number,number])=> {
                        this.renderable.position.x = pos[0];
                        this.renderable.position.z = pos[1];
                });

                this.renderable.draw_tween(tween);
            }
        });
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
            this.renderable = r.new(function(){});
            this.draw_position();
            
            if (cb) cb();
        });
    }

    draw_position () {
        this.renderable.fn = (_: Renderer) => {
            this.mesh.position.x = this.position.x;
            this.mesh.position.y = this.position.y;
            this.mesh.position.z = this.position.z;
        };
    }

    draw_tween (tween:Tween) {
        this.renderable.fn = (r: Renderer) => {
            this.mesh.position.x = this.position.x;
            this.mesh.position.y = this.position.y;
            this.mesh.position.z = this.position.z;

            tween.update(r.clock);
        };
    }
}