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
        var geometry = new Three.BoxGeometry(1,1,1);
        var material = new Three.MeshNormalMaterial();
        var cube = new Three.Mesh(geometry, material);
        r.scene.add(cube);

        let draw = (r: Renderer) => {
            var delta = r.clock.getDelta();
            cube.rotation.x += 3.2 * delta;
            cube.rotation.y += 3.2 * delta;
        };

        this.renderable = r.new(draw);
    }
}