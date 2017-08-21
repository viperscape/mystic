import pixi = require("pixi.js");

export function render () {
    var ctx = new pixi.Application(800, 600, { transparent: true });
    document.body.appendChild(ctx.view);

    draw_test(ctx)
}

render()

function draw_test(ctx) {
    let g = new pixi.Graphics();
    // set a fill and line style
    g.beginFill(0xFF3300);
    g.lineStyle(10, 0xffd900, 1);

    // draw a shape
    g.moveTo(50,50);
    g.lineTo(250, 50);
    g.lineTo(100, 100);
    g.lineTo(250, 220);
    g.lineTo(50, 220);
    g.lineTo(50, 50);
    g.endFill();

    ctx.stage.addChild(g);
}