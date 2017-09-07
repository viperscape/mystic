import {Map} from "./map";
import astar = require("javascript-astar");

export class Move {
    route: [[number,number]]; //start to finish list of tiles
    tile_cost: number; // cost of the current tile, to move from
    route_cost: number;

    constructor (from: [number,number], to: [number,number], map: Map) {
        this.route = [] as [[number,number]];
        let layout = [];
        map.layout.forEach((row, ridx) => {
            let row_ = [];
            row.forEach((e, eidx) => {
                // for now just push a regular/moveable tile
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
    }

    next () {
        let n = this.route.shift();
    }
}

// convert tile selection to coordinate
export function to_coord (n:number, map: Map): [number,number] {
    let coord;
    map.layout.forEach((row, ridx) => {
        row.forEach((_, eidx) => {
            n -= 1;
            if (n < 1) {
                if (!coord) coord = [ridx,eidx];
            }
        });
    });

    return coord;
}