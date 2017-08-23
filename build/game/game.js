"use strict";
exports.__esModule = true;
var render = require("./render");
var items = require("./items");
var player_1 = require("./player");
function run(target_gui) {
    render.render(target_gui);
    var i = items.load();
    console.log(i);
    var p = new player_1.Player;
}
exports.run = run;
