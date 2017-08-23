const chai = require("chai");
export const assert = chai.assert;

import {PotionTests} from "./potion";

class Tests {
    tests = [];
    
    constructor (tests_: any[]) {
        this.tests = tests_;
        this.run()
    }

    run () {
        this.tests.forEach((e) => {
            console.log("Running tests for:",e);
            for (var i in e) {
                console.log("  Test:",i);
                e[i]();
            }
        });
    }
}

let tests = [new PotionTests];
let _ = new Tests(tests);
