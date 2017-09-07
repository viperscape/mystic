import render = require("./render");
import items = require("./items");
import {Player} from "./player";
import {Map} from "./map";
import {Move} from "./move";
import Three = require("three");

export function run(target_gui) {
    //render.render(target_gui);
    items.load(function (i) {
        let renderer = render.init_3d();
        let map = new Map("study.json", i);
        map.render(renderer);

        let move = new Move(map.player.position, [0,3], map);
        
        check_input(renderer, map);
        check_resize(renderer);
    });
}

function check_input (r: render.Renderer, map: Map) {
    document.addEventListener('mousedown', onMouseDown, false);
    function onMouseDown(event) {
        //event.preventDefault(); // ??
        let raycaster = new Three.Raycaster();
        let mouse = new Three.Vector2();

        mouse.x = ( event.clientX / r.ctx.domElement.clientWidth ) * 2 - 1;
        mouse.y = - ( event.clientY / r.ctx.domElement.clientHeight ) * 2 + 1;
        raycaster.setFromCamera( mouse, r.camera );
        let objects: Three.Mesh[] = [];
        map.objects.forEach((e) => { objects.push(e.renderable.mesh) }); // TODO: track tiles, player, and items separately

        let intersects = raycaster.intersectObjects( objects );
        if ( intersects.length > 0 ) {
            console.log("hit!");
        }
    }
}

function check_resize(r: render.Renderer) {
    window.addEventListener( 'resize', onWindowResize, false );
    function onWindowResize(e) {
        r.camera.aspect = window.innerWidth / window.innerHeight;
        r.camera.updateProjectionMatrix();
        r.ctx.setSize( window.innerWidth, window.innerHeight );
    }
}