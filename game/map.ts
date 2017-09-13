import {Renderable,Renderer} from "./render";
import {Potion} from "./potion";
import Three = require("three");
import {Items} from "./items";
import {Player} from "./player";
import {Tile} from "./tile";

export class Map {
    name: string;
    layout: any[];
    renderable: Renderable;
    items: Items; // base game items loaded from storage

    tiles: Tile[];
    objects: {potions}; // objects in the map, fully loaded and unique // NOTE: this may become a hashmap of sorts
    player: Player;

    constructor (file:string, items?: Items) {
        this.layout = [];
        this.objects = { potions: [] };
        this.tiles = [];
        this.items = items;

        let map = require("../assets/maps/"+file);
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

                    // TODO: figure out direction of door to line up with wall
                    var cube = new Three.BoxGeometry(0.25,2,1);
                    if (e["entry"] == "stone-grey") mat.color = stone_grey;
                    else mat.color = stone_brown;

                    var material = new Three.MeshLambertMaterial(mat);
                    var mesh = new Three.Mesh(cube, material);
                    r.scene.add(mesh);
                    mesh.position.x = eidx-0.5;
                    mesh.position.y += 1;
                    mesh.position.z = ridx;
                }
                else if (e["spawn"]) {
                    if (e["spawn"] == "player") {
                        this.player = new Player();
                        this.player.map = this;
                        this.player.position = [eidx,ridx];
                        this.player.render(r,() => {
                            this.player.renderable.position = { x: eidx, z: ridx, y: 0 };
                            r.camera.lookAt(new Three.Vector3(eidx,0,ridx));
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

        let draw = (r: Renderer) => {
        
        };

        this.renderable = r.new(draw);
    }


    // NOTE: only processes potion pickups right now
    pickup (position: [number,number]): any {
        for (var i=0; i < this.objects.potions.length; i++) {
            if (!this.objects.potions[i].renderable) continue;
            let pos = [this.objects.potions[i].renderable.position.x,
                this.objects.potions[i].renderable.position.z];
            
            if ((position[0] == pos[0]) && (position[1] == pos[1])) {
                let p = this.objects.potions.splice(i,1)[0];
                p.renderable.stop();
                return p;
            }
        }
    }
}