import {Renderable,ObjectRenderable, Renderer} from "./render";
import {Potion} from "./potion";
import {Items} from "./items";
import {Player} from "./player";
import {Tile} from "./tile";

import events = require("events");
import Three = require("three");
import Monkey = require("./support/monkey");
new Monkey.Monkey();

export class Map {
    map: Object;
    name: string;
    target_name: string;
    items: Items; // base game items loaded from storage
    mesh: Three.Mesh; // terrain mesh

    objects: {potions}; // objects in the map, fully loaded and unique // NOTE: this may become a hashmap of sorts
    player: Player;
    zones: [{ 
        grid: [number,number], 
        target:string, 
        mesh: Three.Mesh,
        idx?: number  // zone exits to other maps
    }];
    ev: events;
    renderer: Renderer; // for now hold on to renderer for entry render handling

    constructor (file:string, items?: Items, ev?: events) {
        this.objects = { potions: [] };
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

                /*
                else if (e["entry"]) {
                    let mat = { color: 0x0, opacity: 1 };
                    let stone_brown = 0x4b331d;
                    let stone_grey = 0x424242;

                    var cube = new Three.BoxGeometry(0.25,2,1);
                    if (e["entry"] == "stone-grey") mat.color = stone_grey;
                    else mat.color = stone_brown;

                    var material = new Three.MeshLambertMaterial(mat);
                    var mesh = new Three.Mesh(cube, material);
                    r.scene.add(mesh);

                    if (eidx == 0) mesh.position.x = eidx-0.5;
                    else if (eidx == row.length-1) mesh.position.x = eidx+0.5;
                    else mesh.position.x = eidx;

                    mesh.rotation.y = Math.PI / 2;
                    if (ridx == 0) mesh.position.z = ridx-0.5;
                    else if (ridx == row.length-1) mesh.position.z = ridx+0.5;
                    else {
                        mesh.position.z = ridx;
                        mesh.rotation.y = 0;
                    }

                    mesh.position.y += 1;

                    this.zones.push({ 
                        grid: [eidx,ridx], 
                        target: e["target"], 
                        idx: e["idx"], // may be undefined
                        mesh: mesh
                    });
                }*/
                
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
                        
                        this.player.render(r,() => {
                            maybe_snap(e.player.position,this.player.renderable);
                            this.player.renderable.lookAt();
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
                            potion.renderable.build(r, () => {
                                maybe_snap(e.potion.position,potion.renderable);
                                potion.renderable.rotate();
                                potion.renderable.mesh.castShadow = true;
                            });
                            
                            this.objects.potions.push(potion);
                        }
                    }
                });
            }
        }

        let loader = new Three.ColladaLoader();
        (loader as any).options.convertUpAxis = true;
        loader.load("./assets/maps/"+this.target_name+".dae", (dae) => {
            this.mesh = dae.scene.getObjectByName("terrain").children[0] as Three.Mesh; // get underlying mesh
            this.mesh.position.set(50,0,50); // NOTE: we must place in positive coordinates
            this.mesh.receiveShadow = true;

            let sun = dae.scene.getObjectByName("sun").children[0] as Three.DirectionalLight;
            sun.castShadow = true;

            this.renderer.scene.add(dae.scene);
            
            then_render();

            this.ev.emit("map", this);
        });
    }


    // NOTE: only processes potion pickups right now
    pickup (position: [number,number]): any {
        for (var i=0; i < this.objects.potions.length; i++) {
            if (!this.objects.potions[i].renderable) continue;
            let pos: [number,number] = [this.objects.potions[i].renderable.position.x,
                this.objects.potions[i].renderable.position.z];
            
            if (on_same_tile(position, pos)) {
                let p = this.objects.potions.splice(i,1)[0];
                p.renderable.stop();
                return p;
            }
        }
    }

    // check if at zone entry/exit, reload new map if so
    zone () {
        /*for (var i in this.zones) {
            if (on_same_tile(this.zones[i].grid, this.player.position_get())) {
                let m = new Map(this.zones[i].target, this.items, this.ev);
                m.player = this.player;
                this.player.map = m; // update player map reference // NOTE: we should check that the ref is latest on change

                this.stop();
                if (this.ev) {
                    this.ev.emit("map", m, () => {
                        // find back zone and position player
                        for (var i in m.zones) {
                            if (m.zones[i].target == this.target_name) {
                                this.player.position_set({
                                    x:m.zones[i].grid[0], 
                                    z:m.zones[i].grid[1]
                                })
                            }
                        }
                    });
                }

                break
            }
        }*/
    }

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

function on_same_tile (p: [number,number], p2: [number,number]): boolean {
    return ((p[0] == p2[0]) && (p[1] == p2[1]))
}