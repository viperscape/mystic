"use strict";
exports.__esModule = true;
var pixi = require("pixi.js");
function render() {
    var ctx = new pixi.Application(800, 600, { transparent: true });
    document.body.appendChild(ctx.view);
    draw_test(ctx);
}
exports.render = render;
render();
function draw_test(ctx) {
    var text = new pixi.Text('draw test', { fontFamily: 'Arial', fontSize: 24, fill: 0xff1010, align: 'center' });
    text.interactive = true;
    text.on('mousedown', function (event) {
        console.log(event);
    });
    ctx.stage.addChild(text);
}
