import {Renderer,Renderable} from "./render";
import Three = require("three");

const SIZE: number = 1;

export class Tile {
    kind: string;
    renderable: TileRenderable;
    position: [number,number]; //straight tile placement in coords

    constructor (coord: [number,number], kind: string) {
        this.kind = kind;
        this.position = coord;
    }

    render(r:Renderer, cb?: () => void) {
        this.renderable = new TileRenderable(r,this,cb);
    }
}

export class TileRenderable {
    renderable: Renderable;
    mesh: Three.Mesh;

    constructor (r:Renderer, tile: Tile, cb?: () => void) {
        let mat = { color: 0x0, opacity: 1 };

        // NOTE: these will move outside of here
        let stone_brown = 0x4b331d;
        let stone_grey = 0x424242;
        let stone_red = 0x905050;
        let stone_generic = 0x656056;

        if (tile.kind == "stone-grey") mat.color = stone_grey;
        else if (tile.kind == "stone-brown") mat.color = stone_brown;
        else if (tile.kind == "stone-red") mat.color = stone_red;
        else mat.color = stone_generic;

        let cube = new Three.BoxGeometry(SIZE,0,SIZE);
        let material = new Three.MeshLambertMaterial(mat);
        this.mesh = new Three.Mesh(cube, material);
        this.mesh.position.x = tile.position[0];
        this.mesh.position.z = tile.position[1];
        
        r.scene.add(this.mesh);

        let draw = (r: Renderer) => {
        };

        this.renderable = r.new(draw);
        if (cb) cb();
    }

    stop() {
        this.renderable.stop(this.mesh);
    }
}