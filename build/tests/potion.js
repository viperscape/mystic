"use strict";
exports.__esModule = true;
var unit_1 = require("./unit");
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
        unit_1.assert.equal(p.attributes.health, 6);
        unit_1.assert.equal(p.attributes.insight, 2);
    };
    return PotionTests;
}());
exports.PotionTests = PotionTests;
