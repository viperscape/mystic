"use strict";
exports.__esModule = true;
var pixi = require("pixi.js");
var three = require("three");
var WIDTH = window.innerWidth;
var HEIGHT = window.innerHeight;
function render(target_gui) {
    var target = document.getElementById(target_gui);
    var ctx_2d = new pixi.Application(WIDTH, HEIGHT, { transparent: true });
    target.appendChild(ctx_2d.view);
    var ctx_3d = new three.WebGLRenderer({ antialias: true, alpha: true });
    document.body.appendChild(ctx_3d.domElement);
    draw_test(ctx_2d);
    draw_3d(ctx_3d);
}
exports.render = render;
function draw_test(ctx) {
    var text = new pixi.Text('mystic', { fontFamily: 'Consolas', fontSize: 14, fill: 0x222222, align: 'center' });
    text.interactive = true;
    text.on('mousedown', function (event) {
        console.log(event);
    });
    ctx.stage.addChild(text);
}
function draw_3d(ctx) {
    var VIEW_ANGLE = 45;
    var ASPECT = WIDTH / HEIGHT;
    var NEAR = 0.1;
    var FAR = 10000;
    var camera = new three.PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR);
    var scene = new three.Scene();
    scene.add(camera);
    ctx.setSize(WIDTH, HEIGHT);
    var geometry = new three.BoxGeometry(1, 1, 1);
    var material = new three.MeshNormalMaterial();
    var cube = new three.Mesh(geometry, material);
    scene.add(cube);
    camera.position.z = 5;
    var clock = new three.Clock();
    var render = function () {
        requestAnimationFrame(render);
        var delta = clock.getDelta();
        cube.rotation.x += 3.2 * delta;
        cube.rotation.y += 3.2 * delta;
        ctx.render(scene, camera);
    };
    render();
}
