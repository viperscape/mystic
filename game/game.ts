import render = require("./render");
import items = require("./items");
import {Player} from "./player";
import {Map} from "./map";
import {Move} from "./move";

export function run(target_gui) {
    //render.render(target_gui);
    items.load(function (i) {
        let renderer = render.init_3d();
        let map = new Map("study.json", i);
        map.render(renderer);

        let move = new Move(map.player.position, [0,3], map);
        console.log(move);
    });
}