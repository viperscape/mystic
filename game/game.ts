import render = require("./render");
import items = require("./items");
import {Player} from "./player";
import {Map} from "./map";
import {Move} from "./move";

export function run(target_gui) {
    //render.render(target_gui);
    items.load(function (i) {
        let renderer = render.init_3d();
        let map = new Map("study.json", i);
        map.render(renderer);

        let move = new Move(map.player.position, [0,3], map);
        
        check_input();
        check_resize(renderer);
    });
}

function check_input () {
    document.addEventListener('mousedown', onMouseDown, false);
    function onMouseDown(e) {
        console.log(e);
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