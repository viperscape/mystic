import {Items} from "./items";
import {Renderable,ObjectRenderable, Renderer} from "./render";
import {Move} from "./move";
import {Map} from "./map";
import {Potion} from "./potion";
import {Attributes} from "./attr";

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

    ev: events;

    constructor(map?) {
        this.items = new Items;
        this.attributes = new Attributes;
        this.attributes.health = 100;        
        this.map = map;
    }

    render(r:Renderer, cb?: () => void) {
        this.renderable = new PlayerRenderable(r,this,cb);
    }

    handler(ev: events) {
        if (!this.ev) this.ev = ev;

        ev.on("input", (e) => {
            if (e.position) {
                let player_pos = this.position_get();
                
                if (!this.map) return;

                if (this.move) { 
                    this.move.tween.stop();
                    this.move = new Move(
                        player_pos, 
                        e.position,
                        this.map, 
                        player_pos
                    );
                }
                else this.move = new Move(player_pos, e.position, this.map);

                this.move.render({
                    renderer: this.renderable.renderable.renderer, 
                    update: (pos: {x,z}) => {
                        let y = this.renderable.mesh.position.y;
                        let point = this.map.get_snap_height(this.renderable, new Vector3(pos.x, y, pos.z), );
                        
                        if (point) {
                            if (point.y<5) this.position_set({x:point.x,z:point.z,y:point.y});
                            else if (this.move) {
                                this.move.tween.stop();
                                this.move = null;
                            }
                        }

                        // TODO: process more than just potions, find a way to make ts happy]
                        let p = this.map.pickup(this.position_get());
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

    position_set (pos: {x,z, y?}) {
        if (this.renderable) {
            this.renderable.mesh.position.x = pos.x;
            this.renderable.mesh.position.z = pos.z;
            if (pos.y) this.renderable.mesh.position.y = pos.y;
            else this.map.snap_to_terrain(this.renderable)
        }
    }
    position_get(): Vector3 {
        if (this.renderable) return this.renderable.mesh.position
    }
}

export class PlayerRenderable extends ObjectRenderable {

    constructor (r:Renderer, player: Player, cb?: () => void) {
        super();
        this.load("./assets/models/player.json", () => {
            this.mesh.position.set(0,30,0);
            this.build(r);
            
            if (cb) cb();
        });
    }

    lookAt() {
        let camera: Three.Camera = this.renderable.renderer.camera;
        camera.lookAt(this.mesh.position);
        camera.position.x = this.mesh.position.x + 15;
        camera.position.z = this.mesh.position.z + 15;
        camera.position.y = this.mesh.position.y + 15;
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