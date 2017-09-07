const chai = require("chai");
export const assert = chai.assert;

export class Tests {
    tests = [];
    
    constructor (tests_: any[]) {
        this.tests = tests_;
        this.run()
    }

    run () {
        this.tests.forEach((e) => {
            console.log("Running tests for:",e);
            for (var i in e) {
                if (typeof e[i] === "function") {
                    console.log("  Test:",i);
                    e[i]();
                }
            }
        });
    }
}
