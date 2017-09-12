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

        let g = new astar.Graph(layout);
        let s = g.grid[from[0]][from[1]];
        let e = g.grid[to[0]][to[1]];

        let r = astar.astar.search(g, s, e);
        r.forEach(e => {
            this.route.push([e.x,e.y]);
        });
        
        this.current = this.route.shift();
    }

    // performs tweening
    render (r: Renderer, cb: (pos: [number,number]) => void): Tween.Tween {        
        var n = this.route.shift();
        if (!n) return;
        
        let tween = new Tween.Tween(this.current)
            .to(n, 1000) //TODO: determine speed
            //.easing(Tween.Easing.Quadratic.Out)
            .onUpdate((pos) => { console.log(pos); cb(pos) })
            .onComplete(() => { this.render(r,cb) })
            .start();

        return tween;
    }


}