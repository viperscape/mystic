import {Renderable,Renderer} from "./render";
import {Potion} from "./potion";
import Three = require("three");
import {Items} from "./items";
import {Player} from "./player";
import {Tile} from "./tile";

import events = require("events");

export class Map {
    name: string;
    target_name: string;
    layout: any[];
    items: Items; // base game items loaded from storage
    mesh: Three.Mesh; // terrain mesh

    tiles: Tile[];
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
        this.layout = [];
        this.objects = { potions: [] };
        this.tiles = [];
        this.items = items;
        this.zones = [] as [{ grid, target, mesh, id }];
        this.ev = ev;
        this.target_name = file;

        let map = require("../assets/maps/"+file+".json");
        this.name = map["name"];
        map["layout"].forEach(r => {
            let row = [];
            r.forEach(t => {
                row.push(map["tiles"][t]);
            });
            this.layout.push(row);
        });

    }

    render (r:Renderer) {
        this.renderer = r;

        this.layout.forEach((row, ridx) => {
            row.forEach((e, eidx) => {
                if ((e["potion"]) && (this.items)) {
                    let potion = new Potion;
                    let p = this.items.find("potion",{kind:e["potion"]});
                    if (p.length > 0) {
                        var rand = Math.floor(Math.random()*p.length);
                        potion.from(p[rand]); // pick random of kind
                        
                        potion.renderable = this.items.potion_models[potion.kind].clone();
                        potion.renderable.build(r, () => {
                            potion.renderable.position = { x: eidx, z: ridx, y: potion.renderable.position.y };
                            potion.renderable.rotate();
                        });
                        
                        this.objects.potions.push(potion);
                    }
                }
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
                }
                else if (e["spawn"]) {
                    if ((e["spawn"] == "player") && (!this.player)) {
                        this.player = new Player();
                        this.player.map = this;
                        
                        this.player.render(r,() => {
                            this.player.position_set({ x: 10, z: 10});
                            this.player.renderable.lookAt();
                        });
                    }
                }

                if (e["tile"]) {
                    let tile = new Tile([eidx,ridx],e["tile"]);
                    tile.render(r);
                    this.tiles.push(tile);
                }
            });
        });

        let loader = new Three.JSONLoader();
        loader.load('./assets/models/terrain.json', (geometry, materials) => {
            this.mesh = new Three.Mesh(geometry, materials[0]);
            this.renderer.scene.add(this.mesh);

            let light = new Three.PointLight(0xffffff, 0.8, 100); 
            light.position.set(0, 0, 100);
            this.renderer.scene.add(light);
            
            if (this.player) {
                this.player.snap_to_terrain();
            }

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
        for (var i in this.zones) {
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
        }
    }

    // stop all renderables
    stop() {
        this.objects.potions.forEach(e => {
            e.renderable.stop();
        });
        this.tiles.forEach(e => {
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