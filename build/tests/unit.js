"use strict";
exports.__esModule = true;
var chai = require("chai");
exports.assert = chai.assert;
var potion_1 = require("./potion");
var Tests = /** @class */ (function () {
    function Tests() {
        this.tests = [];
        this.tests.push(new potion_1.PotionTests);
        this.run();
    }
    Tests.prototype.run = function () {
        this.tests.forEach(function (e) {
            console.log("Running tests for:", e);
            for (var i in e) {
                console.log("  test:", i);
                e[i]();
            }
        });
    };
    return Tests;
}());
var _ = new Tests;
