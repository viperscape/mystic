import render = require("./render");
import items = require("./items");
import {Player} from "./player";

export function run(target_gui) {
    render.render(target_gui);
    let i = items.load();
    console.log(i);
    let p = new Player;
}