import {Items} from "./items";
import {Renderable,Renderer} from "./render";
import {Move} from "./move";
import {Map} from "./map";
import {Potion} from "./potion";

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
                if (this.move) { 
                    this.move.tween.stop();
                    this.move = new Move(
                        this.position, 
                        [e.tile.x,e.tile.z],
                        this.map, 
                        this.renderable.position
                    );
                }
                else this.move = new Move(this.position, [e.tile.x,e.tile.z], this.map);

                this.move.render({
                    renderer: this.renderable.renderable.renderer, 
                    update: (pos: {x,z}) => {
                        this.renderable.position.x = pos.x;
                        this.renderable.position.z = pos.z;

                        // update game position
                        let rpos:[number,number] = [
                            Math.round(pos.x),
                            Math.round(pos.z)
                        ];
                        this.position = rpos;

                        // process pickups
                        // TODO: move this out, it's going to get messy here
                        var p;
                        for (var i=0; i < this.map.objects.potions.length; i++) {
                            if (!this.map.objects.potions[i].renderable) continue;
                            let pos = [this.map.objects.potions[i].renderable.position.x,
                                this.map.objects.potions[i].renderable.position.z];
                            
                            if ((this.position[0] == pos[0]) && (this.position[1] == pos[1])) {
                                console.log("potion tag", this.map.objects.potions[i])
                                p = this.map.objects.potions.splice(i,1);
                                break;
                            }
                        }
                        if (p) {
                            p.renderable.stop();
                            this.items.potions.push(p);
                        }
                    },
                    final: () => { this.renderable.draw_position() }
                });

                this.renderable.draw_tween(this.move.tween);
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

            tween.update(r.time);
        };
    }
}