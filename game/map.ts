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
                var geometry = new Three.BoxGeometry(1,0,1);
                var material = new Three.MeshNormalMaterial();
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