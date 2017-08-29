import {Renderable,Renderer} from "./render";
import Three = require("three");

export class Map {
    name: string;
    layout: any[];
    renderable: Renderable;

    constructor (file:string) {
        this.layout = [];

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
                let stone_brown = 0x4b331d;
                let stone_grey = 0x424242;

                if (e["potion"]) {
                    var cone = new Three.ConeGeometry(0.5, 1);
                    mat.color = 0x40E0D0;
                    var material = new Three.MeshBasicMaterial(mat);
                    var mesh = new Three.Mesh(cone, material);
                    r.scene.add(mesh);
                    mesh.position.x = eidx;
                    mesh.position.z = ridx;
                }

                if (e["tile"] == "stone-grey") mat.color = stone_grey;
                else mat.color = stone_brown;

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