import {Map} from "./map";
import {Renderer} from "./render";

import astar = require("javascript-astar");
import Tween = require("@tweenjs/tween.js");

export class Move {
    route: [[number,number]]; //start to finish list of tiles
    current: {x,z};
    tween: Tween.Tween;

    // optionally use a decimal for tween start
    constructor (from: [number,number], to: [number,number], map: Map, current?: {x,z}) {
        this.route = [] as [[number,number]];
        this.route.push(from);

        let layout = [];
        // TODO: build this on map load, then populate with dynamic obstacles
        for (var ridx=0; ridx < 200; ridx++) {
            let row = [];
            for (var i=0; i < 200; i++) {
                row.push(1);
            }

            layout.push(row);
        }

        let g = new astar.Graph(layout, { diagonal: true });
        let s = g.grid[from[0]][from[1]];
        let e = g.grid[to[0]][to[1]];

        let r = astar.astar.search(g, s, e);
        r.forEach(e => {
            this.route.push([e.x,e.y]);
        });
        
        this.route.shift(); //remove first
        this.current = {x:from[0],z:from[1]};
        if (current) this.current = current;
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
        
        this.tween = new Tween.Tween(this.current)
            .to({x:xs,z:zs}, this.route.length * 250) //TODO: determine speed
            .interpolation(Tween.Interpolation.CatmullRom)
            .onUpdate(steps.update)
            .onComplete(steps.final)
            .start();
    }


}