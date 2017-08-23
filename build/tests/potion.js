"use strict";
exports.__esModule = true;
var tests_1 = require("./tests");
var player = require("../game/player");
var items = require("../game/items");
var PotionTests = /** @class */ (function () {
    function PotionTests() {
    }
    PotionTests.prototype.use_potion = function () {
        var p = new player.Player;
        p.attributes.insight = 5;
        p.attributes.health = 1;
        var potion = new items.Potion;
        potion.attributes.health = 5;
        potion.attributes.insight = -3;
        potion.use(p);
        tests_1.assert.equal(p.attributes.health, 6);
        tests_1.assert.equal(p.attributes.insight, 2);
    };
    return PotionTests;
}());
exports.PotionTests = PotionTests;
