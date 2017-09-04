import {Renderable,Renderer} from "./render";
import {Potion} from "./potion";
import Three = require("three");
import {Items} from "./items";

export class Map {
    name: string;
    layout: any[];
    renderable: Renderable;
    items: Items;
    // TODO: track all rendering mesh

    constructor (file:string, items?: Items) {
        this.layout = [];
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
                let mat = { color: 0x0, opacity: 1 };
                // TODO: moves these out to assets
                let stone_brown = 0x4b331d;
                let stone_grey = 0x424242;
                let stone_red = 0x905050;
                let stone_generic = 0x656056;

                if ((e["potion"]) && (this.items)) {
                    let potion = new Potion;
                    let p = this.items.find("potion",{kind:e["potion"]});
                    if (p.length > 0) {
                        var rand = Math.floor(Math.random()*p.length);
                        potion.from(p[rand]);
                        potion.render(r, () => {
                            potion.renderable.position = { x: eidx, z: ridx, y: potion.renderable.position.y };
                            potion.renderable.rotate();
                        });
                    }
                }

                if (e["entry"]) {
                    // TODO: figure out direction of door to line up with wall
                    var cube = new Three.BoxGeometry(0.25,2,1);
                    if (e["entry"] == "stone-grey") mat.color = stone_grey;
                    else mat.color = stone_brown;

                    var material = new Three.MeshBasicMaterial(mat);
                    var mesh = new Three.Mesh(cube, material);
                    r.scene.add(mesh);
                    mesh.position.x = eidx-0.5;
                    mesh.position.y += 1;
                    mesh.position.z = ridx;
                }

                if (e["tile"] == "stone-grey") mat.color = stone_grey;
                else if (e["tile"] == "stone-brown") mat.color = stone_brown;
                else if (e["tile"] == "stone-red") mat.color = stone_red;
                else mat.color = stone_generic;

                var cube = new Three.BoxGeometry(1,0,1);
                var material = new Three.MeshBasicMaterial(mat);
                var mesh = new Three.Mesh(cube, material);
                r.scene.add(mesh);
                mesh.position.x = eidx;
                mesh.position.z = ridx;
            });
        });

        let draw = (r: Renderer) => {
        
        };

        this.renderable = r.new(draw);
    }
}