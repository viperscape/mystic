import render = require("./render");
import items = require("./items");
import {Player} from "./player";
import {Map} from "./map";

import Three = require("three");
import events = require('events');

export class Game {
    ev: events;
    renderer: render.Renderer;
    map: Map;

    constructor(target_gui) {
        this.ev = new events();
        items.load((i) => {
            this.renderer = render.init_3d();
            this.map = new Map("study", i, this.ev);
            this.map.render(this.renderer);
            this.map.player.handler(this.ev);

            this.ev.on("map", (m, cb?) => {
                this.map = m; // update loaded map
                this.map.render(this.renderer);

                if (cb) cb();

                m.player.renderable.lookAt();
            });

            // check tile clicks
            let mesh: Three.Mesh[] = [];
            this.map.tiles.forEach((e) => { mesh.push(e.renderable.mesh) });

            let cb = (v: Three.Vector3) => {
                this.ev.emit("input",{tile:v});
            };
            check_input(this.renderer, mesh, cb);
            //

            check_resize(this.renderer);

            this.ev.on("gui", (data) => {
                if (data.toggle) {
                    if (data.toggle == "console") {
                        if (document.getElementById(data.toggle).style.display == '') {
                            document.getElementById(data.toggle).style.display = 'none';
                        } 
                        else document.getElementById(data.toggle).style.display = '';
                    }
                }
            });
        });
    }
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