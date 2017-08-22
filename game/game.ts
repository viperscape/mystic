import render = require("./render");
import items = require("./items");

export function run(target_gui) {
    render.render(target_gui);
    let i = items.load();
    console.log(i);
}