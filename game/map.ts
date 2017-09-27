import {Renderable,ObjectRenderable, Renderer} from "./render";
import {Potion} from "./potion";
import {Items} from "./items";
import {Player} from "./player";
import {NPC} from "./npc";
import {Tile} from "./tile";

import events = require("events");
import Three = require("three");
require("./support/monkey");

export class Map {
    map: Object;
    name: string;
    target_name: string;
    items: Items; // base game items loaded from storage
    mesh: Three.Mesh; // terrain mesh

    objects: {potions: Potion[], npcs: NPC[]}; // objects in the map, fully loaded and unique
    player: Player;

    // FIXME: this now needs to be rethought and redone
    zones: [{ 
        grid: [number,number], 
        target:string, 
        mesh: Three.Mesh,
        idx?: number  // zone exits to other maps
    }];
    ev: events;
    renderer: Renderer; // for now hold on to renderer for entry render handling

    constructor (file:string, items?: Items, ev?: events) {
        this.objects = { potions: [], npcs: [] };
        this.items = items;
        this.zones = [] as [{ grid, target, mesh, id }];
        this.ev = ev;
        this.target_name = file;

        this.map = require("../assets/maps/"+file+".json");
        this.name = this.map["name"];
    }

    get_snap_height(renderable: ObjectRenderable, position_?: Three.Vector3): Three.Vector3 {
        let position = position_? position_ : renderable.mesh.position;
        let origin = new Three.Vector3(position.x, position.y+1, position.z);
        let dir = new Three.Vector3(position.x, position.y-1, position.z);
        dir = dir.sub(origin).normalize();

        renderable.raycaster.set(origin,dir);
        let intersects = renderable.raycaster.intersectObjects([this.mesh]);
        if (intersects.length > 0) {
            return intersects[0].point;
        }
    }

    snap_to_terrain(renderable: ObjectRenderable) {
        let point = this.get_snap_height(renderable);
        if (point) renderable.mesh.position.y = point.y;
    }

    render (r:Renderer) {
        this.renderer = r;
                
        let then_render = () => {
            if (this.map["spawn"]) {
                this.map["spawn"].forEach(e => {
                    let maybe_snap = (pos: {x:number,y?,z}, renderable: ObjectRenderable) => {
                        if (pos) {
                            if (!pos.y) {
                                pos.y = 10;
                                renderable.mesh.position.set(pos.x,pos.y,pos.z);
                                this.snap_to_terrain(renderable);
                            }
                            else renderable.mesh.position.set(pos.x,pos.y,pos.z);
                        }
                    }

                    if ((e.player) && (!this.player)) {
                        this.player = new Player();
                        this.player.map = this;
                        
                        this.player.render(r, () => {
                            this.player.renderable.draw_position();
                            maybe_snap(e.player.position,this.player.renderable);
                            this.player.renderable.mesh.castShadow = true;
                        });
                    }
                    else if ((e.potion) && (this.items)) {
                        let potion = new Potion;
                        let p = this.items.find("potion",{kind:e.potion.kind});
                        if (p.length > 0) {
                            var rand = Math.floor(Math.random()*p.length);
                            potion.from(p[rand]); // pick random of kind
                            
                            potion.renderable = this.items.potion_models[potion.kind].clone();
                            potion.renderable.build(r);
                            potion.renderable.draw_rotate();
                            maybe_snap(e.potion.position,potion.renderable);
                            potion.renderable.mesh.castShadow = true;
                            
                            this.objects.potions.push(potion);
                        }
                    }
                    else if (e.npc) {
                        let npc = new NPC;
                        npc.from(e.npc);

                        let n = this.items.find("npc",{kind:npc.kind});
                        if (n.length > 0) {
                            npc.renderable = this.items.npc_models[npc.kind].clone();
                            npc.renderable.build(r);
                            maybe_snap(e.npc.position, npc.renderable);
                            npc.renderable.mesh.castShadow = true;
                            npc.run_ai();
                        }
                    }
                });
            }
        }

        let loader = new Three.ColladaLoader();
        (loader as any).options.convertUpAxis = true;
        loader.load("./assets/maps/"+this.target_name+".dae", (dae) => {
            this.mesh = dae.scene.getObjectByName("terrain").children[0] as Three.Mesh; // get underlying mesh
            dae.scene.position.set(50,0,50); // NOTE: we must place in positive coordinates
            this.mesh.receiveShadow = true;

            this.renderer.scene.add(dae.scene);
            then_render();

            this.ev.emit("map", this);
        });
    }


    // NOTE: only processes potion pickups right now
    pickup (position: Three.Vector3): any {
        for (var i=0; i < this.objects.potions.length; i++) {
            if (!this.objects.potions[i].renderable) continue;

            if (position.distanceTo(this.objects.potions[i].position_get()) < 1.25) {
                let p = this.objects.potions.splice(i,1)[0];
                p.renderable.stop();
                return p;
            }
        }
    }

    // check if at zone entry/exit, reload new map if so
    // TODO: reimplement as empties in Blender and parse in, etc.
    zone () {}

    // stop all renderables
    stop() {
        this.objects.potions.forEach(e => {
            e.renderable.stop();
        });
        if (this.renderer) {
            this.zones.forEach(e => {
                this.renderer.scene.remove(e.mesh);
            });
        }
    }
}