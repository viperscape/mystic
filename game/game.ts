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
            this.map = new Map("cavern", i, this.ev);
            this.map.render(this.renderer);

            let input_handler_drop;
            this.ev.on("map", (m, cb?) => {
                if (input_handler_drop) input_handler_drop(); // drop old input handler and setup new one

                this.map = m; // update loaded map
                if (!this.map.mesh) { this.map.render(this.renderer) }
                this.map.player.handler(this.ev);

                if (cb) cb();
                this.console_append("Now entering the area "+m.name); // TODO: zone and render conflict on double emits

                let emit = (v: Three.Vector3) => {
                    this.ev.emit("input",{position:v});
                };
                
                if (this.map.mesh) {
                    let mesh: Three.Mesh[] = [this.map.mesh];
                    input_handler_drop = check_input(this.renderer, mesh, emit);
                }
            });

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

function check_input (r: render.Renderer, mesh: Three.Mesh[], cb: (v: Three.Vector3) => void): () => void {
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
            cb(intersects[0].point)
        }
    }

    return function() {
        document.removeEventListener('mousedown', onMouseDown);
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