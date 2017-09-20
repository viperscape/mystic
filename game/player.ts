import {Items} from "./items";
import {Renderable,Renderer} from "./render";
import {Move} from "./move";
import {Map} from "./map";
import {Potion} from "./potion";

import Three = require("three");
import {Vector3} from "three";
import events = require("events");
import {Tween} from "@tweenjs/tween.js";

export class Player {
    items: Items;
    attributes: Attributes;
    renderable: PlayerRenderable;

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
            if (e.position) {
                let player_pos = this.position_get();
                /*let dist = e.position.sub(player_pos);
                if ((Math.abs(dist.y) > 20) || 
                    (Math.abs(dist.x) > 80) ||
                    (Math.abs(dist.z) > 80)) { console.log("too far",dist); return }*/

                if (!this.map) return;
                let tpos:[number,number] = [
                    Math.round(e.position.x),
                    Math.round(e.position.z)
                ];
                let fpos:[number,number] = [
                    Math.round(player_pos.x),
                    Math.round(player_pos.z)
                ];

                if (this.move) { 
                    this.move.tween.stop();
                    this.move = new Move(
                        fpos, 
                        tpos,
                        this.map, 
                        this.position_get()
                    );
                }
                else this.move = new Move(fpos, tpos, this.map);

                this.move.render({
                    renderer: this.renderable.renderable.renderer, 
                    update: (pos: {x,z}) => {
                        let y = this.renderable.mesh.position.y;
                        let point = this.get_snap_height(new Vector3(pos.x, y, pos.z), this.map.mesh);
                        
                        if (point) {
                            if (point.y<5) this.position_set({x:point.x,z:point.z,y:point.y});
                            else if (this.move) {
                                this.move.tween.stop();
                                this.move = null;
                            }
                        }

                        // TODO: process more than just potions, find a way to make ts happy
                        //let p = this.map.pickup(this.position);
                        /*if (p) { 
                            this.items.potions.push(p); 
                            this.map.ev.emit("console", "Picked up potion "+p.name);
                        }*/
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
        this.renderable.mesh.position.x = pos.x;
        this.renderable.mesh.position.z = pos.z;
        if (pos.y) this.renderable.mesh.position.y = pos.y;
    }
    position_get(): Vector3 {
        if (this.renderable) return this.renderable.mesh.position
    }

    snap_to_terrain(point_?: Vector3) {
        let point;
        if (!point_) { point = this.get_snap_height (this.position_get(), this.map.mesh); }
        else { point = point_ };

        if (point) this.renderable.mesh.position.y = point.y;
    }

    get_snap_height(position: Vector3, mesh: Three.Mesh): Vector3 {
        let origin = new Vector3(position.x, position.y+1, position.z);
        let dir = new Vector3(position.x, position.y-1, position.z);
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

    constructor (r:Renderer, player: Player, cb?: () => void) {
        let loader = new Three.JSONLoader();
        loader.load('./assets/models/player.json', (geometry, materials) => {
            var material = materials[0];
            this.mesh = new Three.Mesh(geometry, material);
            this.position(new Vector3(0,30,0));
            r.scene.add(this.mesh);
            this.renderable = r.new(function(){});
            this.draw_position();
            
            if (cb) cb();
        });
    }

    position(v: Vector3) {
        this.mesh.position.set(v.x, v.y, v.z);
    }

    lookAt() {
        let camera: Three.Camera = this.renderable.renderer.camera;
        camera.lookAt(this.mesh.position);
        camera.position.x = this.mesh.position.x + 0;
        camera.position.z = this.mesh.position.z + 0;
        camera.position.y = this.mesh.position.y + 200;
    }

    draw_position () {
        this.renderable.fn = (_: Renderer) => {
            this.lookAt();
        };
    }

    draw_tween (tween:Tween) {
        this.renderable.fn = (r: Renderer) => {
            this.lookAt();
            tween.update(r.time);
        };
    }
}