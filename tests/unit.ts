const chai = require("chai");
export const assert = chai.assert;

import {PotionTests} from "./potion";

class Tests {
    tests = [];
    
    constructor () {
        this.tests.push(new PotionTests);

        this.run()
    }

    run () {
        this.tests.forEach((e) => {
            console.log("Running tests for:",e);
            for (var i in e) {
                console.log("  test:",i);
                e[i]();
            }
        });
    }
}

let _ = new Tests;
