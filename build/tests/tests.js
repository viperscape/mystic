"use strict";
exports.__esModule = true;
var chai = require("chai");
exports.assert = chai.assert;
var Tests = /** @class */ (function () {
    function Tests(tests_) {
        this.tests = [];
        this.tests = tests_;
        this.run();
    }
    Tests.prototype.run = function () {
        this.tests.forEach(function (e) {
            console.log("Running tests for:", e);
            for (var i in e) {
                console.log("  Test:", i);
                e[i]();
            }
        });
    };
    return Tests;
}());
exports.Tests = Tests;
