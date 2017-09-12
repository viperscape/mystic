import render = require("./render");
import items = require("./items");
import {Player} from "./player";
import {Map} from "./map";

import Three = require("three");
import events = require('events');

export function run(target_gui) {
    let ev = new events();

    //render.render(target_gui);
    items.load(function (i) {
        let renderer = render.init_3d();
        let map = new Map("study.json", i);
        map.render(renderer);
        map.player.handler(ev);

        // check tile clicks
        let mesh: Three.Mesh[] = [];
        map.tiles.forEach((e) => { mesh.push(e.renderable.mesh) });

        let cb = (v: Three.Vector3) => {
            ev.emit("input",{tile:v});
        };
        check_input(renderer, mesh, cb);
        //

        check_resize(renderer);
    });
}

function check_input (r: render.Renderer, mesh: Three.Mesh[], cb: (v: Three.Vector3) => void) {
    document.addEventListener('mousedown', onMouseDown, false);
    function onMouseDown(event) {
        //event.preventDefault(); // ??
        let raycaster = new Three.Raycaster();
        let mouse = new Three.Vector2();

        mouse.x = ( event.clientX / r.ctx.domElement.clientWidth ) * 2 - 1;
        mouse.y = - ( event.clientY / r.ctx.domElement.clientHeight ) * 2 + 1;
        raycaster.setFromCamera( mouse, r.camera );

        let intersects = raycaster.intersectObjects(mesh);
        if (intersects.length > 0) {
            cb(intersects[0].object.getWorldPosition());
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