import fs = require("fs");
import {assert} from "./tests";

import {Map} from "../game/map";
import {Move} from "../game/move";

import {Vector3} from "three";

export class MapTests {
    maps: Map[] = [];

    open_maps() {
        let files = fs.readdirSync("build/assets/maps/");
        assert(files.length > 0);
        
        files.forEach((f) => {
            let map_file = f.split('.');
            if (map_file[1] == "json") this.maps.push(new Map(map_file[0]));
        });

        assert(this.maps.length > 0);
    }

    // expects open_maps to parse maps previously
    pathing() {
        let m = new Move(new Vector3(3,0,4), new Vector3(1,0,2), this.maps[0]);
        assert(m.route.length > 0);
    }
}