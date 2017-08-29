import render = require("./render");
import items = require("./items");
import {Player} from "./player";
import {Map} from "./map";

export function run(target_gui) {
    //render.render(target_gui);
    let i = items.load();
    console.log(i);
    let p = new Player;

    let renderer = render.init_3d();
    let map = new Map("basic.json");
    map.render(renderer);
}