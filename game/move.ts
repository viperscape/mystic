import {Map} from "./map";
import {Renderer} from "./render";

import astar = require("javascript-astar");
import Tween = require("@tweenjs/tween.js");

export class Move {
    route: [[number,number]]; //start to finish list of tiles
    current: [number,number];
    tile_cost: number; // cost of the current tile, to move from
    route_cost: number;

    constructor (from: [number,number], to: [number,number], map: Map) {
        this.route = [] as [[number,number]];
        this.route.push(from);

        let layout = [];
        map.layout.forEach((row, ridx) => {
            let row_ = [];
            row.forEach((e, eidx) => {
                // for now just push a regular/moveable tile
                // TODO: evaluate whats on tile in map (monster, object) and add weighted value
                row_.push(1); // 1 is accessible, 0 is not
            });
            layout.push(row_);
        });

        let g = new astar.Graph(layout, { diagonal: true });
        let s = g.grid[from[0]][from[1]];
        let e = g.grid[to[0]][to[1]];

        let r = astar.astar.search(g, s, e);
        r.forEach(e => {
            this.route.push([e.x,e.y]);
        });
        
        this.current = this.route.shift();
    }

    // performs tweening
    render (steps: {
        renderer: Renderer, 
        update: (pos: {x,z}) => void,
        final: () => void
        }): Tween.Tween {

        let xs = [];
        let zs = [];
        this.route.forEach((e) => {
            xs.push(e[0]);
            zs.push(e[1]);
        });
        
        let tween = new Tween.Tween({x:this.current[0],z:this.current[1]})
            .to({x:xs,z:zs}, this.route.length * 250) //TODO: determine speed
            .interpolation(Tween.Interpolation.CatmullRom)
            .onUpdate(steps.update)
            .onComplete(steps.final)
            .start();

        return tween;
    }


}