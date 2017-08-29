import fs = require("fs");
import {assert} from "./tests";

import {Map} from "../game/map";

export class MapTests {
    open_maps() {
        let files = fs.readdirSync("build/assets/maps/");
        assert(files.length > 0);
        
        files.forEach((f) => {
            let m = new Map(f);
        });
            
        // TODO add assert tests
    }
}