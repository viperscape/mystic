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
    protected position: [number,number]; //tile position

    map: Map;
    move: Move;

    raycaster: Three.Raycaster;
    ev: events;

    constructor() {
        this.items = new Items;
        this.attributes = new Attributes;
        
        this.raycaster = new Three.Raycaster();
    }

    render(r:Renderer, cb?: () => void) {
        this.renderable = new PlayerRenderable(r,this,cb);
    }

    handler(ev: events) {
        if (!this.ev) this.ev = ev;

        ev.on("input", (e) => {
            if (e.tile) { // player selects a tile?
                if (!this.map) return;
                let rpos:[number,number] = [
                    Math.round(e.tile.x),
                    Math.round(e.tile.z)
                ];

                if (this.move) { 
                    this.move.tween.stop();
                    this.move = new Move(
                        this.position, 
                        rpos,
                        this.map, 
                        this.renderable.position
                    );
                }
                else this.move = new Move(this.position, rpos, this.map);

                this.move.render({
                    renderer: this.renderable.renderable.renderer, 
                    update: (pos: {x,z}) => {
                        let y = this.renderable.position.y;
                        let point = this.get_snap_height({x:pos.x, y, z:pos.z}, this.map.mesh);
                        
                        if (point) {
                            if (point.y<5) this.position_set({x:point.x,z:point.z,y:point.y});
                            else if (this.move) {
                                this.move.tween.stop();
                                this.move = null;
                            }
                        }

                        // TODO: process more than just potions, find a way to make ts happy
                        let p = this.map.pickup(this.position);
                        if (p) { 
                            this.items.potions.push(p); 
                            this.map.ev.emit("console", "Picked up potion "+p.name);
                        }
                    },
                    final: () => { 
                        this.renderable.draw_position();
                        this.map.zone(); // check zone entry
                    }
                });

                this.renderable.draw_tween(this.move.tween);
            }
        });
    }

    // sets position of renderable and also grid position based on rounding
    position_set (pos: {x,z, y?}) {
        this.renderable.position.x = pos.x;
        this.renderable.position.z = pos.z;
        if (pos.y) this.renderable.position.y = pos.y;

        // update game position
        let rpos:[number,number] = [
            Math.round(pos.x),
            Math.round(pos.z)
        ];
        this.position = rpos;
    }
    position_get(): [number,number] {
        return this.position
    }

    snap_to_terrain(point_?: Three.Vector3) {
        let point;
        if (!point_) { point = this.get_snap_height (this.renderable.position, this.map.mesh); }
        else { point = point_ };

        if (point) this.renderable.position.y = point.y;
    }

    get_snap_height(position: {x:number,y:number,z:number}, mesh: Three.Mesh): Three.Vector3 {
        let origin = new Three.Vector3(position.x, position.y+1, position.z);
        let dir = new Three.Vector3(position.x, position.y-1, position.z);
        dir = dir.sub(origin).normalize();

        this.raycaster.set(origin,dir);
        let intersects = this.raycaster.intersectObjects([mesh]);
        if (intersects.length > 0) {
            return intersects[0].point;
        }
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
            this.position = {x:0,y:5,z:0};
            r.scene.add(this.mesh);
            this.renderable = r.new(function(){});
            this.draw_position();
            
            if (cb) cb();
        });
    }

    lookAt() {
        this.renderable.renderer.camera.lookAt(this.position);
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

            this.lookAt();
            tween.update(r.time);
        };
    }
}