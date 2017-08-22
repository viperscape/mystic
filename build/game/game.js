"use strict";
exports.__esModule = true;
var render = require("./render");
var items = require("./items");
function run(target_gui) {
    render.render(target_gui);
    var i = items.load();
    console.log(i);
}
exports.run = run;
