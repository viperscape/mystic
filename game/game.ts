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
    target_gui: string;

    constructor(target_gui) {
        this.target_gui = target_gui;
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
                this.console_append("Now entering the area "+m.name);
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
        });

        // TODO: move this gui/dom stuff out to a module
        this.ev.on("gui", (data) => {
            if (data.toggle) {
                let node = document.getElementById(data.toggle);
                if (node.style.display == '') node.style.display = 'none'
                else node.style.display = '';
            }
        });

        this.ev.on("console", (msg) => {
            this.console_append(msg);
        });
    }

    console_append(s: string) {
        let console = document.getElementById("console");
        let node = document.createElement("div");
        node.appendChild(document.createTextNode(s));

        console.appendChild(node);

        if (console.childNodes.length > 5) {
            console.removeChild(console.firstChild);
        }
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