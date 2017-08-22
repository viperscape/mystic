import pixi = require("pixi.js");
import three = require("three");

const WIDTH = window.innerWidth;
const HEIGHT = window.innerHeight;

export function render (target_gui) {
    let target = document.getElementById(target_gui);

    const ctx_2d = new pixi.Application(WIDTH, HEIGHT, { transparent: true });
    target.appendChild(ctx_2d.view);

    const ctx_3d = new three.WebGLRenderer({antialias:true, alpha:true});
    document.body.appendChild(ctx_3d.domElement);

    draw_test(ctx_2d);
    draw_3d(ctx_3d);
}

function draw_test(ctx) {
    let text = new pixi.Text('mystic',{fontFamily : 'Consolas', fontSize: 14, fill : 0x222222, align : 'center'});
    text.interactive = true;
    text.on('mousedown', (event) => {
        console.log(event)
     });
    ctx.stage.addChild(text);
}

function draw_3d(ctx) {    
    const VIEW_ANGLE = 45;
    const ASPECT = WIDTH / HEIGHT;
    const NEAR = 0.1;
    const FAR = 10000;

    
    const camera =
        new three.PerspectiveCamera(
            VIEW_ANGLE,
            ASPECT,
            NEAR,
            FAR
        );
    
    const scene = new three.Scene();
    
    scene.add(camera);
    ctx.setSize(WIDTH, HEIGHT);

    var geometry = new three.BoxGeometry(1,1,1);
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