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

                if (e["tile"] == "stone-grey") mat.color = stone_grey;
                else mat.color = stone_brown;

                var geometry = new Three.BoxGeometry(1,0,1);
                var material = new Three.MeshBasicMaterial(mat);
                var cube = new Three.Mesh(geometry, material);
                r.scene.add(cube);
                cube.position.x = eidx;
                cube.position.z = ridx;
            });
        });

        let draw = (r: Renderer) => {

        };

        this.renderable = r.new(draw);
    }
}